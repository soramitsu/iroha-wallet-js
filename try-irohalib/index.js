/**
 * # how to run
 * ```
 * DEBUG=try-irohalib node try-irohalib/index.js
 * ```
 */
const debug = require('debug')('try-irohalib')
const fs = require('fs')
const path = require('path')
const iroha = require('iroha-lib')
const grpc = require('grpc')

// const PEER_IP = '51.15.244.195'
const PEER_IP = 'localhost'

const endpointGrpc = require('iroha-lib/pb/endpoint_grpc_pb.js')
const pbEndpoint = require('iroha-lib/pb/endpoint_pb.js')
const txBuilder = new iroha.ModelTransactionBuilder()
const queryBuilder = new iroha.ModelQueryBuilder()
const protoTxHelper = new iroha.ModelProtoTransaction()
const protoQueryHelper = new iroha.ModelProtoQuery()
const crypto = new iroha.ModelCrypto()

const creator = 'admin@test'
const adminPriv = fs.readFileSync(path.join(__dirname, '/admin@test.priv')).toString()
const adminPub = fs.readFileSync(path.join(__dirname, '/admin@test.pub')).toString()
const keys = crypto.convertFromExisting(adminPub, adminPriv)

fetchAccount()
  .then((account) => {
    debug('account', account)
  })
  .then(createAsset)
  .then(() => debug('done!'))
  .catch(err => console.error(err))

function createAsset () {
  debug('starting createAsset...')

  const tx = txBuilder
    .creatorAccountId(creator)
    .txCounter(1)
    .createdTime(Date.now())
    .createDomain('ru', 'user')
    .createAsset('coolcoin', 'test', 2)
    .build()
  const txClient = new endpointGrpc.CommandServiceClient(
    PEER_IP + ':50051',
    grpc.credentials.createInsecure()
  )
  const protoTx = makeProtoTxWithKeys(tx, keys)
  const txHash = blob2array(tx.hash().blob())

  debug('submitting transaction...')
  debug('peer ip:', PEER_IP)
  debug('creator account id:', protoTx.getPayload().getCreatorAccountId())
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

function fetchAccount () {
  debug('starting fetchAccount...')

  const queryClient = new endpointGrpc.QueryServiceClient(
    PEER_IP + ':50051',
    grpc.credentials.createInsecure()
  )
  const query = queryBuilder
    .creatorAccountId(creator)
    .createdTime(Date.now())
    .queryCounter(1)
    .getAccount('admin@test')
    .build()
  const protoQuery = makeProtoQueryWithKeys(query, keys)

  debug('submitting query...')
  debug('peer ip:', PEER_IP)
  debug('creator account id:', protoQuery.getPayload().getCreatorAccountId())
  debug('')

  return new Promise((resolve, reject) => {
    queryClient.find(protoQuery, (err, response) => {
      if (err) {
        return reject(err)
      }

      debug('submitted query successfully!')

      const type = response.getResponseCase()
      const pbResponse = require('iroha-lib/pb/responses_pb.js')
      const responseName = getProtoEnumName(
        pbResponse.QueryResponse.ResponseCase,
        'iroha.protocol.QueryResponse',
        type
      )

      if (responseName !== 'ACCOUNT_RESPONSE') {
        return reject(new Error(`Query response error: expected=ACCOUNT_RESPONSE, actual=${responseName}`))
      }

      const account = response.getAccountResponse().getAccount()

      resolve(account.toObject())
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
