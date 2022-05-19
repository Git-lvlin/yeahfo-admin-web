const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/coupon-management',
  name: 'coupon-management',
  routes: [
    {
      name: 'coupon-list',
      path: '/coupon-management/coupon-list',
      component: './coupon-management/coupon-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'coupon-construction',
      path: '/coupon-management/coupon-construction',
      component: './coupon-management/coupon-construction',
      wrappers: [RouteWatcher],
      hideInMenu: true,
    },
    {
      name: 'coupon-codebase',
      path: '/coupon-management/coupon-list/coupon-codebase',
      component: './coupon-management/coupon-codebase',
      wrappers: [RouteWatcher],
      hideInMenu: true,
    },
    {
      name: 'list-details',
      path: '/coupon-management/coupon-list/list-details',
      component: './coupon-management/list-details',
      wrappers: [RouteWatcher],
      hideInMenu: true,
    },
    {
      name: 'coupon-audit',
      path: '/coupon-management/coupon-audit',
      component: './coupon-management/coupon-audit',
      wrappers: [RouteWatcher],
    },
    {
      name: 'audit-details',
      path: '/coupon-management/coupon-audit/audit-details',
      component: './coupon-management/audit-details',
      wrappers: [RouteWatcher],
      hideInMenu: true,
    },
    {
      name: 'coupon-crowd',
      path: '/coupon-management/coupon-crowd',
      component: './coupon-management/coupon-crowd',
      wrappers: [RouteWatcher],
    },
    {
      name: 'add-crowd',
      path: '/coupon-management/coupon-crowd/add-crowd',
      component: './coupon-management/coupon-crowd/add-crowd',
      wrappers: [RouteWatcher],
    }
  ],
}
