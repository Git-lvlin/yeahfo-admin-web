const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/user-management',
  name: 'user-management',
  routes: [
    {
      name: 'user-list',
      path: '/user-management/user-list',
      component: './user-management/user-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'disable-user-list',
      path: '/user-management/disable-user-list',
      component: './user-management/disable-user-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'user-detail',
      path: '/user-management/user-detail/:id',
      component: './user-management/user-detail',
      hideInMenu: true,
      // wrappers: [RouteWatcher],
    },
    {
      name: 'user-relationship',
      path: '/user-management/user-relationship',
      component: './user-management/user-relationship',
      wrappers: [RouteWatcher],
    },
    {
      name: 'user-feedback',
      path: '/user-management/user-feedback',
      component: './user-management/user-feedback',
      wrappers: [RouteWatcher],
    },
    // {
    //   name: 'new-poster',
    //   path: '/user-management/new-poster',
    //   component: './user-management/new-poster',
    //   wrappers: [RouteWatcher],
    // },
    // {
    //   name: 'new-poster-new',
    //   path: '/user-management/new-poster-new',
    //   component: './user-management/new-poster-new',
    //   wrappers: [RouteWatcher],
    // },
    {
      name: 'cancellation-application-record',
      path: '/user-management/cancellation-application-record',
      component: './user-management/cancellation-application-record',
      wrappers: [RouteWatcher],
    },
    {
      name: 'logout-list',
      path: '/user-management/logout-list',
      component: './user-management/logout-list',
      wrappers: [RouteWatcher],
    },
  ]
}
