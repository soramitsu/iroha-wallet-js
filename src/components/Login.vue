<template>
<div class="wrapper">
  <div class="login-form-container">
    <div class="logo">
      <img id="logo" src="~@/assets/logo.svg" alt="Iroha">
    </div>
    <el-form class="login-form" ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="Username:" prop="username">
        <el-input
          name="username"
          v-model="form.username"
          :disabled="isLoading"
        ></el-input>
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

      <el-form-item label="Node IP:" prop="nodeIp">
        <el-input
          v-model="form.nodeIp"
          :disabled="isLoading"
        ></el-input>
      </el-form-item>

      <el-form-item class="login-button-container">
        <el-button
          class="login-button fullwidth"
          type="danger"
          @click="onSubmit"
          :loading="isLoading"
        >
          LOGIN
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'login',

  data () {
    return {
      isLoading: false,
      form: {
        username: '',
        privateKey: '',
        nodeIp: this.$store.state.Account.nodeIp
      },
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, message: 'Username should match [a-Z_0-9]{1,32}@[a-Z_0-9]{1,9}', trigger: 'change' }
        ],
        privateKey: [
          { required: true, message: 'Please input private key', trigger: 'change' },
          { pattern: /^[A-Za-z0-9]{64}$/, message: 'Private key should match [A-Za-z0-9]{64}', trigger: 'change' }
        ],
        nodeIp: [
          { required: true, message: 'Please input node ip', trigger: 'change' },
          // Check an input as IP if it starts with 0-9 (e.g. "255.255.255.255", "255.255.255.255:12345"), or treat the input as a domain name and accept it with no validation.
          { pattern: /(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(:[0-9]{1,5})?$|^[^0-9])/, message: 'Invalid IP', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    ...mapActions([
      'login'
    ]),
    onFileChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        this.form.privateKey = (ev.target.result || '').trim()
        this.form.username = fileList[fileList.length - 1].name.replace('.priv', '')
        this.$refs['form'].validate()
      }
      reader.readAsText(file.raw)
    },

    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false

        this.isLoading = true

        this.login({
          username: this.form.username,
          privateKey: this.form.privateKey,
          nodeIp: this.form.nodeIp
        })
          .then(account => {
            this.$router.push('/dashboard/summary-page')
          })
          .catch(err => {
            console.error(err)
            this.$alert(err.message, 'Login error', {
              type: 'error'
            })
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}
.login-form-container {
  margin: auto;
}
.logo {
  display: flex;
  justify-content: center;
}
.logo img {
  width: 5rem;
  height: 5rem;
}
.login-form {
  width: 25rem;
  justify-content: center;
}
</style>
