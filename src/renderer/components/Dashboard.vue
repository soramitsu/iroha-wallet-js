<template>
  <el-container class="dashboard-container">
    <aside class="aside">
      <div class="sidemenu">
        <div class="sidemenu__top">
          <router-link class="sidemenu__item" to="/dashboard/summary-page">
            <i class="el-icon-menu sidemenu__icon"></i>
            summary
          </router-link>

          <router-link class="sidemenu__item" to="/dashboard/wallets-page">
            <i class="el-icon-menu sidemenu__icon"></i>
            wallets
          </router-link>
        </div>

        <div class="sidemenu__bottom">
          <router-link class="sidemenu__item" to="/login">
            <i class="el-icon-back sidemenu__icon"></i>
            logout
          </router-link>
        </div>
      </div>
    </aside>

    <main class="main">
      <router-view></router-view>
    </main>
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
        box-sizing: border-box;
        padding: 10px;
        text-decoration: none;
        transition: .1s ease background;

        &:hover {
          background: darken($--color-primary, 5%);
        }
      }

      .router-link-active {
        color: black;
      }

      &__icon {
        font-size: 60px;
      }
    }
  }

  .main {
    flex: 1;
  }
</style>
