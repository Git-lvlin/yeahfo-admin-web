const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/daifa-store-management',
  name: 'daifa-store-management',
  routes: [
    {
      name: 'list',
      path: '/daifa-store-management/list',
      component: './daifa-store-management/list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'consultant-product-list',
      path: '/daifa-store-management/list/consultant-product-list',
      component: './daifa-store-management/consultant-product-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'agent-shop-money',
      path: '/daifa-store-management/list/agent-shop-money',
      component: './daifa-store-management/agent-shop-money',
      wrappers: [RouteWatcher],
    },
    {
      name: 'agent-shop-store_apply',
      path: '/daifa-store-management/agent-shop-store_apply',
      component: './daifa-store-management/agent-shop-store_apply',
      wrappers: [RouteWatcher],
    }
  ]
}
