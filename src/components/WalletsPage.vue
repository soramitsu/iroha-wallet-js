<template>
  <div class="wallets-page" v-loading="!isReady">
    <div class="sidemenu">
      <router-link
        v-for="wallet in wallets"
        :key="wallet.id"
        class="sidemenu__item"
        :to="'/dashboard/wallets-page/' + wallet.id"
      >
        <div>{{ wallet.name }}</div>
        <div>{{ wallet.amount }}</div>
      </router-link>
    </div>

    <div class="main">
      <router-view />

      <div v-if="wallets.length === 0">No assets</div>
    </div>
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
</style>
