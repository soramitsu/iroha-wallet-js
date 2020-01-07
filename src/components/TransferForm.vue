<template>
<div class="wrapper">
  <el-form
    class="transfer-form"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="6rem"
    label-position="top"
  >
    <el-form-item label="To:" prop="to">
      <el-input name="to" v-model="form.to" :disabled="loading" />
    </el-form-item>

    <el-form-item label="Amount:" prop="amount">
      <el-input name="amount" v-model="form.amount" :disabled="loading" />
    </el-form-item>

    <el-form-item label="Message:" prop="message">
      <el-input name="message" v-model="form.message" type="textarea" :disabled="loading" />
    </el-form-item>

      <el-form-item label="Private key:" prop="privateKey">
        <el-row type="flex" justify="space-between">
          <el-col :span="20">
            <el-input
              name="privateKey"
              v-model="form.privateKey"
              :disabled="isLoading"
            />
          </el-col>
          <el-upload
            class="auth-form_upload"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onFileChosen"
            :disabled="isLoading"
          >
            <el-button>
              <fa-icon icon="upload" />
            </el-button>
          </el-upload>
        </el-row>
      </el-form-item>

    <el-form-item class="send-button-container">
      <el-button
        class="send-button fullwidth"
        type="danger"
        @click="onSubmit"
        :loading="loading"
      >
        SEND
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'transfer-form',

  model: {
    prop: 'form',
    event: 'change'
  },
    data () {
    return {
      isLoading: false
    }
  },

  props: {
    form: Object,
    maxDecimalDigits: {
      validator: v => Number.isInteger(v) && v >= 0
    },
    loading: Boolean
  },

  computed: {
    rules () {
      // `maxDecimalDigits` specifies the maximum number of digits after decimal point.
      // e.g. if maxDecimalDigits == 5 then '100.12345' is ok
      const amountRegexp = (this.maxDecimalDigits !== 0)
        ? RegExp(`^([1-9][0-9]*|0)(\\.[0-9]{1,${this.maxDecimalDigits}})?$`)
        : RegExp(`^[1-9][0-9]*$`)
      const amountMessage = (this.maxDecimalDigits !== 0)
        ? `"AMOUNT" should be a number of max ${this.maxDecimalDigits} decimal digits.`
        : `"AMOUNT" should be an integer.`

      return {
        to: [
          { required: true, message: 'Please input "TO"', trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, message: '"TO" should match [a-Z_0-9]{1,32}@[a-Z_0-9]{1,9}', trigger: 'change' }
        ],
        amount: [
          { required: true, message: 'Please input "AMOUNT"', trigger: 'change' },
          { pattern: amountRegexp, message: amountMessage, trigger: 'change' }
        ],
        privateKey: [
          { required: true, message: 'Please input "PRIVATE KEY"', trigger: 'change' },
          { pattern: /^[A-Fa-f0-9]{64}$/, message: '"PRIVATE KEY" should match [A-Fa-f0-9]{64}', trigger: 'change' }
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
    },

    onFileChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        this.form.privateKey = (ev.target.result || '').trim()
      }
      reader.readAsText(file.raw)
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
}
.transfer-form {
  width: 25rem;
}
</style>
