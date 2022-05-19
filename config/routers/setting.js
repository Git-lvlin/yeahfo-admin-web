const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/setting',
  name: 'setting',
  routes: [
    {
      name: 'account-management',
      path: '/setting/account-management',
      component: './setting/account-management',
      wrappers: [RouteWatcher],
    },
    {
      name: 'role-management',
      path: '/setting/role-management',
      component: './setting/role-management',
      wrappers: [RouteWatcher],
    },
    {
      name: 'authority-management',
      path: '/setting/authority-management',
      component: './setting/authority-management',
      wrappers: [RouteWatcher],
    },
    {
      name: 'password',
      path: '/setting/password',
      component: './setting/password',
      wrappers: [RouteWatcher],
      hideInMenu: true,
    },
    {
      name: 'shipments-area-configuration',
      path: '/setting/shipments-area-configuration',
      component: './setting/shipments-area-configuration',
      wrappers: [RouteWatcher],
    },
    {
      name: 'switch-setting',
      path: '/setting/switch-setting',
      component: './setting/switch-setting',
      wrappers: [RouteWatcher],
    },
  ]
}
