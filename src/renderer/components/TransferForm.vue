<template>
  <el-form
    class="transfer-form"
    :model="form"
    label-width="6rem"
  >
    <el-form-item label="TO:">
      <el-input v-model="form.to" />
    </el-form-item>

    <el-form-item label="AMOUNT:">
      <el-input v-model="form.amount" type="number" />
    </el-form-item>

    <el-form-item label="MESSAGE:">
      <el-input v-model="form.message" type="textarea" />
    </el-form-item>

    <el-form-item class="send-button-container">
      <el-button
        class="send-button"
        type="primary"
        @click="$emit('submit')"
      >
        SEND
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'transfer-form',

    model: {
      prop: 'form',
      event: 'change'
    },

    props: ['form'],

    watch: {
      form (to) {
        this.$emit('change', to)
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
