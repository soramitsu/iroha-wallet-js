import _ from 'lodash'
import irohaUtil from 'util/iroha-util'

// TODO: get assetIds via API in the future
const DUMMY_ASSET_IDS = [
  'coolcoin#test',
  'hotcoin#test'
]

const types = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  GET_ACCOUNT_TRANSACTIONS_REQUEST: 'GET_ACCOUNT_TRANSACTIONS_REQUEST',
  GET_ACCOUNT_TRANSACTIONS_SUCCESS: 'GET_ACCOUNT_TRANSACTIONS_SUCCESS',
  GET_ACCOUNT_TRANSACTIONS_FAILURE: 'GET_ACCOUNT_TRANSACTIONS_FAILURE',
  GET_ACCOUNT_ASSETS_REQUEST: 'GET_ACCOUNT_ASSETS_REQUEST',
  GET_ACCOUNT_ASSETS_SUCCESS: 'GET_ACCOUNT_ASSETS_SUCCESS',
  GET_ACCOUNT_ASSETS_FAILURE: 'GET_ACCOUNT_ASSETS_FAILURE'
}

const state = {
  accountId: '',
  nodeIp: irohaUtil.getStoredNodeIp(),
  accountInfo: {},
  transactions: [],
  assets: []
}

/*
 * modify an amount object to a string like '123.45'
 */
function amountToString ({ value, precision }) {
  // TODO: use all values from 'first' to 'fourth'
  return String(value.fourth)
    .replace(RegExp(`(\\d{${precision}})$`), '.$1')
    .replace(/^\./, '0.')
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

        transfers.push({
          from: srcAccountId,
          to: destAccountId,
          amount: amountToString(amount),
          currency: assetId,
          date: createdTime
        })
      })
    })

    return transfers
  },

  wallets (state) {
    return state.assets.map(a => {
      return {
        name: a.accountAsset.assetId,
        amount: amountToString(a.accountAsset.balance)
      }
    })
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

  [types.GET_ACCOUNT_TRANSACTIONS_FAILURE] (state, err) {},

  [types.GET_ACCOUNT_ASSETS_REQUEST] (state) {},

  [types.GET_ACCOUNT_ASSETS_SUCCESS] (state, assets) {
    state.assets = assets
  },

  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, err) {}
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

    // TODO: get assetIds via API in the future
    const assetIds = DUMMY_ASSET_IDS
    const gettingAccountAssetsTransactions = assetIds.map(assetId => {
      return irohaUtil.getAccountAssetTransactions(state.accountId, assetId)
    })

    return Promise.all(gettingAccountAssetsTransactions)
      .then(responses => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_SUCCESS, _.flatten(responses))
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAccountAssets ({ commit }) {
    commit(types.GET_ACCOUNT_ASSETS_REQUEST)

    // TODO: get assetIds via API in the future
    const assetIds = DUMMY_ASSET_IDS
    const gettingAccountAssets = assetIds.map(assetId => {
      return irohaUtil.getAccountAssets(state.accountId, assetId)
    })

    return Promise.all(gettingAccountAssets)
      .then(responses => {
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, _.flatten(responses))
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
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
