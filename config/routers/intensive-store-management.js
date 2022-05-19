const RouteWatcher = '@/components/PageTab/RouteWatcher';


export default {
  path: '/intensive-store-management',
  name: 'intensive-store-management',
  routes: [
    {
      name: 'store-list',
      path: '/intensive-store-management/store-list',
      component: './intensive-store-management/store-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'store-detail',
      path: '/intensive-store-management/store-detail/:id',
      component: './intensive-store-management/store-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-task',
      path: '/intensive-store-management/intensive-task/:id',
      component: './intensive-store-management/intensive-task',
      hideInMenu: true,
    },
    {
      name: 'shopkeeper-order',
      path: '/intensive-store-management/shopkeeper-order/:id',
      component: './intensive-store-management/shopkeeper-order',
      hideInMenu: true,
    },
    {
      name: 'product-management',
      path: '/intensive-store-management/product-management/:id',
      component: './intensive-store-management/product-management',
      hideInMenu: true,
    },
    {
      name: 'shop-user',
      path: '/intensive-store-management/shop-user/:id',
      component: './intensive-store-management/shop-user',
      hideInMenu: true,
    },
    {
      name: 'shopkeeper-user',
      path: '/intensive-store-management/shopkeeper-user/:id',
      component: './intensive-store-management/shopkeeper-user',
      hideInMenu: true,
    },
    {
      name: 'store-review',
      path: '/intensive-store-management/store-review',
      component: './intensive-store-management/store-review',
      wrappers: [RouteWatcher],
    },
    {
      name: 'store-review-detail',
      path: '/intensive-store-management/store-review-detail/:id',
      component: './intensive-store-management/store-review-detail',
      hideInMenu: true,
    },
    // {
    //   name: 'grade-index',
    //   path: '/intensive-store-management/grade-index',
    //   component: './intensive-store-management/grade-index',
    // },
    // {
    //   name: 'assessment-reward',
    //   path: '/intensive-store-management/assessment-reward',
    //   component: './intensive-store-management/assessment-reward',
    // },
    {
      name: 'lvl-setup',
      path: '/intensive-store-management/lvl-setup',
      component: './intensive-store-management/lvl-setup',
      wrappers: [RouteWatcher],
    },
    {
      name: 'lvl-commission',
      path: '/intensive-store-management/lvl-commission',
      component: './intensive-store-management/lvl-commission',
      wrappers: [RouteWatcher],
    },
    {
      name: 'lvl-rule',
      path: '/intensive-store-management/lvl-rule',
      component: './intensive-store-management/lvl-rule',
      wrappers: [RouteWatcher],
    },
    {
      name: 'shop-area',
      path: '/intensive-store-management/shop-area',
      component: './intensive-store-management/shop-area',
      wrappers: [RouteWatcher],
    },
    {
      name: 'community-store-setting',
      path: '/intensive-store-management/community-store-setting',
      component: './intensive-store-management/community-store-setting',
      wrappers: [RouteWatcher],
    },
    {
      name: 'data-excel',
      path: '/intensive-store-management/data-excel',
      component: './intensive-store-management/data-excel',
      wrappers: [RouteWatcher],
    },
    {
      name: 'cancel-reason',
      path: '/intensive-store-management/cancel-reason',
      component: './intensive-store-management/cancel-reason',
      wrappers: [RouteWatcher],
    },
    {
      name: 'cancel-aduit',
      path: '/intensive-store-management/cancel-aduit',
      component: './intensive-store-management/cancel-aduit',
      wrappers: [RouteWatcher],
    },
    {
      name: 'fresh-store-review',
      path: '/intensive-store-management/fresh-store-review',
      component: './intensive-store-management/fresh-store-review',
      wrappers: [RouteWatcher],
    },
    {
      name: 'fresh-shop-configuration',
      path: '/intensive-store-management/fresh-shop-configuration',
      component: './intensive-store-management/fresh-shop-configuration',
      wrappers: [RouteWatcher],
    },
    {
      name: 'share-the-subsidy',
      path: '/intensive-store-management/share-the-subsidy',
      component: './intensive-store-management/share-the-subsidy',
      wrappers: [RouteWatcher],
    },
  ]
}
