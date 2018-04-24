<template>
  <div class="wallets-page">
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
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'wallets-page',

    data () {
      return {
        wallets: [
          { id: 'wallet-1', name: 'dollar#russia', amount: '100.00' },
          { id: 'wallet-2', name: 'yen#russia', amount: '100.00' },
          { id: 'wallet-3', name: 'euro#russia', amount: '100.00' }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";

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
      transition: .1s ease background;

      &:hover {
        background: darken(#9d9d9d, 5%);
      }
    }

    .router-link-active {
      background: white;
      color: inherit;
    }
  }

  .main {
    flex: 1;
    height: 100vh;
    background: white;
    overflow: auto;
  }
</style>
