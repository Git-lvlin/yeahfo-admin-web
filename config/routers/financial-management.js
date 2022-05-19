const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  name: 'financial-management',
  path: '/financial-management',
  routes: [
    {
      name: 'money-management',
      path: '/financial-management/money-management',
      routes: [
        {
          name: 'yeahgo-virtual-account-management',
          path: '/financial-management/money-management/yeahgo-virtual-account-management',
          component: './financial-management/money-management/yeahgo-virtual-account-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'transaction-details',
          path: '/financial-management/money-management/yeahgo-virtual-account-management/transaction-details',
          component: './financial-management/money-management/yeahgo-virtual-account-management/transaction-details',
          // wrappers: [RouteWatcher],
          hidenMenu: true
        },
        {
          name: 'supplier-fund-management',
          path: '/financial-management/money-management/supplier-fund-management',
          component: './financial-management/money-management/supplier-fund-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'member-store-fund-management',
          path: '/financial-management/money-management/member-store-fund-management',
          component: './financial-management/money-management/member-store-fund-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'issuing-store-fund-management',
          path: '/financial-management/money-management/issuing-store-fund-management',
          component: './financial-management/money-management/issuing-store-fund-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'operator-fund-management',
          path: '/financial-management/money-management/operator-fund-management',
          component: './financial-management/money-management/operator-fund-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'payment-details',
          path: '/financial-management/money-management/payment-details',
          component: './financial-management/money-management/payment-details',
          wrappers: [RouteWatcher],
          hidenMenu: true
        },
        {
          name: 'details',
          path: '/financial-management/money-management/details',
          component: './financial-management/money-management/details',
          wrappers: [RouteWatcher],
          hidenMenu: true
        }
      ]
    },
    {
      name: 'transaction-detail-management',
      path: '/financial-management/transaction-detail-management',
      routes: [
        {
          name: 'withdrawal-audit-management',
          path: '/financial-management/transaction-detail-management/withdrawal-audit-management',
          component: './financial-management/transaction-detail-management/withdrawal-audit-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'show-detail',
          path: '/financial-management/transaction-detail-management/withdrawal-audit-management/detail/:id',
          component: './financial-management/transaction-detail-management/withdrawal-audit-management/detail',
          hidenMenu: true
        },
        {
          name: 'withdrawal-balance-details',
          path: '/financial-management/transaction-detail-management/withdrawal-audit-management/details',
          component: './financial-management/transaction-detail-management/withdrawal-audit-management/withdrawal-balance-details',
          wrappers: [RouteWatcher],
          hidenMenu: true
        },
        {
          name: 'order-pay-detail-management',
          path: '/financial-management/transaction-detail-management/order-pay-detail-management',
          component: './financial-management/transaction-detail-management/order-pay-detail-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'bonus-detail-management',
          path: '/financial-management/transaction-detail-management/bonus-detail-management',
          component: './financial-management/transaction-detail-management/bonus-detail-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'commission-detail-management',
          path: '/financial-management/transaction-detail-management/commission-detail-management',
          component: './financial-management/transaction-detail-management/commission-detail-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'loan-detail-management',
          path: '/financial-management/transaction-detail-management/loan-detail-management',
          component: './financial-management/transaction-detail-management/loan-detail-management',
          wrappers: [RouteWatcher],
        },
        {
          name: 'royalty-details',
          path: '/financial-management/transaction-detail-management/royalty-details/:id',
          component: './financial-management/transaction-detail-management/royalty-details',
        },
        {
          name: 'after-sales-order-details',
          path: '/financial-management/transaction-detail-management/after-sales-order-details',
          component: './financial-management/transaction-detail-management/after-sales-order-details',
          wrappers: [RouteWatcher],
        },
        {
          name: 'after-order-details',
          path: '/financial-management/transaction-detail-management/after-sales-order-details/detail/:id',
          component: './financial-management/transaction-detail-management/after-sales-order-details/detail',
        },
        {
          name: 'operator-revenue-management',
          path: '/financial-management/transaction-detail-management/operator-revenue-management',
          component: './financial-management/transaction-detail-management/operator-revenue-management',
          wrappers: [RouteWatcher],
        }
      ]
    },
    {
      name: 'transaction-allocation-management',
      path: '/financial-management/transaction-allocation-management',
      routes: [
        {
          name: 'withdrawal-fee-config',
          path: '/financial-management/transaction-allocation-management/withdrawal-fee-config',
          component: './financial-management/transaction-allocation-management/withdrawal-fee-configuration',
          wrappers: [RouteWatcher],
        }
      ]
    },
    {
      name: 'subsidy-summary',
      path: '/financial-management/subsidy-summary',
      component: './financial-management/subsidy-summary',
      wrappers: [RouteWatcher],
    },
    {
      name: 'subsidy-summary-detail',
      path: '/financial-management/subsidy-summary/detail/:id',
      component: './financial-management/subsidy-summary/detail'
    }
  ]
}
