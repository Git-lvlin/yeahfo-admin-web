const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
    path: '/blind-box-activity-management',
    name: 'blind-box-activity-management',
    routes: [
      {
        name: 'blind-box-management-list',
        path: '/blind-box-activity-management/blind-box-management-list',
        component: './blind-box-activity-management/blind-box-management-list',
        wrappers: [RouteWatcher],
      },
      {
        name: 'blind-box-consume-detail',
        path: '/blind-box-activity-management/blind-box-consume-detail',
        component: './blind-box-activity-management/blind-box-consume-detail',
        wrappers: [RouteWatcher],
      },
      {
        name: 'blind-box-grant-detail',
        path: '/blind-box-activity-management/blind-box-grant-detail',
        component: './blind-box-activity-management/blind-box-grant-detail',
        wrappers: [RouteWatcher],
      },
      {
        name: 'blind-box-employ-detail',
        path: '/blind-box-activity-management/blind-box-employ-detail',
        component: './blind-box-activity-management/blind-box-employ-detail',
        wrappers: [RouteWatcher],
        hideInMenu: true
      },
      {
        name: 'bind-box-rule-set',
        path: '/blind-box-activity-management/bind-box-rule-set',
        component: './blind-box-activity-management/bind-box-rule-set',
        wrappers: [RouteWatcher],
        hideInMenu: true
      },
      {
        name: 'blind-box-withdraw-deposit-detail',
        path: '/blind-box-activity-management/blind-box-withdraw-deposit-detail',
        component: './blind-box-activity-management/blind-box-withdraw-deposit-detail',
        wrappers: [RouteWatcher],
      }
    ]
  }
  