<template>
  <div class="wallets-page">
    <div class="sidemenu">
      <router-link
        v-for="wallet in wallets"
        :key="wallet.name"
        class="sidemenu__item"
        :to="'/dashboard/wallets-page/' + wallet.name"
      >
        <div>{{ wallet.name }}</div>
        <div>{{ wallet.amount }}</div>
      </router-link>
    </div>

    <div class="main">
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
  .wallets-page {
    display: flex;
  }

  .sidemenu {
    $sidemenu-width: 150px;

    &__item {
      display: block;
      width: $sidemenu-width;
      padding: 1rem;
      text-decoration: none;
      color: #7e7e7e;
      background: #9d9d9d;
      border: 1px solid #aaa;
    }

    .router-link-active {
      background: white;
      color: inherit;
    }
  }

  .main {
    flex: 1;
    height: 100vh;
  }
</style>
