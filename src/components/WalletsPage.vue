<template>
  <div class="wallets-page" v-loading="!isReady">
    <el-col :span="6">
      <div class="sidemenu">
        <router-link
          v-for="wallet in wallets"
          :key="wallet.id"
          class="card"
          :to="'/dashboard/wallets-page/' + wallet.id"
        >
          <div class="info-container" v-if="wallet.name">
            <div class="label">{{ wallet.name }}</div>
            <div class="asset">{{ wallet.amount }}</div>
          </div>
        </router-link>
      </div>
    </el-col>
    <el-col :span="18">
      <div class="main">
        <router-view />
        <el-card v-if="wallets.length === 0" class="no-assets">
          No assets

          <div>
            Please generate assets with setup script!
          </div>
        </el-card>
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'wallets-page',

  data () {
    return {
      isReady: false
    }
  },

  computed: {
    ...mapGetters({
      wallets: 'wallets'
    })
  },

  watch: {
    '$route' (to) {
      // If moved from 'wallet' to 'wallets-page' (i.e. no wallet opens),
      // open the default one.
      if (to.name === 'wallets-page') {
        this.openDefaultWallet()
      }
    }
  },

  mounted () {
    // If moved from other pages to 'wallets-page', open the default one.
    this.openDefaultWallet()
  },

  created () {
    this.getAllAccountAssetsTransactions()
      .finally(() => { this.isReady = true })
  },

  methods: {
    ...mapActions([
      'getAllAccountAssetsTransactions'
    ]),
    openDefaultWallet () {
      if (this.wallets[0]) {
        this.$router.push({ name: 'wallet', params: { walletId: this.wallets[0].id } })
      }
    }
  }
}
</script>

<style scoped>
.no-assets {
  margin: 5rem 0rem 5rem 12rem;
}
.card {
  display: flex;
  width: 100%;
  font-size: 14px;
  text-decoration: none;
  align-items: center;
  padding: 15px 20px;
}

.card.router-link-active {
  background: #f4f4f4;
  padding-bottom: 13px;
  border-bottom: 2px solid #e43e33
}

.info-container {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.label {
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
}

.card.router-link-active > .info-container > .label {
  font-weight: 600;
}

.card.router-link-active > .info-container > .asset {
  color: #000000;
  font-weight: 600;
}

.asset {
  color: rgba(0, 0, 0, 0.6);
}
</style>
