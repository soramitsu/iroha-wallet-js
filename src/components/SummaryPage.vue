<template>
  <div class="summary-page">
    <el-row class="summary-page__row" type="flex">
      <el-col :span="10">
        <div v-if="accountId" class="user-card__account-id"><b>Account:</b> {{ accountId }}</div>
        <div v-else class="user-card__account-id"><b>Please auth!</b></div>
        <div v-for="(value, key) in accountInfo" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </div>
      </el-col>

      <el-col :span="10">
        <div v-for="wallet in wallets" :key="wallet.name">
          <b>{{ wallet.name }}</b> {{ wallet.amount }}
        </div>
        <div v-if="wallets.length === 0"><b>No assets</b></div>
      </el-col>
    </el-row>

    <el-row class="summary-page__row">
      <el-card class="transactions-history">
        <b>Transactions history</b>
        <transactions currency :transactions="transactions" :loading="!isReady" />
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Transactions from '@/components/Transactions'

export default {
  name: 'summary-page',

  components: {
    Transactions
  },

  data () {
    return {
      isReady: false
    }
  },

  computed: {
    ...mapState({
      accountId: state => state.Account.accountId,
      accountInfo: state => state.Account.accountInfo
    }),

    ...mapGetters({
      transactions: 'transfers',
      wallets: 'wallets'
    })
  },

  methods: {
    ...mapActions([
      'getAllAccountAssetsTransactions'
    ])
  },

  created () {
    this.getAllAccountAssetsTransactions()
      .finally(() => { this.isReady = true })
  }
}
</script>

<style scoped>
.summary-page__row {
  padding: 2rem;
}
</style>
