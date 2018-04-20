<template>
  <div class="summary-page">
    <el-row class="summary-page__row" type="flex" :gutter="15">
      <el-col :span="12">
        <el-card class="user-card">
          <div class="user-card__account-id">accountname@domain</div>

          <div v-for="(value, key) in user.info" :key="key">
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
        <el-table
          class="transaction-table"
          :data="transactions"
        >
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="from" label="from"></el-table-column>
          <el-table-column prop="to" label="to"></el-table-column>
          <el-table-column prop="amount" label="amount"></el-table-column>
          <el-table-column prop="currency" label="currency"></el-table-column>
          <el-table-column prop="date" label="date"></el-table-column>
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'summary-page',

    data () {
      return {
        user: {
          accountId: 'accountname@domain',
          info: {
            'Gender': 'Male',
            'Some other info': 'Kek',
            'Maybe other info': '12345'
          }
        },

        wallets: [
          { name: 'dollar#russia', amount: '100.00' },
          { name: 'yen#russia', amount: '100.00' },
          { name: 'euro#russia', amount: '100.00' }
        ],

        transactions: [
          { id: '1', from: 'roma@russia', to: 'you', amount: '100.00', currency: 'dollar#russia', date: '11.04.2017' },
          { id: '1', from: 'roma@russia', to: 'you', amount: '100.00', currency: 'dollar#russia', date: '11.04.2017' },
          { id: '1', from: 'roma@russia', to: 'you', amount: '100.00', currency: 'dollar#russia', date: '11.04.2017' },
          { id: '1', from: 'roma@russia', to: 'you', amount: '100.00', currency: 'dollar#russia', date: '11.04.2017' }
        ]
      }
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
