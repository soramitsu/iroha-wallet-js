<template>
  <el-container>
    <el-aside width="270px" id="side-menu">
      <div class="title-info">
        <div>
          <p class="title">IROHA WALLET</p>
        </div>
      </div>
      <div class="menu-list">
        <el-menu
          :router="true"
          :default-active="currentActiveMenu"
        >
          <el-menu-item index="/dashboard/summary-page">
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/dashboard/wallets-page">
            <span slot="title">Wallets</span>
          </el-menu-item>
          <el-menu-item index="/logout" @click="onLogout">
            <span slot="title">Logout</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    <el-main id="main">
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
#side-menu {
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  border-right: 1px solid #eaeaea
}

#main {
  padding: 0;
  margin-left: 270px;
}

.title-info {
  display: flex;
  justify-content: center;
  font-weight: 600;
  padding: 1rem 0;
  border-bottom: 1px solid #e8e8e8;
}

.menu-list {
  flex: 1;
}

.menu-list >>> .el-menu {
  border-right: 0px
}

.menu-list >>> .el-menu-item.is-active{
  background: #e43e33;
  color: rgb(255, 255, 255, 1);
  font-weight: 500;
}

.menu-item {
  color: #00111f;
  display: block;
  padding: 1rem .5rem 1rem 1.5rem;
}

.menu-item_text svg {
  margin-right: 0.5rem;
  width: 1rem;
}
.router-link-active > .menu-item_text {
  color: rgb(255, 255, 255, 1)
}

.menu-item.router-link-active {
  background: #e43e33;
  color: white;
  font-weight: 500;
  pointer-events: none;
}

a.menu-item:hover span {
  opacity: 1;
  color: #000000;
}
</style>
