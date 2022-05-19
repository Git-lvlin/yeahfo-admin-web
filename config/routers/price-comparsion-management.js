const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/price-comparsion-management',
  name: 'price-comparsion-management',
  routes: [
    {
      name: 'price-management',
      path: '/price-comparsion-management/price-management',
      component: './price-comparsion-management/price-management',
      wrappers: [RouteWatcher],
    }
  ]
}