<template>
  <div class="wallet">
    <el-tabs class="wallet__tabs" v-model="activeTabName">
      <el-tab-pane label="HISTORY" name="history">
        <transactions :transactions="transactions" :loading="!isReady" />
      </el-tab-pane>

      <el-tab-pane label="SEND" name="send">
        <transfer-form
          ref="form"
          v-model="form"
          :maxDecimalDigits="maxDecimalDigits"
          :loading="isSending"
          @submit="onSubmit"
        ></transfer-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Transactions from '@/components/Transactions'
import TransferForm from '@/components/TransferForm'

export default {
  name: 'wallets-page',

  components: {
    Transactions,
    TransferForm
  },

  data () {
    return {
      activeTabName: 'history',
      wallet: {},
      transactions: [],
      form: {},
      maxDecimalDigits: 0,
      isReady: false,
      isSending: false
    }
  },

  watch: {
    /**
       * React to params changes and reuse the same component
       * c.f. https://router.vuejs.org/en/essentials/dynamic-matching.html
       */
    '$route' (to, from) {
      // Reset the instance's data c.f. https://github.com/vuejs/vue/issues/702
      Object.assign(this.$data, this.$options.data())

      this.fetchWalletByWalletId(this.$route.params.walletId)
      this.fetchTransactionsByWalletId(this.$route.params.walletId)
    }
  },

  created () {
    this.fetchWalletByWalletId(this.$route.params.walletId)
    this.fetchTransactionsByWalletId(this.$route.params.walletId)
  },

  methods: {
    fetchWalletByWalletId (walletId) {
      this.wallet = this.$store.getters.wallets.find((w) => (w.id === walletId))

      return this.$store.dispatch('getAccountAssets')
        .then(() => {
          this.maxDecimalDigits = this.wallet.precision
        })
        .then(() => this.$refs['form'].clearValidationMessage())
    },

    fetchTransactionsByWalletId (walletId) {
      const assetId = this.wallet.name

      return this.$store.dispatch('getAccountAssetTransactions', { assetId })
        .then(() => {
          this.transactions = this.$store.getters.getTransactionsByAssetId(assetId)
        })
        .finally(() => { this.isReady = true })
    },

    onSubmit () {
      this.isSending = true
      this.$store.dispatch('transferAsset', {
        privateKeys: [this.form.privateKey],
        assetId: this.wallet.name,
        to: this.form.to,
        amount: this.form.amount,
        description: this.form.message
      })
        .then(() => {
          this.$message({
            message: 'Transfer successful!',
            type: 'success'
          })
          this.activeTabName = 'history'
          this.fetchTransactionsByWalletId(this.wallet.id)
          this.fetchWalletByWalletId(this.wallet.id)
        })
        .catch(err => {
          console.error(err)
          this.$alert(err.message, 'Transfer error', {
            type: 'error'
          })
        })
        .finally(() => { this.isSending = false })
    }
  }
}
</script>

<style scoped>
</style>
