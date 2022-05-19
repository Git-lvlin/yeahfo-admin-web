const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/business-school',
  name: 'business-school',
  routes: [
    {
      name: 'article-list',
      path: '/business-school/article-list',
      component: './business-school/article-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'shopkeeper-disclose',
      path: '/business-school/shopkeeper-disclose',
      component: './business-school/shopkeeper-disclose',
      wrappers: [RouteWatcher],
      hideInMenu: true
    },
    {
      name: 'article-category-list',
      path: '/business-school/article-category-list',
      component: './business-school/article-category-list',
      wrappers: [RouteWatcher],
    },
  ]
}