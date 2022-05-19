const RouteWatcher = '@/components/PageTab/RouteWatcher';


export default {
  path: '/product-management',
  name: 'product-management',
  routes: [
    {
      path: '/product-management/supplier',
      name: 'supplier',
      routes: [
        {
          name: 'product-list',
          path: '/product-management/supplier/product-list',
          component: './product-management/supplier/product-list',
          wrappers: [RouteWatcher],
        },
        {
          name: 'product-list-purchase',
          path: '/product-management/supplier/product-list-purchase',
          component: './product-management/supplier/product-list',
          wrappers: [RouteWatcher],
        },
        {
          name: 'product-review',
          path: '/product-management/supplier/product-review',
          component: './product-management/supplier/product-review',
          wrappers: [RouteWatcher],
        },
        {
          name: 'overrule-list',
          path: '/product-management/supplier/overrule-list',
          component: './product-management/supplier/overrule-list',
          wrappers: [RouteWatcher],
        },
        {
          name: 'set-goods-list',
          path: '/product-management/supplier/set-goods-list',
          component: './product-management/supplier/set-goods-list',
          wrappers: [RouteWatcher],
        },
        {
          name: 'product-evaluate',
          path: '/product-management/supplier/product-evaluate',
          component: './product-management/supplier/product-evaluate',
          wrappers: [RouteWatcher],
        },
        {
          name: 'product-log',
          path: '/product-management/supplier/product-log',
          component: './product-management/supplier/product-log',
          wrappers: [RouteWatcher],
        },
      ]
    },
    {
      name: 'public',
      path: '/product-management/public',
      routes: [
        {
          name: 'product-unit',
          path: '/product-management/public/product-unit',
          component: './product-management/public/product-unit',
          wrappers: [RouteWatcher],
        },
        {
          name: 'product-category',
          path: '/product-management/public/product-category',
          component: './product-management/public/product-category',
          wrappers: [RouteWatcher],
        },
        {
          name: 'brand-list',
          path: '/product-management/public/brand-list',
          component: './product-management/public/brand-list',
          wrappers: [RouteWatcher],
        },
      ]
    },
    {
      name: 'product-detail',
      path: '/product-management/product-detail/:id',
      component: './product-management/product-detail',
      hideInMenu: true,
    },
    {
      name: 'daifa-product',
      path: '/product-management/daifa-product',
      component: './product-management/daifa-product',
      wrappers: [RouteWatcher],
    },
    
    // {
    //   name: 'freight-template',
    //   path: '/product-management/freight-template',
    //   component: './product-management/freight-template',
    // },
  ]
}
