const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/group-activities-management',
  name: 'group-activities-management',
  routes: [
    {
      name: 'activity-list',
      path: '/group-activities-management/activity-list',
      component: './group-activities-management/activity-list',
      wrappers: [RouteWatcher]
    },
    {
      name: 'activity-data',
      path: '/group-activities-management/activity-data',
      component: './group-activities-management/activity-data',
      wrappers: [RouteWatcher]
    },
  ]
}
