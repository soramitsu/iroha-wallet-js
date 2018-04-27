/**
 * 2. Getting Started — Iroha 1.0 beta documentation
 * http://iroha.readthedocs.io/en/latest/getting_started/index.html?highlight=iroha%20cli#interacting-with-iroha-network
 */
const fs = require('fs')
const path = require('path')
const iroha = require('iroha-lib')
// const PEER_IP = '51.15.244.195'
const PEER_IP = 'localhost'

const txBuilder = new iroha.ModelTransactionBuilder()
const crypto = new iroha.ModelCrypto()
const protoTxHelper = new iroha.ModelProtoTransaction()

const adminPriv = fs.readFileSync(path.join(__dirname, '/admin@test.priv')).toString()
const adminPub = fs.readFileSync(path.join(__dirname, '/admin@test.pub')).toString()
const keys = crypto.convertFromExisting(adminPub, adminPriv)

const currentTime = Date.now()
const startTxCounter = 1
const creator = 'admin@test'

// build transaction
const tx = txBuilder
  .creatorAccountId(creator)
  .txCounter(startTxCounter)
  .createdTime(currentTime)
  .createDomain('ru', 'user')
  .createAsset('coolcoin', 'test', 2)
  .build()

// sign transaction and get its binary representation (Blob)
const txblob = protoTxHelper.signAndAddSignature(tx, keys).blob()
const txArray = blob2array(txblob)

// create proto object and send to iroha
const blockTransaction = require('iroha-lib/pb/block_pb.js').Transaction // block_pb2.Transaction()
const protoTx = blockTransaction.deserializeBinary(txArray)

const grpc = require('grpc')
const endpointGrpc = require('iroha-lib/pb/endpoint_grpc_pb.js')
const client = new endpointGrpc.CommandServiceClient(
  PEER_IP + ':50051',
  grpc.credentials.createInsecure()
)
const txHashBlob = tx.hash().blob()
const txHash = blob2array(txHashBlob)

console.log('peer ip:', PEER_IP)
console.log('creator account id:', protoTx.getPayload().getCreatorAccountId())
console.log('txhash:', Buffer.from(txHash).toString('hex'))
console.log('')

new Promise((resolve, reject) => {
  console.log('Submit transaction...')

  client.torii(protoTx, (err, data) => {
    if (err) {
      reject(err)
    } else {
      console.log('Submitted transaction successfully')
      resolve()
    }
  })
})
  .then(() => {
    console.log('Sleep 5 seconds...')
    return sleep(5000)
  })
  .then(() => {
    console.log('Send transaction status request...')

    return new Promise((resolve, reject) => {
      // create status request
      const endpointPb = require('iroha-lib/pb/endpoint_pb.js')
      const request = new endpointPb.TxStatusRequest()

      request.setTxHash(txHash)

      client.status(request, (err, response) => {
        if (err) {
          reject(err)
        } else {
          const status = response.getTxStatus()
          const TxStatus = require('iroha-lib/pb/endpoint_pb.js').TxStatus
          const statusName = getProtoEnumName(
            TxStatus,
            'iroha.protocol.TxStatus',
            status
          )

          console.log('Got transaction status: ' + statusName)
          if (statusName !== 'COMMITTED') {
            reject(new Error("Your transaction wasn't committed"))
          } else {
            resolve()
          }
        }
      })
    })
  })
  .then(() => console.log('done!'))
  .catch(err => console.log(err))

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
