<template>
  <el-card class="login-form-container">
    <img id="logo" class="logo" src="~@/assets/logo.svg" alt="Iroha">

    <el-form :model="form">
      <el-form-item label="username:">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="private key:">
        <el-upload
          ref="upload"
          action=""
          :auto-upload="false"
          :file-list="form.fileList"
        >
          <el-button type="primary">choose</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="node ip:">
        <el-input v-model="form.username"></el-input>
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
        }
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
