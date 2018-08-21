<template>
  <el-container>
    <div @mouseenter.passive="isCollapsed = false" @mouseleave.passive="isCollapsed = true">
      <el-menu
          :router="true"
          :class="isCollapsed ? 'el-side-menu el-menu--collapse' : 'el-side-menu'"
          :default-active="currentActiveMenu"
      >
        <h1 class="logo">IW</h1>
        <el-menu-item index="/dashboard/summary-page">
          <fa-icon icon="tachometer-alt" class="menu-icon" />
          <span slot="title">Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/wallets-page">
          <fa-icon icon="wallet" class="menu-icon" />
          <span slot="title">Wallets</span>
        </el-menu-item>
        <el-menu-item index="/logout" @click="logout">
          <fa-icon icon="sign-out-alt" class="menu-icon" />
          <span slot="title">Logout</span>
        </el-menu-item>
      </el-menu>
    </div>
    <el-main class="main" style="width: 100%; height: 100vh; padding: 0 0 0 62px;">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'dashboard',

  data () {
    return {
      isCollapsed: true
    }
  },

  computed: {
    currentActiveMenu: function () {
      if (this.$route.path.includes('summary')) return '/dashboard/summary-page'
      if (this.$route.path.includes('wallets')) return '/dashboard/wallets-page'
      return this.$route.path
    }
  },

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

  .el-side-menu {
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-right: none;
    z-index: 100;
    width: 62px;
    background-color: $--color-primary;

    /* Getting rid of element.ui styles */
    position: fixed !important;
    border-right: none !important;

    &:not(.el-menu--collapse) {
      width: 160px;
    }
  }

  .el-side-menu > .el-menu-item {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: white;

    &:hover {
      background: darken($--color-primary, 5%);
    }

    &.is-active{
      background: white !important;
      color: black;
    }
  }

  .logo {
    color: white;
    display: block;
    text-align: center;
    margin: 20px 0;
  }

  .menu-icon {
    margin-left: 2px;
    margin-right: 8px;
    width: 24px;
    text-align: center;
    font-size: 40px;
    vertical-align: middle;
  }
</style>
