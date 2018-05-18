/* eslint-disable no-unused-vars */
import fs from 'fs'
import path from 'path'
import iroha from 'iroha-lib'
import irohaUtil from '../src/util/iroha-util'

const crypto = new iroha.ModelCrypto()
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, 'alice@test.priv')).toString().trim()
const alicePubKey = crypto.fromPrivateKey(alicePrivKeyHex).publicKey()
const adminPrivKeyHex = fs.readFileSync(path.join(__dirname, 'admin@test.priv')).toString().trim()
const adminPubKey = crypto.fromPrivateKey(adminPrivKeyHex).publicKey()

const nodeIp = '51.15.244.195:50051'

irohaUtil.login('alice@test', alicePrivKeyHex, nodeIp)

  .then(() => irohaUtil.getAccountAssets('alice@test', 'coolcoin#test'))
  .then(assets => console.log('\nAlice\'s coolcoin#test:', JSON.stringify(assets, null, '  ')))

  .then(() => irohaUtil.getAccountAssetTransactions('alice@test', 'coolcoin#test'))
  .then(transactions => console.log('\nAlice\'s transactions of coolcoin#test:', JSON.stringify(transactions, null, '  ')))

  .then(() => irohaUtil.getAccountTransactions('alice@test'))
  .then(transactions => console.log('\nAlice\'s transactions:', transactions))

  .catch(err => console.error(err))
