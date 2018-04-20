<template>
  <div class="wallets-page">
    <div class="sidemenu">
      <router-link
        v-for="wallet in wallets"
        :key="wallet.name"
        class="sidemenu__item"
        :to="'/dashboard/wallets-page/' + wallet.name"
      >
        {{ wallet.name }}
        {{ wallet.amount }}
      </router-link>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'wallets-page',

    data () {
      return {
        // TODO: If each wallet has walletId, it can be used as a routing
        // parameter. (i.e. /wallets-page/:walletId)
        wallets: [
          { name: 'dollar#russia', amount: '100.00' },
          { name: 'yen#russia', amount: '100.00' },
          { name: 'euro#russia', amount: '100.00' }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sidemenu {
    &__item {
      display: block;
    }
  }
</style>
