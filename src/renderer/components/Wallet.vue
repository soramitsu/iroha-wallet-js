<template>
  <div>
    wallet
  </div>
</template>

<script>
  export default {
    name: 'wallets-page',

    data () {
      return {
      }
    },

    watch: {
      '$route' (to, from) {
        console.log(to, from)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
