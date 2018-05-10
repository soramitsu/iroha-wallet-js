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
        <el-card class="wallet-card">
          <div v-for="wallet in wallets" :key="wallet.name">
            {{ wallet.name }} {{ wallet.amount }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="summary-page__row">
      <el-card>
        <transactions :transactions="accountTransactions" currency />
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Transactions from '@/components/Transactions'

  export default {
    name: 'summary-page',

    components: {
      Transactions
    },

    data () {
      return {
        wallets: [
          { name: 'dollar#russia', amount: '100.00' },
          { name: 'yen#russia', amount: '100.00' },
          { name: 'euro#russia', amount: '100.00' }
        ]
      }
    },

    computed: {
      accountTransactions () {
        // TODO: pick only transfer transactions
        return this.$store.state.Login.accountTransactions.map(t => {
          return t
        })
      },

      ...mapState({
        accountId: state => state.Login.accountId,
        accountInfo: state => state.Login.accountInfo
      })
    },

    created () {
      this.$store.dispatch('getAccountTransactions')
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
