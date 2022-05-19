const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
  path: '/cms',
  name: 'cms',
  routes: [
    {
      name: 'banner-admin',
      path: '/cms/banner-admin',
      component: './cms/banner-admin',
      wrappers: [RouteWatcher],
    },
    {
      name: 'home-activity',
      path: '/cms/home-activity',
      component: './cms/home-activity',
      wrappers: [RouteWatcher],
    },
    {
      name: 'goos-reg',
      path: '/cms/goos-reg',
      routes: [
        {
          name: 'member',
          path: '/cms/goos-reg/member',
          component: './cms/goos-reg/member',
          wrappers: [RouteWatcher],
        },
        {
          name: 'hot-goos',
          path: '/cms/goos-reg/hot-goos',
          component: './cms/goos-reg/hot-goos',
          wrappers: [RouteWatcher],
        },
        {
          name: 'crazy-date',
          path: '/cms/goos-reg/crazy-date',
          component: './cms/goos-reg/crazy-date',
          wrappers: [RouteWatcher],
        },
        {
          name: 'weekend-revelry',
          path: '/cms/goos-reg/weekend-revelry',
          component: './cms/goos-reg/weekend-revelry',
          wrappers: [RouteWatcher],
        },
        {
          name: 'save-money',
          path: '/cms/goos-reg/save-money',
          component: './cms/goos-reg/save-money',
          wrappers: [RouteWatcher],
        },
        {
          name: 'strategy-today',
          path: '/cms/goos-reg/strategy-today',
          component: './cms/goos-reg/strategy-today',
          wrappers: [RouteWatcher],
        }
      ]
    },
    {
      name: 'new-poster',
      path: '/cms/new-poster',
      component: './cms/new-poster',
      wrappers: [RouteWatcher],
    },
    {
      name: 'coupon',
      path: '/cms/coupon',
      component: './cms/coupon',
      wrappers: [RouteWatcher],
    },
    {
      name: 'hot-search',
      path: '/cms/hot-search',
      component: './cms/hot-search',
      wrappers: [RouteWatcher],
    },
    {
      name: 'market',
      path: '/cms/market',
      component: './cms/market',
      wrappers: [RouteWatcher],
    },
    {
      name: 'content-version',
      path: '/cms/content-version',
      component: './cms/content-version',
      wrappers: [RouteWatcher],
    },
    {
      name: 'popup',
      path: '/cms/popup',
      routes: [
        {
          name: 'home-red-envelopes',
          path: '/cms/popup/home-red-envelopes',
          component: './cms/popup/home-red-envelopes',
          wrappers: [RouteWatcher],
        },
        {
          name: 'start-up',
          path: '/cms/popup/start-up',
          component: './cms/popup/start-up',
          wrappers: [RouteWatcher],
        },
        {
          name: 'home-popup',
          path: '/cms/popup/home-popup',
          component: './cms/popup/home-popup',
          wrappers: [RouteWatcher],
        },
        {
          name: 'popup-template',
          path: '/cms/popup/popup-template',
          component: './cms/popup/popup-template',
          wrappers: [RouteWatcher],
        },
      ]
    },
    {
      name: 'home-classification',
      path: '/cms/home-classification',
      component: './cms/home-classification',
      wrappers: [RouteWatcher],
    },
    {
      name: 'goods-sort',
      path: '/cms/goods-sort',
      component: './cms/goods-sort',
      wrappers: [RouteWatcher],
    },
    {
      name: 'goods-class',
      path: '/cms/goods-class',
      component: './cms/goods-class',
      wrappers: [RouteWatcher],
    },
    {
      name: 'story',
      path: '/cms/story',
      component: './cms/story',
      wrappers: [RouteWatcher],
    },
    {
      name: 'home-suspension',
      path: '/cms/home-suspension',
      component: './cms/home-suspension',
      wrappers: [RouteWatcher],
    },
    {
      name: 'generate-invitation-code',
      path: '/cms/generate-invitation-code',
      component: './cms/generate-invitation-code',
      wrappers: [RouteWatcher],
    },
    {
      name: 'express-news',
      path: '/cms/express-news',
      component: './cms/express-news',
      wrappers: [RouteWatcher],
    },
    // {
    //   name: 'king-kong-district',
    //   path: '/cms/king-kong-district',
    //   component: './cms/king-kong-district',
    //   wrappers: [RouteWatcher],
    // },
    // {
    //   name: 'price-comparsion',
    //   path: '/cms/price-comparsion',
    //   routes: [
    //     {
    //       name: 'home-list',
    //       path: '/cms/price-comparsion/home-list',
    //       component: './cms/price-comparsion/home-list',
    //       wrappers: [RouteWatcher],
    //     },
    //     {
    //       name: 'low-goods',
    //       path: '/cms/price-comparsion/low-goods',
    //       component: './cms/price-comparsion/low-goods',
    //       wrappers: [RouteWatcher],
    //     },
    //   ],
    // },
    // {
    //   name: 'route-url-deploy',
    //   path: '/cms/route-url-deploy',
    //   component: './cms/route-url-deploy',
    //   wrappers: [RouteWatcher],
    // },
    // {
    //   name: 'poster',
    //   path: '/cms/poster',
    //   component: './cms/poster',
    //   wrappers: [RouteWatcher],
    // },
  ]
}