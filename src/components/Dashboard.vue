<template>
  <el-container class="dashboard-container">
    <aside class="aside">
      <div class="sidemenu">
        <div class="sidemenu__top">
          <router-link class="sidemenu__item" to="/dashboard/summary-page">
            <font-awesome-icon icon="tachometer-alt" class="sidemenu__icon" />
            summary
          </router-link>

          <router-link class="sidemenu__item" to="/dashboard/wallets-page">
            <font-awesome-icon icon="wallet" class="sidemenu__icon" />
            wallets
          </router-link>
        </div>

        <div class="sidemenu__bottom">
          <div class="sidemenu__item" @click="logout">
            <font-awesome-icon icon="sign-out-alt" class="sidemenu__icon" />
            logout
          </div>
        </div>
      </div>
    </aside>

    <main class="main">
      <router-view />
    </main>
  </el-container>
</template>

<script>
export default {
  name: 'dashboard',

  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";

  .dashboard-container {
    height: 100vh;
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
        cursor: pointer;

        &:hover {
          background: darken($--color-primary, 5%);
        }
      }

      .router-link-active {
        color: black;
      }

      &__icon {
        font-size: 50px;
        margin: 5px 0;
      }
    }
  }

  .main {
    flex: 1;
    height: 100vh;
    overflow: auto;
  }
</style>
