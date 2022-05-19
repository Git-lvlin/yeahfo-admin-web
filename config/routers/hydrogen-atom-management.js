const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
    path: '/hydrogen-atom-management',
    name: 'hydrogen-atom-management',
    routes: [
      {
        name: 'hydrogen-atom-configuration',
        path: '/hydrogen-atom-management/hydrogen-atom-configuration',
        component: './hydrogen-atom-management/hydrogen-atom-configuration',
        wrappers: [RouteWatcher],
      },
      {
        name: 'equipment-management',
        path: '/hydrogen-atom-management/equipment-management',
        component: './hydrogen-atom-management/equipment-management',
        wrappers: [RouteWatcher],
      },
      {
        name: 'transaction-data',
        path: '/hydrogen-atom-management/transaction-data',
        component: './hydrogen-atom-management/transaction-data',
        wrappers: [RouteWatcher],
      },
      {
        name: 'referral-commission',
        path: '/hydrogen-atom-management/referral-commission',
        component: './hydrogen-atom-management/referral-commission',
        wrappers: [RouteWatcher],
      },
      {
        name: 'hydrogen-atom-start-recording',
        path: '/hydrogen-atom-management/hydrogen-atom-start-recording',
        component: './hydrogen-atom-management/hydrogen-atom-start-recording',
        wrappers: [RouteWatcher],
      },
    ]
  }