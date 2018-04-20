<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'iroha-wallet-js'
  }
</script>

<style>
  html,
  body {
    background: #c4c4c4;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

  .app {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>
