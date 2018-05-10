import irohaUtil from 'util/iroha-util'

const types = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  GET_ACCOUNT_TRANSACTIONS_REQUEST: 'GET_ACCOUNT_TRANSACTIONS_REQUEST',
  GET_ACCOUNT_TRANSACTIONS_SUCCESS: 'GET_ACCOUNT_TRANSACTIONS_SUCCESS',
  GET_ACCOUNT_TRANSACTIONS_FAILURE: 'GET_ACCOUNT_TRANSACTIONS_FAILURE'
}

const state = {
  accountId: '',
  nodeIp: irohaUtil.getStoredNodeIp(),
  accountInfo: {},
  transactions: []
}

const getters = {
  transfers (state) {
    const transfers = []

    state.transactions.forEach(t => {
      const { commandsList, createdTime } = t.payload

      commandsList.forEach(c => {
        if (!c.transferAsset) return

        const {
          amount,
          assetId,
          destAccountId,
          srcAccountId
        } = c.transferAsset

        // TODO: use values from 'first' to 'fourth'
        // modify '12345' to '123.45'
        const valueWithPrecision = String(amount.value.fourth)
          .replace(RegExp(`(\\d{${amount.precision}})$`), '.$1')

        transfers.push({
          from: srcAccountId,
          to: destAccountId,
          amount: valueWithPrecision,
          currency: assetId,
          date: createdTime
        })
      })
    })

    return transfers
  }
}

const mutations = {
  [types.LOGIN_REQUEST] (state) {},

  [types.LOGIN_SUCCESS] (state, account) {
    state.accountId = account.accountId
    // TODO: state.accountInfo = account.json_data ?
  },

  [types.LOGIN_FAILURE] (state, err) {},

  [types.LOGOUT_REQUEST] (state) {},

  [types.LOGOUT_SUCCESS] (state) {},

  [types.LOGOUT_FAILURE] (state, err) {},

  [types.GET_ACCOUNT_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ACCOUNT_TRANSACTIONS_SUCCESS] (state, transactions) {
    state.transactions = transactions
  },

  [types.GET_ACCOUNT_TRANSACTIONS_FAILURE] (state, err) {}
}

const actions = {
  login ({ commit }, { username, privateKey, nodeIp }) {
    commit(types.LOGIN_REQUEST)

    return irohaUtil.login(username, privateKey, nodeIp)
      .then(account => commit(types.LOGIN_SUCCESS, account))
      .catch(err => {
        commit(types.LOGIN_FAILURE, err)
        throw err
      })
  },

  logout ({ commit }) {
    commit(types.LOGOUT_REQUEST)

    return irohaUtil.logout()
      .then(() => commit(types.LOGOUT_SUCCESS))
      .catch(err => {
        commit(types.LOGOUT_FAILURE, err)
        throw err
      })
  },

  getAccountTransactions ({ commit }) {
    commit(types.GET_ACCOUNT_TRANSACTIONS_REQUEST)

    return irohaUtil.getAccountTransactions(state.accountId)
      .then(res => commit(types.GET_ACCOUNT_TRANSACTIONS_SUCCESS, res))
      .catch(err => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_FAILURE, err)
        throw err
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
