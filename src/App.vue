<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'iroha-wallet-js',

  computed: mapState({
    connectionError: state => state.Account.connectionError
  }),

  watch: {
    connectionError (to) {
      if (to) this.showConnectionErrorMessage(to)
    }
  },

  methods: {
    showConnectionErrorMessage: _.debounce(function () {
      this.$message.error(`connection error: Please check IP address OR your internet connection`)
    }, 1000)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500,700');

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

.el-icon {
  font-family: element-icons !important;
}

[class^="el-"]:not(i):not([class*='el-icon']),
[class*="el-"]:not(i):not([class*='el-icon']) {
  font-family: 'IBM Plex Sans', sans-serif !important;
}

#app {
  font-family: 'IBM Plex Sans', sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

a {
  color: black;
  transition: opacity .15s ease-in-out;
  cursor: pointer;
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
}

.fullwidth {
  width: 100%;
}

.el-tabs__item:hover,
.el-tabs__item.is-active {
  color: #e43e33;
}
.el-tabs__active-bar {
  background-color: #e43e33;
}
.el-button--danger {
  background-color: #e43e33;
  border-color: #e43e33;
}
.el-tabs__item {
  padding: 13px 20px;
  height: 66px;
}
</style>
