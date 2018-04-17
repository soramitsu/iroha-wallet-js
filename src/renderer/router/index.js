import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// TODO: Add route guards https://router.vuejs.org/en/advanced/navigation-guards.html
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
