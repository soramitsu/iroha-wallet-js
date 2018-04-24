<template>
  <div class="wallet">
    {{ wallet.name }} {{ wallet.amount }}

    <el-tabs class="wallet__tabs" v-model="activeTabName">
      <el-tab-pane label="HISTORY" name="history">
        <transactions :walletId="wallet.id"></transactions>
      </el-tab-pane>

      <el-tab-pane label="SEND" name="send">
        send
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Transactions from '@/components/Transactions'

  export default {
    name: 'wallets-page',

    components: {
      Transactions
    },

    data () {
      return {
        activeTabName: 'history',
        wallet: {}
      }
    },

    watch: {
      '$route' (to, from) {
        // Back to HISTORY tab on switching to a different wallet
        this.activeTabName = 'history'

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

    &__tabs {
      margin: 1rem 0;

      /deep/ .el-tabs__header {
        text-align: center;
      }

      /deep/ .el-tabs__nav {
        float: none;
        display: inline-block;
      }
    }
  }
</style>
