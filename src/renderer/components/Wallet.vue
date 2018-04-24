<template>
  <div class="wallet">
    {{ wallet.id }}
  </div>
</template>

<script>
  export default {
    name: 'wallets-page',

    data () {
      return {
        wallet: {}
      }
    },

    watch: {
      '$route' (to, from) {
        this.fetchWalletByWalletId(this.$route.params.walletId)
      }
    },

    created () {
      this.fetchWalletByWalletId(this.$route.params.walletId)
    },

    methods: {
      /**
       * TODO: This is dummy and wallets master data are hardcoded for now.
       * I guess it will be replaced with API call to fetch a wallet by walletId
       * and will perform dispatching an action to a store or the like.
       */
      fetchWalletByWalletId (walletId) {
        this.wallet = [
          { id: 'wallet-1', name: 'dollar#russia', amount: '100.00' },
          { id: 'wallet-2', name: 'yen#russia', amount: '100.00' },
          { id: 'wallet-3', name: 'euro#russia', amount: '100.00' }
        ].find((w) => (w.id === walletId))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";

  .wallet {
    padding: 1rem 2rem;
  }
</style>
