/* eslint-disable no-unused-vars */
/* eslint-disable no-return-await */
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import {
  derivePublicKey
} from 'ed25519.js'

import grpc from 'grpc'
import {
  QueryService_v1Client as QueryService,
  CommandService_v1Client as CommandService
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'
import { commands, queries } from 'iroha-helpers'

const irohaDomain = 'iroha'
const testAccName = 'admin'
const aliceAccName = 'alice'
const testAccFull = `${testAccName}@${irohaDomain}`
const aliceAccFull = `${aliceAccName}@${irohaDomain}`

const testPrivKeyHex = fs.readFileSync(path.join(__dirname, `${testAccFull}.priv`)).toString().trim()
const testPubKey = derivePublicKey(Buffer.from(testPrivKeyHex, 'hex')).toString('hex')
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, `${aliceAccFull}.priv`)).toString().trim()
const alicePubKey = derivePublicKey(Buffer.from(alicePrivKeyHex, 'hex')).toString('hex')

const NODE_IP = process.env.NODE_IP || 'localhost:50051'
const DEFAULT_TIMEOUT_LIMIT = 5000
const DUMMY_FILE_PATH = path.join(__dirname, 'wallets.json')
const accounts = [testAccFull, aliceAccFull]
const wallets = require(DUMMY_FILE_PATH).wallets

console.log('\x1b[33m%s\x1b[0m', '#### INFO ####')
console.log(`setting up accounts and assets with using '${DUMMY_FILE_PATH}'`)
console.log(`accounts: ${accounts.join(', ')}`)
console.log(`assets: ${wallets.map(w => w.name).join(', ')}`)
console.log('\x1b[33m%s\x1b[0m', '#### INFO ####\n')

function newCommandServiceOptions (privateKeys, quorum, accountId) {
  return {
    privateKeys,
    quorum,
    creatorAccountId: accountId,
    commandService: new CommandService(
      NODE_IP,
      grpc.credentials.createInsecure()
    ),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

function newQueryServiceOptions (privateKey, accountId) {
  return {
    privateKey: privateKey,
    creatorAccountId: accountId,
    queryService: new QueryService(
      NODE_IP,
      grpc.credentials.createInsecure()
    ),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

new Promise((resolve, reject) => resolve())
  .then(async () => await tryToCreateAccount(aliceAccName, irohaDomain, alicePubKey))
  .then(async () => setup())
  .then((res) => console.log(res))
  .then(() => console.log('### DONE ###'))
  .catch((err) => console.log(err))

async function setup () {
  await initializeAssets()
}

async function initializeAssets () {
  console.log('initializing assets')

  for (let w of wallets) {
    const precision = w.precision
    const amount = w.amount
    const assetName = w.name.toLowerCase()
    const assetId = assetName + `#${irohaDomain}`

    console.log('\x1b[36m%s\x1b[0m', `#### ${assetName} BEGIN ####`)

    await tryToCreateAsset(assetName, irohaDomain, precision)
    await tryAddAssetQuantity(assetId, amount)
    await tryToSplitAmount(assetId, amount)
    await tryToSendRandomAmount(assetId, testAccFull, amount, precision, [testPrivKeyHex], 1)
    await tryToSendRandomAmount(assetId, aliceAccFull, amount, precision, [alicePrivKeyHex], 1)

    console.log('\x1b[36m%s\x1b[0m', `#### ${assetName} END ####`)
  }
}

async function tryToCreateAccount (accountName, domainId, publicKey) {
  console.log(`trying to create an account: ${accountName}@${domainId}`)
  try {
    await commands.createAccount(
      newCommandServiceOptions([testPrivKeyHex], 1, testAccFull),
      {
        accountName,
        domainId,
        publicKey
      }
    )
    console.log(`${accountName}@${domainId} has successfully been created`)
  } catch (error) {
    const accountId = `${accountName}@${domainId}`
    try {
      const account = await queries.getAccount(
        newQueryServiceOptions(testPrivKeyHex, testAccFull),
        {
          accountId
        }
      )
      console.log(`${account.accountId} already exist`)
    } catch (error) {
      console.log(error)
    }
  }
}

async function tryToCreateAsset (assetName, domainId, precision) {
  console.log(`trying to create an asset: ${assetName}#${domainId} (precision=${precision})`)
  try {
    await commands.createAsset(
      newCommandServiceOptions([testPrivKeyHex], 1, testAccFull),
      {
        assetName,
        domainId,
        precision
      }
    )
    console.log(`${assetName}#${domainId} (precision: ${precision}) has successfully been created`)
  } catch (error) {
    try {
      const assetId = `${assetName}#${domainId}`
      const info = await queries.getAssetInfo(
        newQueryServiceOptions(testPrivKeyHex, testAccFull),
        {
          assetId
        }
      )
      if (info.precision === precision) {
        console.log(`${assetName}#${domainId} (precision=${precision}) already exist`)
      } else {
        console.log(`${assetName}#${domainId} is already used with different precision`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

async function tryAddAssetQuantity (assetId, amount) {
  console.log(`adding initial amount of ${assetId} to ${testAccFull}`)
  try {
    await commands.addAssetQuantity(
      newCommandServiceOptions([testPrivKeyHex], 1, testAccFull),
      {
        assetId,
        amount
      }
    )
  } catch (error) {
    console.log(`Error! Asset quantity not added ${assetId} ${amount}`)
  }
}

async function tryToSplitAmount (assetId, amount) {
  const splittedAmount = String(Math.round(amount * 0.3))
  console.log(`transfer 1/3 ${splittedAmount} initial amount of ${assetId} to ${aliceAccFull}`)
  try {
    await commands.transferAsset(
      newCommandServiceOptions([testPrivKeyHex], 1, testAccFull),
      {
        srcAccountId: testAccFull,
        destAccountId: aliceAccFull,
        assetId,
        description: 'transfer 1/3',
        amount: splittedAmount
      }
    )
  } catch (error) {
    console.log(`Error! Can't transfer 1/3 to ${aliceAccFull}`)
  }
}

async function tryToSendRandomAmount (assetId, accountId, amount, precision, privateKeys, quorum) {
  console.log(`Sending random amount (${amount}) of ${assetId} to ${accountId}`)
  const from = accountId
  const to = _.sample(_.without(accounts, from))
  const txAmount = _.random(3, 5)
  for (let i = 0; i < txAmount; i++) {
    const message = _.sample(['Deal #1', 'Deal #2', 'Deal #3', 'PART_OF_DUMMY_SETTLEMENT'])
    const amount = String(Math.random()).substr(0, precision + 2)
    try {
      await commands.transferAsset(
        newCommandServiceOptions(privateKeys, quorum, accountId),
        {
          srcAccountId: from,
          destAccountId: to,
          assetId,
          description: message,
          amount: amount
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
}
