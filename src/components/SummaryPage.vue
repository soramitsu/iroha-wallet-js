<template>
  <div class="summary-page">
    <el-row class="summary-page__row" type="flex" :gutter="15">
      <el-col :span="12">
        <el-card class="user-card">
          <div class="user-card__account-id">{{ accountId }}</div>

          <div v-for="(value, key) in accountInfo" :key="key">
            {{ key }}: {{ value }}
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="wallet-card" v-loading="!isReady">
          <div v-for="wallet in wallets" :key="wallet.name">
            {{ wallet.name }} {{ wallet.amount }}
          </div>

          <div v-if="wallets.length === 0">No assets</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="summary-page__row">
      <el-card>
        <transactions currency :transactions="transactions" :loading="!isReady" />
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
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

    created () {
      this.$store.dispatch('getAllAccountAssetsTransactions')
        .finally(() => { this.isReady = true })
    }
  }
</script>

<style lang="scss" scoped>
  .summary-page {
    margin: 20px 35px;

    &__row {
      margin: 0 0 20px;
    }
  }

  .user-card {
    height: 100%;

    &__account-id {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
  }

  .wallet-card {
    height: 100%;
  }

  .transaction-table {
    &::before {
      content: none; // removes an el-table's border
    }

    /deep/ th {
      color: black;
      background: #c4c4c4;
    }

    /deep/ td {
      border: none;
    }
  }
</style>
