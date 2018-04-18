<template>
  <el-card class="login-form-container">
    <img id="logo" class="logo" src="~@/assets/logo.svg" alt="Iroha">

    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="username:" prop="username">
        <el-input name="username" v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="private key:" prop="privateKey">
        <el-row type="flex" justify="space-between">
          <el-col :span="17">
            <el-input name="privateKey" v-model="form.privateKey"></el-input>
          </el-col>

          <el-col :span="6">
            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onFileChosen"
            >
              <el-button type="primary">choose</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="node ip:" prop="nodeIp">
        <el-input v-model="form.nodeIp"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">Login</el-button>
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
            { required: true, message: 'Please input node ip', trigger: 'change' }
          ]
        }
      }
    },

    methods: {
      onFileChosen (file, fileList) {
        const reader = new FileReader()

        reader.onload = (ev) => {
          this.form.privateKey = (ev.target.result || '').trim()
          this.$refs['form'].validate((valid) => console.log(valid))
        }
        reader.readAsText(file.raw)
      }
    }
  }
</script>

<style scoped>
  .login-form-container {
    position: relative;
    max-width: 30rem;
    margin: 10rem auto;
    overflow: visible;
    padding-top: 3rem;
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
</style>
