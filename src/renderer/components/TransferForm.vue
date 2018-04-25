<template>
  <el-form class="transfer-form" :model="form" label-width="6rem">
    <el-form-item label="TO:">
      <el-input v-model="form.to"></el-input>
    </el-form-item>

    <el-form-item label="AMOUNT:">
      <el-input v-model="form.amount" type="number"></el-input>
    </el-form-item>

    <el-form-item label="MESSAGE:">
      <el-input v-model="form.message" type="textarea"></el-input>
    </el-form-item>

    <el-form-item class="send-button-container">
      <el-button
        class="send-button"
        type="primary"
        @click="onSubmit"
      >
        SEND
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'transfer-form',

    props: {
    },

    data () {
      return {
        form: {
          to: null,
          amount: null,
          message: null
        }
      }
    },

    updated () {
      console.log('updated')
    },

    watch: {
    },

    methods: {
      onSubmit () {
        alert('send!')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";

  .transfer-form {
    margin: 2rem 4rem 0 0;

    /deep/ .el-form-item__label {
      font-weight: bold;
    }
  }

  .send-button-container {
    text-align: right;
    margin: 30px 0 10px;

    .send-button {
      height: 3rem;
      width: 8rem;
    }
  }
</style>
