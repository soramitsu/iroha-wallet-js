<template>
  <div class="wallet">
    {{ walletId }}
  </div>
</template>

<script>
  export default {
    name: 'wallets-page',

    data () {
      return {
        walletId: this.$route.params.walletId
      }
    },

    watch: {
      '$route' (to, from) {
        this.walletId = to.params.walletId
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/element-variables.scss";

  .wallet {
    padding: 1rem 2rem;
  }
</style>
