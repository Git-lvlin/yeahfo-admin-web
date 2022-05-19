const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/message-management',
  name: 'message-management',
  routes: [
    {
      name: 'member-message-template-config',
      path: '/message-management/member-message-template-config',
      component: './message-management/member-message-template-config',
      wrappers: [RouteWatcher],
    },
    {
      name: 'store-message-template-config',
      path: '/message-management/store-message-template-config',
      component: './message-management/store-message-template-config',
      wrappers: [RouteWatcher],
    },
    {
      name: 'supplier-message-template-config',
      path: '/message-management/supplier-message-template-config',
      component: './message-management/supplier-message-template-config',
      wrappers: [RouteWatcher],
    },
    {
      name: 'platform-message-template-config',
      path: '/message-management/platform-message-template-config',
      component: './message-management/platform-message-template-config',
      wrappers: [RouteWatcher],
    },
    {
      name: 'custom-message',
      path: '/message-management/custom-message',
      component: './message-management/custom-message',
      wrappers: [RouteWatcher],
    },
    {
      name: 'audit',
      path: '/message-management/custom-message/audit/:id',
      component: './message-management/custom-message/audit',
      hideInMenu: true
    },
    {
      name: 'detail',
      path: '/message-management/custom-message/detail/:id',
      component: './message-management/custom-message/detail',
      hideInMenu: true
    },
    {
      name: 'stand-inside-letter-list',
      path: '/message-management/stand-inside-letter-list',
      component: './message-management/stand-inside-letter-list',
      wrappers: [RouteWatcher],
    },
    // {
    //   name: 'popup-template',
    //   path: '/message-management/popup-template',
    //   component: './message-management/popup-template',
    //   wrappers: [RouteWatcher],
    // }
  ]
}