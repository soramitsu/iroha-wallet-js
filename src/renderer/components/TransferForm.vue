<template>
  <el-form
    class="transfer-form"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="6rem"
  >
    <el-form-item label="TO:" prop="to">
      <el-input name="to" v-model="form.to" />
    </el-form-item>

    <el-form-item label="AMOUNT:" prop="amount">
      <el-input name="amount" v-model="form.amount" />
    </el-form-item>

    <el-form-item label="MESSAGE:" prop="message">
      <el-input name="message" v-model="form.message" type="textarea" />
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

    model: {
      prop: 'form',
      event: 'change'
    },

    props: {
      form: Object,
      maxDecimalDigits: {
        validator: v => Number.isInteger(v) && v >= 1
      }
    },

    data () {
      // `maxDecimalDigits` specifies the maximum number of digits after decimal point.
      // e.g. if maxDecimalDigits == 5 then '100.12345' is ok
      const amountRegexp = RegExp(`^[1-9][0-9]{0,32}(\\.[0-9]{1,${this.maxDecimalDigits}})?$`)
      const amountMessage = `"AMOUNT" should be a number of max ${this.maxDecimalDigits} decimal digits.`

      return {
        rules: {
          to: [
            { required: true, message: 'Please input "TO"', trigger: 'change' },
            { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, message: '"TO" should match [a-Z_0-9]{1,32}@[a-Z_0-9]{1,9}', trigger: 'change' }
          ],
          amount: [
            { required: true, message: 'Please input "AMOUNT"', trigger: 'change' },
            { pattern: amountRegexp, message: amountMessage, trigger: 'change' }
          ]
        }
      }
    },

    watch: {
      form (to) {
        this.$emit('change', to)
      }
    },

    methods: {
      onSubmit () {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$emit('submit')
          } else {
            return false
          }
        })
      },

      clearValidationMessage () {
        this.$refs['form'].clearValidate()
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
