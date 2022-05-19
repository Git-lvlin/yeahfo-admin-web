const RouteWatcher = '@/components/PageTab/RouteWatcher';


export default {
  path: '/intensive-activity-management',
  name: 'intensive-activity-management',
  routes: [
    {
      name: 'intensive-activity-list',
      path: '/intensive-activity-management/intensive-activity-list',
      component: './intensive-activity-management/intensive-activity-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-bulk-activity-list',
      path: '/intensive-activity-management/intensive-bulk-activity-list',
      component: './intensive-activity-management/intensive-bulk-activity-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-activity-profit-detail',
      path: '/intensive-activity-management/intensive-activity-profit-detail',
      component: './intensive-activity-management/intensive-activity-profit-detail',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-activity-create',
      path: '/intensive-activity-management/intensive-activity-create/:id',
      component: './intensive-activity-management/intensive-activity-create',
      hideInMenu: true,
    },
    {
      name: 'intensive-bulk-activity-create',
      path: '/intensive-activity-management/intensive-bulk-activity-create/:id',
      component: './intensive-activity-management/intensive-bulk-activity-create',
      hideInMenu: true,
    },
    {
      name: 'intensive-activity-detail',
      path: '/intensive-activity-management/intensive-activity-detail/:id',
      component: './intensive-activity-management/intensive-activity-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-bulk-activity-detail',
      path: '/intensive-activity-management/intensive-bulk-activity-detail/:id',
      component: './intensive-activity-management/intensive-bulk-activity-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-activity-audit',
      path: '/intensive-activity-management/intensive-activity-audit',
      component: './intensive-activity-management/intensive-activity-audit',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-activity-audit-detail',
      path: '/intensive-activity-management/intensive-activity-audit/detail/:id',
      component: './intensive-activity-management/intensive-activity-audit/detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-bulk-activity-audit-detail',
      path: '/intensive-activity-management/intensive-bulk-activity-audit/detail/:id',
      component: './intensive-activity-management/intensive-activity-audit/bulk-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-remind-configuration',
      path: '/intensive-activity-management/intensive-remind-configuration',
      component: './intensive-activity-management/intensive-remind-configuration',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-remind-statistics',
      path: '/intensive-activity-management/intensive-remind-statistics',
      component: './intensive-activity-management/intensive-remind-statistics',
      wrappers: [RouteWatcher],
    },
    {
      name: 'platfor-bonus-percentage',
      path: '/intensive-activity-management/platfor-bonus-percentage',
      component: './intensive-activity-management/platfor-bonus-percentage',
      wrappers: [RouteWatcher],
    },
    {
      name: 'platfor-bonus-percentage-audit',
      path: '/intensive-activity-management/platfor-bonus-percentage-audit',
      component: './intensive-activity-management/platfor-bonus-percentage-audit',
      wrappers: [RouteWatcher],
    },
    {
      name: 'penny-activity',
      path: '/intensive-activity-management/penny-activity',
      routes: [
          {
            name: 'activity-list',
            path: '/intensive-activity-management/penny-activity/activity-list',
            component: './intensive-activity-management/penny-activity/activity-list',
            wrappers: [RouteWatcher],
          },
          {
            name: 'added-activity',
            path: '/intensive-activity-management/penny-activity/added-activity',
            component: './intensive-activity-management/penny-activity/added-activity',
            hideInMenu: true,
            wrappers: [RouteWatcher],
          },
          {
            name: 'activity-detail',
            path: '/intensive-activity-management/penny-activity/activity-detail',
            component: './intensive-activity-management/penny-activity/activity-detail',
            hideInMenu: true,
            wrappers: [RouteWatcher],
          },
          {
            name: 'activity-tabulate-data',
            path: '/intensive-activity-management/penny-activity/activity-tabulate-data',
            component: './intensive-activity-management/penny-activity/activity-tabulate-data',
          },
        ]
    },
    {
      name: 'special-offer-acticity',
      path: '/intensive-activity-management/special-offer-acticity',
      routes: [
          {
            name: 'special-offer-acticity-list',
            path: '/intensive-activity-management/special-offer-acticity/special-offer-acticity-list',
            component: './intensive-activity-management/special-offer-acticity/special-offer-acticity-list',
            wrappers: [RouteWatcher],
          },
          {
            name: 'add-activity',
            path: '/intensive-activity-management/special-offer-acticity/add-activity',
            component: './intensive-activity-management/special-offer-acticity/add-activity',
            hideInMenu: true,
            wrappers: [RouteWatcher],
          },
          {
            name: 'activity-detail',
            path: '/intensive-activity-management/special-offer-acticity/activity-detail',
            component: './intensive-activity-management/special-offer-acticity/activity-detail',
            hideInMenu: true,
            wrappers: [RouteWatcher],
          },
          {
            name: 'activity-tabulate-data',
            path: '/intensive-activity-management/special-offer-acticity/activity-tabulate-data',
            component: './intensive-activity-management/special-offer-acticity/activity-tabulate-data',
          },
        ]
    },
  ]
}
