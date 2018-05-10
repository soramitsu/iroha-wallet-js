import irohaUtil from 'util/iroha-util'

const state = {
  username: ''
}

const getters = {
  username (state) {
    return state.username
  }
}

const mutations = {
  SET_USERNAME (state, username) {
    state.username = username
  }
}

const actions = {
  fetchTransactions ({ commit }) {
    irohaUtil.getAccountTransactions()
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
