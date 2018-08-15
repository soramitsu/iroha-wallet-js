import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTachometerAlt, faWallet, faSignOutAlt, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import './styles/element-variables.scss'

Vue.use(ElementUI, { locale })

library.add(faTachometerAlt, faWallet, faSignOutAlt, faUpload)

Vue.component('fa-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
