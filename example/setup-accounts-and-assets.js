/* eslint-disable no-unused-vars */
/*
 * NODE_IP=localhost:50051 DEBUG=iroha-util node example/setup-accounts-and-assets.js
 */
const fs = require('fs')
const path = require('path')
const iroha = require('iroha-lib')
const irohaUtil = require('../src/util/iroha-util')

const crypto = new iroha.ModelCrypto()
const adminPrivKeyHex = fs.readFileSync(path.join(__dirname, 'admin@test.priv')).toString().trim()
const adminPubKey = crypto.fromPrivateKey(adminPrivKeyHex).publicKey()
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, 'alice@test.priv')).toString().trim()
const alicePubKey = crypto.fromPrivateKey(alicePrivKeyHex).publicKey()

const nodeIp = process.env.NODE_IP || 'localhost:50051'

irohaUtil.login('admin@test', adminPrivKeyHex, nodeIp)
  .then(() => tryToCreateAccount('alice', 'test', alicePubKey))
  .then(() => tryToCreateAsset('coolcoin', 'test', 2))
  .then(() => tryToCreateAsset('hotcoin', 'test', 5))
  .then(() => irohaUtil.addAssetQuantity('coolcoin#test', '1000.00'))
  .then(() => irohaUtil.addAssetQuantity('hotcoin#test', '1000.00000'))
  .then(() => irohaUtil.transferAsset('admin@test', 'alice@test', 'coolcoin#test', 'hi', '0.50'))
  .then(() => irohaUtil.transferAsset('admin@test', 'alice@test', 'hotcoin#test', 'hi', '0.50000'))
  .catch(err => console.error(err))

function tryToCreateAccount (accountName, domainId, publicKey) {
  return new Promise((resolve, reject) => {
    irohaUtil.createAccount(accountName, domainId, publicKey)
      .then(() => {
        console.log(`${accountName}@${domainId} has successfully been created`)
        resolve()
      })
      .catch(err => {
        irohaUtil.getAccount(accountName + '@' + domainId)
          .then(account => {
            console.log(`${account.accountId} already exist`)
            resolve()
          })
          .catch(() => reject(err))
      })
  })
}

function tryToCreateAsset (assetName, domainId, precision) {
  return new Promise((resolve, reject) => {
    irohaUtil.createAsset(assetName, domainId, precision)
      .then(() => {
        console.log(`${assetName}#${domainId} (precision: ${precision}) has successfully been created`)
        resolve()
      })
      .catch(err => {
        irohaUtil.getAssetInfo(assetName + '#' + domainId)
          .then(info => {
            if (info.asset.precision === precision) {
              console.log(`${assetName}#${domainId} (precision: ${precision}) already exist`)
              resolve()
            } else {
              reject(new Error(`${assetName}#${domainId} is already used with different precision.`))
            }
          })
          .catch(() => reject(err))
      })
  })
}
