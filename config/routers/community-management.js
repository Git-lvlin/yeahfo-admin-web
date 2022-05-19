const RouteWatcher = '@/components/PageTab/RouteWatcher';

export default {
    path: '/community-management',
    name: 'community-management',
    routes: [
      {
        name: 'circle-management',
        path: '/community-management/circle-management',
        component: './community-management/circle-management/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'add-circle',
        path: '/community-management/circle-management/add-circle',
        component: './community-management/circle-management/add-circle',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'circleinterior-management',
        path: '/community-management/circle-management/circleinterior-management',
        component: './community-management/circleinterior-management/index.js',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'invitation-detail',
        path: '/community-management/invitation-detail',
        component: './community-management/invitation-detail',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'content-management',
        path: '/community-management/content-management',
        component: './community-management/content-management/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'add-content',
        path: '/community-management/content-management/add-content',
        component: './community-management/content-management/add-content',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'dynamic-list-likes',
        path: '/community-management/content-management/dynamic-list-likes',
        component: './community-management/content-management/dynamic-list-likes',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'dynamic-comment-reply-list',
        path: '/community-management/content-management/dynamic-comment-reply-list',
        component: './community-management/content-management/dynamic-comment-reply-list',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'consultation-management',
        path: '/community-management/consultation-management',
        component: './community-management/consultation-management/index.js',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'reporttype-management',
        path: '/community-management/reporttype-management',
        component: './community-management/reporttype-management/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'review-report',
        path: '/community-management/review-report',
        component: './community-management/review-report/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'report-detail-list',
        path: '/community-management/report-detail-list',
        component: './community-management/report-detail-list',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'invitation-report',
        path: '/community-management/invitation-report',
        component: './community-management/invitation-report/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'community-advertising',
        path: '/community-management/community-advertising',
        component: './community-management/community-advertising/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'add-advertising',
        path: '/community-management/community-advertising/add-advertising',
        component: './community-management/community-advertising/add-advertising',
        hideInMenu: true,
        wrappers: [RouteWatcher],
      },
      {
        name: 'advertising-manage',
        path: '/community-management/advertising-manage',
        component: './community-management/advertising-manage/index.js',
        wrappers: [RouteWatcher],
      },
      {
        name: 'invitation-audi',
        path: '/community-management/invitation-audit',
        routes: [
          {
            name: 'list',
            path: '/community-management/invitation-audit/list',
            component: './community-management/invitation-audit',
            wrappers: [RouteWatcher],
          },
        ]
      },
      
    ],
  }
  