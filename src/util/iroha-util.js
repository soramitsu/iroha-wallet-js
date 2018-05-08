/* eslint-disable no-unused-vars */
/**
 * # how to run
 * ```
 * DEBUG=iroha-util node path/to/index.js
 * ```
 */
const debug = require('debug')('iroha-util')
const iroha = require('iroha-lib')
const grpc = require('grpc')

const endpointGrpc = require('iroha-lib/pb/endpoint_grpc_pb.js')
const pbEndpoint = require('iroha-lib/pb/endpoint_pb.js')
const pbResponse = require('iroha-lib/pb/responses_pb.js')
const txBuilder = new iroha.ModelTransactionBuilder()
const queryBuilder = new iroha.ModelQueryBuilder()
const protoTxHelper = new iroha.ModelProtoTransaction()
const protoQueryHelper = new iroha.ModelProtoQuery()
const crypto = new iroha.ModelCrypto()

/*
 * storage
 */
const storage = {
  username: null,
  keys: null,
  nodeIp: null
}

// if this file is directly run
if (require.main === module) {
  /*
  * user inputs
  */
  const username = 'admin@test'
  const privateKey = '1d7e0a32ee0affeb4d22acd73c2c6fb6bd58e266c8c2ce4fa0ffe3dd6a253ffb'
  // const nodeIp = '51.15.244.195:50051'
  const nodeIp = 'localhost:50051'

  /*
  login(username, privateKey, nodeIp)
    .then(() => createAsset('coolcoin', 'test', 2))
    .then(() => createAsset('supercoin', 'test', 5))
    .then(() => addAssetQuantity(storage.username, 'coolcoin#test', '200.50'))
  */

  login(username, privateKey, nodeIp)
    .then(() => getAccountAssets(storage.username, 'coolcoin#test'))
    .then(() => transferAsset(storage.username, 'test@test', 'coolcoin#test', 'hello world', '1.00'))
    .then(() => getAccountAssets(storage.username, 'coolcoin#test'))
    .then(() => getAccountAssets('test@test', 'coolcoin#test'))
    .then(() => getAccountAssetTransactions('test@test', 'coolcoin#test'))
    .catch(err => console.error(err))
}

/**
 * ===== functions =====
 */
function login (username, privateKey, nodeIp) {
  debug('starting login...')

  if (privateKey.length !== 64) {
    return Promise.reject(new Error('privateKey should have length of 64'))
  }

  const keys = crypto.convertFromExisting(
    crypto.fromPrivateKey(privateKey).publicKey().hex(),
    privateKey
  )

  storage.username = username
  storage.keys = keys
  storage.nodeIp = nodeIp

  return getAccount(username)
    .then(account => {
      debug('login succeeded!')
      return account
    })
    .catch(err => {
      debug('login failed')
      throw err
    })
}

function getAccount (accountId) {
  debug('starting getAccount...')

  const queryClient = new endpointGrpc.QueryServiceClient(
    storage.nodeIp,
    grpc.credentials.createInsecure()
  )
  const query = queryBuilder
    .creatorAccountId(storage.username)
    .createdTime(Date.now())
    .queryCounter(1)
    .getAccount(accountId)
    .build()
  const protoQuery = makeProtoQueryWithKeys(query, storage.keys)

  debug('submitting query...')
  debug('peer ip:', storage.nodeIp)
  debug('parameters:', JSON.stringify(protoQuery.toObject().payload, null, '  '))
  debug('')

  return new Promise((resolve, reject) => {
    queryClient.find(protoQuery, (err, response) => {
      if (err) {
        return reject(err)
      }

      debug('submitted query successfully!')

      const type = response.getResponseCase()
      const responseName = getProtoEnumName(
        pbResponse.QueryResponse.ResponseCase,
        'iroha.protocol.QueryResponse',
        type
      )

      if (responseName !== 'ACCOUNT_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_RESPONSE, actual=${responseName}`))
      }

      const account = response.getAccountResponse().getAccount().toObject()

      debug('account', account)

      resolve(account)
    })
  })
}

function getAccountAssetTransactions (accountId, assetId) {
  debug('starting getAccountAssetTransactions...')

  const queryClient = new endpointGrpc.QueryServiceClient(
    storage.nodeIp,
    grpc.credentials.createInsecure()
  )
  const query = queryBuilder
    .creatorAccountId(storage.username)
    .createdTime(Date.now())
    .queryCounter(1)
    .getAccountAssetTransactions(accountId, assetId)
    .build()
  const protoQuery = makeProtoQueryWithKeys(query, storage.keys)

  debug('submitting query...')
  debug('peer ip:', storage.nodeIp)
  debug('parameters:', JSON.stringify(protoQuery.toObject().payload, null, '  '))
  debug('')

  return new Promise((resolve, reject) => {
    queryClient.find(protoQuery, (err, response) => {
      if (err) {
        return reject(err)
      }

      debug('submitted query successfully!')

      const type = response.getResponseCase()
      const responseName = getProtoEnumName(
        pbResponse.QueryResponse.ResponseCase,
        'iroha.protocol.QueryResponse',
        type
      )

      if (responseName !== 'TRANSACTIONS_RESPONSE') {
        return reject(new Error(`Query response error: expected=TRANSACTIONS_RESPONSE, actual=${responseName}`))
      }

      const transactions = response.getTransactionsResponse().toObject().transactionsList

      debug('transactions', transactions)

      resolve(transactions)
    })
  })
}

function getAccountAssets (accountId, assetId) {
  debug('starting getAccountAssets...')

  const queryClient = new endpointGrpc.QueryServiceClient(
    storage.nodeIp,
    grpc.credentials.createInsecure()
  )
  const query = queryBuilder
    .creatorAccountId(storage.username)
    .createdTime(Date.now())
    .queryCounter(1)
    .getAccountAssets(accountId, assetId)
    .build()
  const protoQuery = makeProtoQueryWithKeys(query, storage.keys)

  debug('submitting query...')
  debug('peer ip:', storage.nodeIp)
  debug('parameters:', JSON.stringify(protoQuery.toObject().payload, null, '  '))
  debug('')

  return new Promise((resolve, reject) => {
    queryClient.find(protoQuery, (err, response) => {
      if (err) {
        return reject(err)
      }

      debug('submitted query successfully!')

      const type = response.getResponseCase()
      const responseName = getProtoEnumName(
        pbResponse.QueryResponse.ResponseCase,
        'iroha.protocol.QueryResponse',
        type
      )

      if (responseName !== 'ACCOUNT_ASSETS_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_ASSETS_RESPONSE, actual=${responseName}`))
      }

      const assets = response.getAccountAssetsResponse().toObject()

      debug('assets', assets)

      resolve(assets)
    })
  })
}

function createAsset (assetName, domainId, precision) {
  debug('starting createAsset...')

  const tx = txBuilder
    .creatorAccountId(storage.username)
    .txCounter(1)
    .createdTime(Date.now())
    .createAsset(assetName, domainId, precision)
    .build()
  const txClient = new endpointGrpc.CommandServiceClient(
    storage.nodeIp,
    grpc.credentials.createInsecure()
  )
  const protoTx = makeProtoTxWithKeys(tx, storage.keys)
  const txHash = blob2array(tx.hash().blob())

  debug('submitting transaction...')
  debug('peer ip:', storage.nodeIp)
  debug('parameters:', JSON.stringify(protoTx.toObject().payload, null, '  '))
  debug('txhash:', Buffer.from(txHash).toString('hex'))
  debug('')

  return new Promise((resolve, reject) => {
    txClient.torii(protoTx, (err, data) => {
      if (err) {
        return reject(err)
      }

      debug('submitted transaction successfully!')
      resolve()
    })
  })
    .then(() => {
      debug('sleep 5 seconds...')
      return sleep(5000)
    })
    .then(() => {
      debug('sending transaction status request...')

      return new Promise((resolve, reject) => {
        const request = new pbEndpoint.TxStatusRequest()

        request.setTxHash(txHash)

        txClient.status(request, (err, response) => {
          if (err) {
            return reject(err)
          }

          const status = response.getTxStatus()
          const TxStatus = require('iroha-lib/pb/endpoint_pb.js').TxStatus
          const statusName = getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            status
          )

          if (statusName !== 'COMMITTED') {
            return reject(new Error(`Your transaction wasn't commited: expected=COMMITED, actual=${statusName}`))
          }

          resolve()
        })
      })
    })
}

function addAssetQuantity (accountId, assetId, amount) {
  debug('starting addAssetQuantity...')

  const tx = txBuilder
    .creatorAccountId(storage.username)
    .txCounter(1)
    .createdTime(Date.now())
    .addAssetQuantity(accountId, assetId, amount)
    .build()
  const txClient = new endpointGrpc.CommandServiceClient(
    storage.nodeIp,
    grpc.credentials.createInsecure()
  )
  const protoTx = makeProtoTxWithKeys(tx, storage.keys)
  const txHash = blob2array(tx.hash().blob())

  debug('submitting transaction...')
  debug('peer ip:', storage.nodeIp)
  debug('parameters:', JSON.stringify(protoTx.toObject().payload, null, '  '))
  debug('txhash:', Buffer.from(txHash).toString('hex'))
  debug('')

  return new Promise((resolve, reject) => {
    txClient.torii(protoTx, (err, data) => {
      if (err) {
        return reject(err)
      }

      debug('submitted transaction successfully!')
      resolve()
    })
  })
    .then(() => {
      debug('sleep 5 seconds...')
      return sleep(5000)
    })
    .then(() => {
      debug('sending transaction status request...')

      return new Promise((resolve, reject) => {
        const request = new pbEndpoint.TxStatusRequest()

        request.setTxHash(txHash)

        txClient.status(request, (err, response) => {
          if (err) {
            return reject(err)
          }

          const status = response.getTxStatus()
          const TxStatus = require('iroha-lib/pb/endpoint_pb.js').TxStatus
          const statusName = getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            status
          )

          if (statusName !== 'COMMITTED') {
            return reject(new Error(`Your transaction wasn't commited: expected=COMMITED, actual=${statusName}`))
          }

          resolve()
        })
      })
    })
}

function transferAsset (srcAccountId, destAccountId, assetId, description, amount) {
  debug('starting transferAsset...')

  const tx = txBuilder
    .creatorAccountId(storage.username)
    .txCounter(1)
    .createdTime(Date.now())
    .transferAsset(srcAccountId, destAccountId, assetId, description, amount)
    .build()
  const txClient = new endpointGrpc.CommandServiceClient(
    storage.nodeIp,
    grpc.credentials.createInsecure()
  )
  const protoTx = makeProtoTxWithKeys(tx, storage.keys)
  const txHash = blob2array(tx.hash().blob())

  debug('submitting transaction...')
  debug('peer ip:', storage.nodeIp)
  debug('parameters:', JSON.stringify(protoTx.toObject().payload, null, '  '))
  debug('txhash:', Buffer.from(txHash).toString('hex'))
  debug('')

  return new Promise((resolve, reject) => {
    txClient.torii(protoTx, (err, data) => {
      if (err) {
        return reject(err)
      }

      debug('submitted transaction successfully!')
      resolve()
    })
  })
    .then(() => {
      debug('sleep 5 seconds...')
      return sleep(5000)
    })
    .then(() => {
      debug('sending transaction status request...')

      return new Promise((resolve, reject) => {
        const request = new pbEndpoint.TxStatusRequest()

        request.setTxHash(txHash)

        txClient.status(request, (err, response) => {
          if (err) {
            return reject(err)
          }

          const status = response.getTxStatus()
          const TxStatus = require('iroha-lib/pb/endpoint_pb.js').TxStatus
          const statusName = getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            status
          )

          if (statusName !== 'COMMITTED') {
            return reject(new Error(`Your transaction wasn't commited: expected=COMMITED, actual=${statusName}`))
          }

          resolve()
        })
      })
    })
}

/*
 *  ===== utilities ===
 */
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function blob2array (blob) {
  const bytearray = new Uint8Array(blob.size())
  for (let i = 0; i < blob.size(); ++i) {
    bytearray[i] = blob.get(i)
  }
  return bytearray
}

const protoEnumName = {}
function getProtoEnumName (obj, key, value) {
  if (protoEnumName.hasOwnProperty(key)) {
    if (protoEnumName[key].length < value) {
      return 'unknown'
    } else {
      return protoEnumName[key][value]
    }
  } else {
    protoEnumName[key] = []
    for (var k in obj) {
      let idx = obj[k]
      if (isNaN(idx)) {
        debug(
          'getProtoEnumName:wrong enum value, now is type of ' +
            typeof idx +
            ' should be integer'
        )
      } else {
        protoEnumName[key][idx] = k
      }
    }
    return getProtoEnumName(obj, key, value)
  }
}

function makeProtoQueryWithKeys (builtQuery, keys) {
  const pbQuery = require('iroha-lib/pb/queries_pb.js').Query

  const blob = protoQueryHelper.signAndAddSignature(builtQuery, keys).blob()
  const arr = blob2array(blob)
  const protoQuery = pbQuery.deserializeBinary(arr)

  return protoQuery
}

function makeProtoTxWithKeys (builtTx, keys) {
  const pbTransaction = require('iroha-lib/pb/queries_pb.js').Transaction

  const blob = protoTxHelper.signAndAddSignature(builtTx, keys).blob()
  const arr = blob2array(blob)
  const protoTx = pbTransaction.deserializeBinary(arr)

  return protoTx
}

/*
 *  ===== export ===
 */
export default {
  login,
  getAccount,
  getAccountAssets,
  getAccountAssetTransactions
}
