import fs from 'fs'
import path from 'path'
import iroha from 'iroha-lib'
import irohaUtil from '../src/util/iroha-util'

const crypto = new iroha.ModelCrypto()
const pubKey = crypto.fromPrivateKey(fs.readFileSync(path.join(__dirname, 'alice@test.priv'))).publicKey()

irohaUtil.login('admin@test', '1d7e0a32ee0affeb4d22acd73c2c6fb6bd58e266c8c2ce4fa0ffe3dd6a253ffb', '51.15.244.195:50051')
  .then(() => irohaUtil.createAccount('alice', 'test', pubKey))
  .then(() => irohaUtil.transferAsset('admin@test', 'alice@test', 'coolcoin#test', '', '100.00'))
  .then(() => console.log('done!'))
  .catch(err => console.error(err))
