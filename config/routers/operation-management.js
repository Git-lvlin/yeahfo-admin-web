const RouteWatcher = '@/components/PageTab/RouteWatcher';


export default {
  path: '/operation-management',
  name: 'operation-management',
  routes: [
    {
      name: 'operation-list',
      path: '/operation-management/operation-list',
      component: './operation-management/operation-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'audit-list',
      path: '/operation-management/audit-list',
      component: './operation-management/audit-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'bind-list',
      path: '/operation-management/bind-list',
      component: './operation-management/bind-list',
      wrappers: [RouteWatcher],
    },
    // {
    //   name: 'consultant-product-list',
    //   path: '/operation-management/consultant-product-list/:id',
    //   component: './operation-management/consultant-product-list',
    //   hideInMenu: true,
    // },
    // {
    //   name: 'consultant-operation-list',
    //   path: '/operation-management/consultant-operation-list/:id',
    //   component: './operation-management/consultant-operation-list',
    //   hideInMenu: true,
    // },
    {
      name: 'after-sale-address',
      path: '/operation-management/after-sale-address/:id',
      component: './operation-management/after-sale-address',
      hideInMenu: true,
    },
    {
      name: 'operation-sub-account',
      path: '/operation-management/operation-sub-account/:id',
      component: './operation-management/operation-sub-account',
      hideInMenu: true,
    },
    {
      name: 'operation-detail',
      path: '/operation-management/operation-detail/:id',
      component: './operation-management/operation-detail',
      hideInMenu: true,
    },
    {
      name: 'operation-account-info',
      path: '/operation-management/operation-account-info/:id',
      component: './operation-management/operation-account-info',
      hideInMenu: true,
    },
    {
      name: 'bind-audit-list',
      path: '/operation-management/bind-audit-list',
      component: './operation-management/bind-audit-list',
      wrappers: [RouteWatcher],
    },
  ]
}
