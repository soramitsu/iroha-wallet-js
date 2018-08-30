<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'iroha-wallet-js',

  computed: mapState({
    connectionError: state => state.Account.connectionError,
    transferError: state => state.Account.transferError
  }),

  watch: {
    connectionError (to) {
      if (to) this.showConnectionErrorMessage(to)
    },
    transferError (to) {
      if (to) this.showTransferErrorMessage(to)
    }
  },

  methods: {
    showConnectionErrorMessage: _.debounce(function () {
      this.$message.error(`connection error: Please check IP address OR your internet connection`)
    }, 1000),

    showTransferErrorMessage: _.debounce(function () {
      const { assetId, to, amount, error } = this.transferError

      this.$message.error({
        message: `Your transaction (asset=${assetId}, to=${to}, amount=${amount}) failed. Please check if the parameters are correct.`,
        duration: 0,
        showClose: true
      })
    }, 1000)
  }
}
</script>

<style>
  html,
  body {
    background: #c4c4c4;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

  .app {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
