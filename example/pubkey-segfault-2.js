const fs = require('fs')
const path = require('path')
const grpc = require('grpc')
const iroha = require('iroha-lib')

const crypto = new iroha.ModelCrypto()
const endpointGrpc = require('iroha-lib/pb/endpoint_grpc_pb.js')
const pbResponse = require('iroha-lib/pb/responses_pb.js')
const queryBuilder = new iroha.ModelQueryBuilder()
const protoQueryHelper = new iroha.ModelProtoQuery()

const NODE_IP = process.env.NODE_IP || '51.15.244.195:50051'

const adminPrivKeyHex = fs.readFileSync(path.join(__dirname, 'admin@test.priv')).toString().trim()
const adminKeys = crypto.convertFromExisting(
  crypto.fromPrivateKey(adminPrivKeyHex).publicKey().hex(),
  adminPrivKeyHex
)

function getAccount () {
  return new Promise((resolve, reject) => {
    const queryClient = new endpointGrpc.QueryServiceClient(
      NODE_IP,
      grpc.credentials.createInsecure()
    )
    const query = queryBuilder
      .creatorAccountId('admin@test')
      .createdTime(Date.now())
      .queryCounter(1)
      .getAccount('admin@test')
      .build()
    const protoQuery = makeProtoQueryWithKeys(query, adminKeys)

    queryClient.find(protoQuery, (err, response) => {
      if (err) {
        return reject(err)
      }

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

      resolve(account)
    })
  })
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
        console.log(
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

function doSomething () {
  return new Promise((resolve, reject) => {
    const queryClient = new endpointGrpc.QueryServiceClient(
      NODE_IP,
      grpc.credentials.createInsecure()
    )
    const query = queryBuilder
      .creatorAccountId('admin@test')
      .createdTime(Date.now())
      .queryCounter(1)
      .getAccount('admin@test')
      .build()
    const protoQuery = makeProtoQueryWithKeys(query, adminKeys)

    queryClient.find(protoQuery, () => {
      resolve()
    })
  })
}

module.exports = {
  doSomething
}
