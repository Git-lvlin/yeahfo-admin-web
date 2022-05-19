const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/single-contract-activity-management',
  name: 'single-contract-activity-management',
  routes: [
    {
      name: 'activity-list',
      path: '/single-contract-activity-management/activity-list',
      component: './single-contract-activity-management/activity-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'activity-detail',
      path: '/single-contract-activity-management/activity-detail/:id',
      component: './single-contract-activity-management/activity-detail',
      hideInMenu: true,
    },
    {
      name: 'activity-product',
      path: '/single-contract-activity-management/activity-product/:id',
      component: './single-contract-activity-management/activity-product',
      hideInMenu: true,
    },
    {
      name: 'group-detail',
      path: '/single-contract-activity-management/group-detail/:id',
      component: './single-contract-activity-management/group-detail',
      hideInMenu: true,
    },
  ]
}
