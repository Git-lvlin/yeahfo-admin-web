const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
    path: '/sign-activity-management',
    name: 'sign-activity-management',
    routes: [
      {
        name: 'sign-rule',
        path: '/sign-activity-management/sign-rule',
        component: './sign-activity-management/sign-rule',
        wrappers: [RouteWatcher],
      },
      {
        name: 'usable-commodity',
        path: '/sign-activity-management/usable-commodity',
        component: './sign-activity-management/usable-commodity',
        wrappers: [RouteWatcher],
      },
      {
        name: 'grant-detail',
        path: '/sign-activity-management/grant-detail',
        component: './sign-activity-management/grant-detail',
        wrappers: [RouteWatcher],
      },
      {
        name: 'consume-detail',
        path: '/sign-activity-management/consume-detail',
        component: './sign-activity-management/consume-detail',
        wrappers: [RouteWatcher],
      },
      {
        name: 'user-detail',
        path: '/sign-activity-management/user-detail',
        component: './sign-activity-management/user-detail',
        wrappers: [RouteWatcher],
        hideInMenu: true
      }
    ]
  }
  