import Vue from 'vue'
import _ from 'lodash'
import irohaUtil from '@util/iroha'
import { getTransferAssetsFrom } from '@util/store-util'

const types = _([
  'SIGNUP',
  'LOGIN',
  'LOGOUT',
  'GET_ACCOUNT_TRANSACTIONS',
  'GET_ACCOUNT_ASSET_TRANSACTIONS',
  'GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS',
  'GET_ACCOUNT_ASSETS',
  'GET_ALL_UNSIGNED_TRANSACTIONS',
  'TRANSFER_ASSET',
  'GET_ACCOUNT_QUORUM'
]).chain()
  .flatMap(x => [x + '_REQUEST', x + '_SUCCESS', x + '_FAILURE'])
  .concat(['RESET'])
  .map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
    accountId: '',
    nodeIp: irohaUtil.getStoredNodeIp(),
    accountInfo: {},
    rawAssetTransactions: {},
    rawUnsignedTransactions: [],
    rawTransactions: [],
    assets: [],
    connectionError: null,
    accountQuorum: 0
  }
}

const state = initialState()

const getters = {
  transfers (state) {
    const txs = Object.values(state.rawAssetTransactions)
      .map(a => a.transactionsList)
    return getTransferAssetsFrom(_.flatten(txs), state.accountId)
  },

  wallets (state) {
    return state.assets.map(a => {
      return {
        id: a.assetId.replace(/#/g, '$'),
        name: a.assetId,
        amount: a.balance,
        precision: a.balance.precision
      }
    })
  },

  getTransactionsByAssetId: (state) => (assetId) => {
    return state.rawAssetTransactions[assetId] ? getTransferAssetsFrom(
      state.rawAssetTransactions[assetId].transactionsList,
      state.accountId
    ) : []
  }
}

/**
 * Store a connection error so the top component can handle it.
 * @param {Object} state
 * @param {Error} err
 */
function handleError (state, err) {
  console.error(err)
  throw err
}

const mutations = {
  [types.RESET] (state) {
    const s = initialState()

    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })
  },

  [types.SIGNUP_REQUEST] (state) {},

  [types.SIGNUP_SUCCESS] (state, params) {
  },

  [types.SIGNUP_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGIN_REQUEST] (state) {},

  [types.LOGIN_SUCCESS] (state, account) {
    state.accountId = account.accountId
  },

  [types.LOGIN_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.LOGOUT_REQUEST] (state) {},

  [types.LOGOUT_SUCCESS] (state) {},

  [types.LOGOUT_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS] (state, { assetId, transactions }) {
    Vue.set(state.rawAssetTransactions, assetId, transactions)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS_SUCCESS] (state) {},

  [types.GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_ASSETS_REQUEST] (state) {},

  [types.GET_ACCOUNT_ASSETS_SUCCESS] (state, assets) {
    state.assets = assets
  },

  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ACCOUNT_TRANSACTIONS_SUCCESS] (state, transactions) {
    state.rawTransactions = transactions
  },

  [types.GET_ACCOUNT_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ALL_UNSIGNED_TRANSACTIONS_REQUEST] (state) {},

  [types.GET_ALL_UNSIGNED_TRANSACTIONS_SUCCESS] (state, transactions) {
    state.rawUnsignedTransactions = transactions
  },

  [types.GET_ALL_UNSIGNED_TRANSACTIONS_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.TRANSFER_ASSET_REQUEST] (state) {},

  [types.TRANSFER_ASSET_SUCCESS] (state) {},

  [types.TRANSFER_ASSET_FAILURE] (state, err) {
    handleError(state, err)
  },

  [types.GET_ACCOUNT_QUORUM_REQUEST] (state) {},

  [types.GET_ACCOUNT_QUORUM_SUCCESS] (state, { quorum }) {
    state.accountQuorum = quorum
  },

  [types.GET_ACCOUNT_QUORUM_FAILURE] (state, err) {
    handleError(state, err)
  }
}

const actions = {
  signup ({ commit }, { username }) {
    commit(types.SIGNUP_REQUEST)

    const { publicKey, privateKey } = irohaUtil.generateKeypair()

    // TODO: POST data to registration API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('signing up...')
        console.log('username:', username)
        console.log('publicKey:', publicKey)

        resolve()
      }, 1000)
    })
      .then(() => commit(types.SIGNUP_SUCCESS, { username, publicKey, privateKey }))
      .then(() => ({ username, privateKey }))
      .catch(err => {
        commit(types.SIGNUP_FAILURE, err)
        throw err
      })
  },

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
      .then(() => {
        commit(types.RESET)
        commit(types.LOGOUT_SUCCESS)
      })
      .catch(err => {
        commit(types.LOGOUT_FAILURE, err)
        throw err
      })
  },

  getAccountAssetTransactions ({ commit, state }, { assetId }) {
    commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_REQUEST)

    return irohaUtil.getAccountAssetTransactions({
      accountId: state.accountId,
      assetId,
      pageSize: 100,
      firstTxHash: undefined
    })
      .then(responses => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS, {
          assetId: assetId,
          transactions: responses
        })
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAllAccountAssetsTransactions ({ dispatch, commit, state }) {
    commit(types.GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS_REQUEST)

    let gettingAccountAssets

    if (_.isEmpty(state.assets)) {
      gettingAccountAssets = dispatch('getAccountAssets')
    } else {
      gettingAccountAssets = Promise.resolve()
    }

    return gettingAccountAssets
      .then(() => {
        const gettingAllAccountAssetsTransactions = state.assets.map(a => {
          return dispatch('getAccountAssetTransactions', { assetId: a.assetId })
        })

        return Promise.all(gettingAllAccountAssetsTransactions)
      })
      .then(() => {
        commit(types.GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS_SUCCESS)
      })
      .catch(err => {
        commit(types.GET_ALL_ACCOUNT_ASSETS_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAccountAssets ({ commit, state }) {
    commit(types.GET_ACCOUNT_ASSETS_REQUEST)

    return irohaUtil.getAccountAssets({
      accountId: state.accountId
    })
      .then(assets => {
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, assets)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
        throw err
      })
  },

  getAccountTransactions ({ commit, state }) {
    commit(types.GET_ACCOUNT_TRANSACTIONS_REQUEST)

    return irohaUtil.getAccountTransactions({
      accountId: state.accountId,
      pageSize: 100,
      firstTxHash: undefined
    })
      .then(transactions => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_SUCCESS, transactions)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  getAllUnsignedTransactions ({ commit, state }) {
    commit(types.GET_ALL_UNSIGNED_TRANSACTIONS_REQUEST)

    return irohaUtil.getRawPendingTransactions()
      .then(responses => {
        commit(types.GET_ALL_UNSIGNED_TRANSACTIONS_SUCCESS, responses)
      })
      .catch(err => {
        commit(types.GET_ALL_UNSIGNED_TRANSACTIONS_FAILURE, err)
        throw err
      })
  },

  transferAsset ({ commit, state }, { privateKeys, assetId, to, description = '', amount }) {
    commit(types.TRANSFER_ASSET_REQUEST)
    return irohaUtil.transferAsset(privateKeys, state.accountQuorum, {
      srcAccountId: state.accountId,
      destAccountId: to,
      assetId,
      description,
      amount
    })
      .then(() => {
        commit(types.TRANSFER_ASSET_SUCCESS)
      })
      .catch(err => {
        commit(types.TRANSFER_ASSET_FAILURE, err)
        throw err
      })
  },

  getAccountQuorum ({ commit, state }) {
    commit(types.GET_ACCOUNT_QUORUM_REQUEST)
    return irohaUtil.getAccount({
      accountId: state.accountId
    })
      .then((account) => commit(types.GET_ACCOUNT_QUORUM_SUCCESS, account))
      .catch(err => {
        commit(types.GET_ACCOUNT_QUORUM_FAILURE, err)
        throw err
      })
  }
}

export default {
  types,
  state,
  getters,
  mutations,
  actions
}
