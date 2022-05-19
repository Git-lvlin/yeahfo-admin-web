const RouteWatcher = '@/components/PageTab/RouteWatcher';


export default {
  path: '/order-management',
  name: 'order-management',
  routes: [
    {
      name: 'normal-order',
      path: '/order-management/normal-order',
      component: './order-management/normal-order',
      wrappers: [RouteWatcher],
    },
    {
      name: 'normal-order-purchase',
      path: '/order-management/normal-order-purchase',
      component: './order-management/normal-order',
      wrappers: [RouteWatcher],
    },
    {
      name: 'normal-order-detail',
      path: '/order-management/normal-order-detail/:id',
      component: './order-management/normal-order-detail',
      hideInMenu: true,
    },
    {
      name: 'normal-order-detail-purchase',
      path: '/order-management/normal-order-detail-purchase/:id',
      component: './order-management/normal-order-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-order',
      path: '/order-management/intensive-order',
      routes: [
        {
          name: 'intensive-purchase-order',
          path: '/order-management/intensive-order/intensive-purchase-order',
          component: './order-management/intensive-order/intensive-purchase-order',
          wrappers: [RouteWatcher],
        },
        {
          name: 'supplier-order',
          path: '/order-management/intensive-order/supplier-order',
          component: './order-management/intensive-order/supplier-order',
          wrappers: [RouteWatcher],
        },
        {
          name: 'supplier-order-purchase',
          path: '/order-management/intensive-order/supplier-order-purchase',
          component: './order-management/intensive-order/supplier-order',
          wrappers: [RouteWatcher],
        },
        {
          name: 'supplier-order-detail',
          path: '/order-management/intensive-order/supplier-order-detail/:id',
          component: './order-management/intensive-order/supplier-order-detail',
          hideInMenu: true,
        },
        {
          name: 'supplier-order-detail-purchase',
          path: '/order-management/intensive-order/supplier-order-detail-purchase/:id',
          component: './order-management/intensive-order/supplier-order-detail',
          hideInMenu: true,
        },
        {
          name: 'shopkeeper-order',
          path: '/order-management/intensive-order/shopkeeper-order',
          component: './order-management/intensive-order/shopkeeper-order',
          wrappers: [RouteWatcher],
        },
        {
          name: 'shopkeeper-order-detail',
          path: '/order-management/intensive-order/shopkeeper-order-detail/:id',
          component: './order-management/intensive-order/shopkeeper-order-detail',
          hideInMenu: true,
        },
      ]
    },
    {
      name: 'sample-order',
      path: '/order-management/sample-order',
      component: './order-management/sample-order',
      wrappers: [RouteWatcher],
    },
    {
      name: 'sample-order-purchase',
      path: '/order-management/sample-order-purchase',
      component: './order-management/sample-order',
      wrappers: [RouteWatcher],
    },
    {
      name: 'sample-order-detail',
      path: '/order-management/sample-order-detail/:id',
      component: './order-management/sample-order-detail',
      hideInMenu: true,
    },
    {
      name: 'sample-order-detail-purchase',
      path: '/order-management/sample-order-detail-purchase/:id',
      component: './order-management/sample-order-detail',
      hideInMenu: true,
    },
    {
      name: 'after-sales-order',
      path: '/order-management/after-sales-order',
      component: './order-management/after-sales-order',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-refund-order',
      path: '/order-management/intensive-refund-order',
      component: './order-management/intensive-refund-order',
      wrappers: [RouteWatcher],
    },
    {
      name: 'after-sales-order-details',
      path: '/order-management/after-sales-order/detail/:id',
      component: './order-management/after-sales-order/detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-after-sale-orders',
      path: '/order-management/intensive-after-sale-orders',
      component: './order-management/intensive-after-sale-orders',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-after-sale-orders-details',
      path: '/order-management/intensive-after-sale-orders/detail/:id',
      component: './order-management/intensive-after-sale-orders/detail',
      hideInMenu: true,
    },
    {
      name: 'intervention-list',
      path: '/order-management/intervention-list',
      component: './order-management/intervention-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'details',
      path: '/order-management/intervention-list/details/:id',
      component: './order-management/intervention-list/detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-intervention-list',
      path: '/order-management/intensive-intervention-list',
      component: './order-management/intensive-intervention-list',
      wrappers: [RouteWatcher],
    },
    {
      name: 'intensive-intervention-list-details',
      path: '/order-management/intensive-intervention-list/details/:id',
      component: './order-management/intensive-intervention-list/detail',
      hideInMenu: true,
    }
  ]
}
