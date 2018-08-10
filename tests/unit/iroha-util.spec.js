import irohaUtil from '../../src/util/iroha-util'

describe('iroha-util', function () {
  this.timeout(10000)

  const ADMIN_ACCOUNT_ID = 'admin@test'
  const ADMIN_PRIVATE_KEY = 'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70'
  const NODE_IP = 'localhost:50051'
  const EXISTING_ASSET = 'coolcoin#test'
  const NONEXISTING_ASSET = 'notexist#test'

  console.info(`NODE_IP: ${NODE_IP}`)

  function logout () {
    return irohaUtil.logout()
  }

  describe('#login', () => {
    after(logout)

    it('should fail if privateKey.length != 64', done => {
      irohaUtil.login('admin@test', '', NODE_IP)
        .then(() => done(new Error('login should fail')))
        .catch(() => done())
    })

    it('should fail if account ID does not exist', done => {
      irohaUtil.login('notexist@test', '0d828447cc2e4b3682ed5897b615b36d0d828447cc2e4b3682ed5897b615b36a', NODE_IP)
        .then(() => done(new Error('login should fail')))
        .catch(() => done())
    })

    it('should fail if invalid node IP is set', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, String(Math.random()))
        .then(() => done(new Error('login should fail')))
        .catch(() => done())
    })

    it('should succeed with valid parameters', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, NODE_IP)
        .then(() => done())
        .catch(err => done(err))
    })
  })

  describe('#getAccountAssets', () => {
    afterEach(logout)

    it('should fail before login', done => {
      irohaUtil.getAccountAssets(ADMIN_ACCOUNT_ID)
        .then(() => done(new Error('query should fail')))
        .catch(() => done())
    })

    it('should succeed after login', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, NODE_IP)
        .then(() => irohaUtil.getAccountAssets(ADMIN_ACCOUNT_ID))
        .then(() => done())
        .catch(err => done(err))
    })
  })

  describe('#getAccountAssetTransactions', () => {
    afterEach(logout)

    it('should fail before login', done => {
      irohaUtil.getAccountAssetTransactions(ADMIN_ACCOUNT_ID, EXISTING_ASSET)
        .then(() => done(new Error('query should fail')))
        .catch(() => done())
    })

    it('should succeed after login', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, NODE_IP)
        .then(() => irohaUtil.getAccountAssetTransactions(ADMIN_ACCOUNT_ID, EXISTING_ASSET))
        .then(() => done())
        .catch(err => done(err))
    })

    it('should fail to get nonexisting asset\'s transactions', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, NODE_IP)
        .then(() => irohaUtil.getAccountAssetTransactions(ADMIN_ACCOUNT_ID, NONEXISTING_ASSET))
        .then(() => done())
        .catch(err => done(err))
    })
  })

  describe('#getAccountTransactions', () => {
    afterEach(logout)

    it('should fail before login', done => {
      irohaUtil.getAccountTransactions(ADMIN_ACCOUNT_ID)
        .then(() => done(new Error('query should fail')))
        .catch(() => done())
    })

    it('should succeed after login', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, NODE_IP)
        .then(() => irohaUtil.getAccountTransactions(ADMIN_ACCOUNT_ID))
        .then(() => done())
        .catch(err => done(err))
    })
  })

  describe('#getAssetInfo', () => {
    afterEach(logout)

    it('should fail before login', done => {
      irohaUtil.getAssetInfo(EXISTING_ASSET)
        .then(() => done(new Error('query should fail')))
        .catch(() => done())
    })

    it('should succeed after login', done => {
      irohaUtil.login(ADMIN_ACCOUNT_ID, ADMIN_PRIVATE_KEY, NODE_IP)
        .then(() => irohaUtil.getAssetInfo(EXISTING_ASSET))
        .then(() => done())
        .catch(err => done(err))
    })
  })
})
