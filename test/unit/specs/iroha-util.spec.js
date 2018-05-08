import irohaUtil from '../../../src/util/iroha-util'

describe('iroha-util', () => {
  it('#login should fail with invalid parameters', done => {
    const username = 'a@a'
    const privateKey = '0d828447cc2e4b3682ed5897b615b36d0d828447cc2e4b3682ed5897b615b36a'
    const nodeIp = 'localhost:50051'

    irohaUtil.login(username, privateKey, nodeIp)
      .then(account => done('login should not succeed'))
      .catch(() => done())
  })
})
