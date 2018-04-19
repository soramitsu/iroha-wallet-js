<template>
  <el-card class="login-form-container">
    <img id="logo" class="logo" src="~@/assets/logo.svg" alt="Iroha">

    <el-form class="login-form" ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="username:" prop="username">
        <el-input name="username" v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="private key:" prop="privateKey">
        <el-row type="flex" justify="space-between">
          <el-col :span="20">
            <el-input name="privateKey" v-model="form.privateKey"></el-input>
          </el-col>

          <el-upload
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onFileChosen"
          >
            <el-button>
              <i class="el-icon-upload2"></i>
            </el-button>
          </el-upload>
        </el-row>
      </el-form-item>

      <el-form-item label="node ip:" prop="nodeIp">
        <el-input v-model="form.nodeIp"></el-input>
      </el-form-item>

      <el-form-item class="login-button-container">
        <el-button
          class="login-button"
          type="primary"
          @click="onSubmit"
        >
          Login
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  export default {
    name: 'login',

    data () {
      return {
        form: {
          username: '',
          privateKey: '',
          nodeIp: ''
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
      onFileChosen (file, fileList) {
        const reader = new FileReader()

        reader.onload = (ev) => {
          this.form.privateKey = (ev.target.result || '').trim()
          this.$refs['form'].validate()
        }
        reader.readAsText(file.raw)
      },

      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$router.push('/dashboard/summary-page')
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-form-container {
    position: relative;
    width: 30rem;
    overflow: visible;
    padding-top: 4rem;
    margin-top: 5rem;
  }

  /*
    ElementUI renders .el-form-item__label without a data attribute,
    so scoped styles doesn't work for it. The `>>>` combinator solves this problem.
    https://vue-loader.vuejs.org/en/features/scoped-css.html
  */
  .login-form >>> .el-form-item__label {
    line-height: 1;
  }

  .logo {
    width: 10rem;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 100;
    top: -5rem;
  }

  .login-button-container {
    text-align: center;
    margin: 30px 0 10px;
  }

  .login-button {
    height: 3rem;
    width: 8rem;
  }
</style>
