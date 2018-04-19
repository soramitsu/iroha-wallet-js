<template>
  <el-container class="dashboard-container">
    <div class="aside">
      <div class="sidemenu" default-active="1">
        <div class="sidemenu__top">
          <a class="sidemenu__item" index="1">summary</a>
          <a class="sidemenu__item" index="2">wallets</a>
        </div>

        <div class="sidemenu__bottom">
          <router-link class="sidemenu__item" index="3" to="/login">logout</router-link>
        </div>
      </div>
    </div>

    <div class="main">
      <router-view></router-view>
    </div>
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
    $sidemenu-width: 100px;

    width: $sidemenu-width;
    background-color: $--color-primary;

    .sidemenu {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      &__item {
        display: block;
        width: 100%;
        height: $sidemenu-width;
        color: white;
        text-align: center;
      }
    }
  }

  .main {
    flex: 1;
  }
</style>
