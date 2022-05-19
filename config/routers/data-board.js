export default {
  name: 'data-board',
  path: '/data-board',
  routes: [
    {
      name: 'summary-of-data',
      path: '/data-board/summary-of-data',
      component: './data-board/summary-of-data'
    },
    {
      name: 'order-analysis',
      path: '/data-board/order-analysis',
      component: './data-board/order-analysis'
    },
    {
      name: 'product-data',
      path: '/data-board/product-data',
      component: './data-board/product-data'
    },
    {
      name: 'community-store-data',
      path: '/data-board/community-store-data',
      component: './data-board/community-store-data'
    },
    {
      name: 'operation-data',
      path: '/data-board/operation-data',
      component: './data-board/operation-data'
    },
    {
      name: 'supplier-data',
      path: '/data-board/supplier-data',
      component: './data-board/supplier-data'
    },
    {
      name: 'detail',
      path: '/data-board/supplier-data/detail',
      component: './data-board/supplier-data/detail'
    },
    {
      name: 'supplier-development-data',
      path: '/data-board/supplier-development-data',
      component: './data-board/supplier-development-data'
    },
    {
      name: 'data-preview',
      path: '/data-board/data-preview',
      component: './data-board/data-preview'
    },
    {
      name: 'intensive-data-export',
      path: '/data-board/intensive-data-export',
      component: './data-board/intensive-data-export'
    },
    {
      name: 'data-sales',
      path: '/data-board/data-sales',
      component: './data-board/data-sales'
    },
    {
      name: 'gmv-detail',
      path: '/data-board/gmv-detail',
      component: './data-board/data-sales/gmv-detail'
    },
    {
      name: 'sales-detail',
      path: '/data-board/sales-detail',
      component: './data-board/data-sales/sales-detail'
    },
    {
      name: 'gmv-order',
      path: '/data-board/gmv-order',
      component: './data-board/data-sales/gmv-order'
    },
    {
      name: 'sales-order',
      path: '/data-board/sales-order',
      component: './data-board/data-sales/sales-order'
    },
    {
      name: 'class-of-view',
      path: '/data-board/class-of-view',
      component: './data-board/class-of-view'
    },
    {
      name: 'order-list',
      path: '/data-board/order-list',
      component: './data-board/class-of-view/order'
    },
    {
      name: 'rank',
      path: '/data-board/rank',
      component: './data-board/rank'
    },
    {
      name: 'order',
      path: '/data-board/order/:id',
      component: './data-board/order'
    }
  ]
}