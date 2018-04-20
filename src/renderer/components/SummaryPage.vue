<template>
  <div class="summary-page">
    <el-row class="summary-page__row" type="flex" :gutter="15">
      <el-col :span="12">
        <el-card class="user-card">
          <div class="user-card__account-id">accountname@domain</div>
          <div>Gender: Male</div>
          <div>Some other info: Kek</div>
          <div>Maybe other info: 12345</div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="wallet-card">
          <div>dollar#russia: 100.00</div>
          <div>yen#russia: 100.00</div>
          <div>euro#russia: 100.00</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="summary-page__row">
      <el-card>
        <el-table :data="transactions">
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
</style>
