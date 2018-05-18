/*
 * # description
 * `publicKey.hex()` returns unexpected results sometimes if use Babel (maybe because of babel-node?)
 * example/pubkey-segfault.js and example/pubkey-segfault-2.js are codes to reproduce it.
 *
 * # how to run:
 * ```
 *  BABEL_DISABLE_CACHE=1 babel-node --presets env example/pubkey-segfault.js
 * ```
 *
 * # how to run N times:
 * ```
 *  N=10 ;for i in {1..$N}; do echo "[$i/$N]"; BABEL_DISABLE_CACHE=1 babel-node --presets env example/pubkey-segfault.js; done
 * ```
 *
 * # expected:
 * ```
 *   % BABEL_DISABLE_CACHE=1 babel-node --presets env example/pubkey-segfault.js
 *  1
 *  alicePubKey.hex(): bcc4ab167ae7db371672170ed31e382f7c612fbfe918f99c276cd9dc199446a4
 *  2
 *  alicePubKey.hex(): bcc4ab167ae7db371672170ed31e382f7c612fbfe918f99c276cd9dc199446a4
 * ```
 *
 * # actual 1:
 * ```
 *   % BABEL_DISABLE_CACHE=1 babel-node --presets env example/pubkey-segfault.js
 *  1
 *  alicePubKey.hex(): bcc4ab167ae7db371672170ed31e382f7c612fbfe918f99c276cd9dc199446a4
 *  2
 *  alicePubKey.hex(): �#072170ed31e382f7c612fbfe918f99c276cd9dc199446a4
 * ```
 *
 * # actual 2:
 * ```
 *   % BABEL_DISABLE_CACHE=1 babel-node --presets env example/pubkey-segfault.js
 *  1
 *  alicePubKey.hex(): bcc4ab167ae7db371672170ed31e382f7c612fbfe918f99c276cd9dc199446a4
 *  2
 *  [1]    65843 segmentation fault  BABEL_DISABLE_CACHE=1 babel-node --presets env example/pubkey-segfault.js
 * ```
 */
const fs = require('fs')
const path = require('path')
const iroha = require('iroha-lib')
const { doSomething } = require('./pubkey-segfault-2')

const crypto = new iroha.ModelCrypto()
const adminPrivKeyHex = fs.readFileSync(path.join(__dirname, 'admin@test.priv')).toString().trim()
const adminPubKey = crypto.fromPrivateKey(adminPrivKeyHex).publicKey()
const alicePrivKeyHex = fs.readFileSync(path.join(__dirname, 'alice@test.priv')).toString().trim()
const alicePubKey = crypto.fromPrivateKey(alicePrivKeyHex).publicKey()

console.log(1)
console.log('alicePubKey.hex():', alicePubKey.hex())

doSomething()
  .then(() => {
    console.log(2)
    console.log('alicePubKey.hex():', alicePubKey.hex())
  })
