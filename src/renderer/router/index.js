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
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard').default,
      children: [
        {
          path: 'summary-page',
          name: 'summary-page',
          component: require('@/components/SummaryPage').default
        },
        {
          path: 'wallets-page',
          name: 'wallets-page',
          component: require('@/components/WalletsPage').default,
          children: [
            {
              path: ':walletId',
              name: 'wallet',
              component: require('@/components/Wallet').default
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
