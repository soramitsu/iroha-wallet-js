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
        <el-menu-item index="/logout" @click="onLogout">
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
import { mapActions } from 'vuex'

export default {
  name: 'dashboard',

  data () {
    return {
      isCollapsed: true
    }
  },

  created () {
    this.getAccountQuorum()
  },

  computed: {
    currentActiveMenu: function () {
      if (this.$route.path.includes('summary')) return '/dashboard/summary-page'
      if (this.$route.path.includes('wallets')) return '/dashboard/wallets-page'
      return this.$route.path
    }
  },

  methods: {
    ...mapActions([
      'logout',
      'getAccountQuorum'
    ]),
    onLogout () {
      this.logout()
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>

<style scoped>
</style>
