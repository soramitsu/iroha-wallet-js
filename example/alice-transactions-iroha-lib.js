/* eslint-disable no-new */
const fs = require('fs')
const path = require('path')
const iroha = require('iroha-lib')
const grpc = require('grpc')

const endpointGrpc = require('iroha-lib/pb/endpoint_grpc_pb.js')
const queryBuilder = new iroha.ModelQueryBuilder()
const protoQueryHelper = new iroha.ModelProtoQuery()
const crypto = new iroha.ModelCrypto()

const accountId = 'alice@test'
const assetId = 'coolcoin#test'
const nodeIp = '51.15.244.195:50051'

/*
 * setup Alice's keys
 */
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, 'alice@test.priv')).toString().trim()
const alicePubKey = crypto.fromPrivateKey(alicePrivKeyHex).publicKey()

const keys = crypto.convertFromExisting(
  alicePubKey.hex(),
  alicePrivKeyHex
)

/*
 * send queries
 */
Promise.resolve()
  .then(function () {
    console.log('accountId:', accountId)
    console.log('assetId:', assetId)
    console.log('nodeIp:', nodeIp)
  })
  .then(
    /*
    * getAccountAssetTransactions
    */
    function getAccountAssetTransactions () {
      return new Promise((resolve, reject) => {
        const queryClient = new endpointGrpc.QueryServiceClient(
          nodeIp,
          grpc.credentials.createInsecure()
        )
        const query = queryBuilder
          .creatorAccountId(accountId)
          .createdTime(Date.now())
          .queryCounter(1)
          .getAccountAssetTransactions(accountId, assetId)
          .build()
        const protoQuery = makeProtoQueryWithKeys(query, keys)

        queryClient.find(protoQuery, (err, response) => {
          if (err) return reject(err)

          console.log('\ngetAccountAssetTransactions:', JSON.stringify(response.toObject(), null, '  '))

          resolve()
        })
      })
    }
  )
  .then(
    /*
    * getAccountTransactions
    */
    function getAccountTransactions () {
      return new Promise((resolve, reject) => {
        const queryClient = new endpointGrpc.QueryServiceClient(
          nodeIp,
          grpc.credentials.createInsecure()
        )
        const query = queryBuilder
          .creatorAccountId(accountId)
          .createdTime(Date.now())
          .queryCounter(1)
          .getAccountTransactions(accountId)
          .build()
        const protoQuery = makeProtoQueryWithKeys(query, keys)

        queryClient.find(protoQuery, (err, response) => {
          if (err) return reject(err)

          console.log('\ngetAccountTransactions:', JSON.stringify(response.toObject(), null, '  '))

          resolve()
        })
      })
    }
  )
  .catch(err => console.error(err))

/*
 * utilities
 */
function blob2array (blob) {
  const bytearray = new Uint8Array(blob.size())
  for (let i = 0; i < blob.size(); ++i) {
    bytearray[i] = blob.get(i)
  }
  return bytearray
}

function makeProtoQueryWithKeys (builtQuery, keys) {
  const pbQuery = require('iroha-lib/pb/queries_pb.js').Query

  const blob = protoQueryHelper.signAndAddSignature(builtQuery, keys).blob()
  const arr = blob2array(blob)
  const protoQuery = pbQuery.deserializeBinary(arr)

  return protoQuery
}
