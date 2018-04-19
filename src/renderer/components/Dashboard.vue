<template>
  <el-container class="dashboard-container">
    <el-aside class="aside">
      <el-menu
        default-active="1"
      >
        <el-menu-item index="1">summary</el-menu-item>
        <el-menu-item index="2">wallets</el-menu-item>
        <el-menu-item index="3">logout</el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'dashboard'
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";

  .dashboard-container {
    min-height: 100vh;
  }

  .aside {
    width: 3rem;
    background-color: $--color-primary;
  }
</style>
