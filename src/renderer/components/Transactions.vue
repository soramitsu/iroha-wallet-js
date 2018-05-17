<template>
  <div>
    <el-table
      class="transaction-table"
      :data="transactions"
      v-loading="loading"
    >
      <el-table-column prop="from" label="from" />
      <el-table-column prop="to" label="to" />
      <el-table-column prop="amount" label="amount" />
      <el-table-column v-if="currency" prop="currency" label="currency" />
      <el-table-column prop="date" label="date">
        <template slot-scope="scope">
          <span>{{ scope.row.date | formatDate }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'transactions',

    props: {
      transactions: Array,
      currency: {
        type: Boolean,
        default: false
      },
      loading: Boolean
    },

    filters: {
      formatDate (value) {
        return moment(value).format('DD.MM.YYYY')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";
</style>
