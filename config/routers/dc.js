export default {
  path: '/dc-management',
  name: 'dc-management',
  routes: [
    {
      name: 'add',
      path: '/dc-management/add',
      component: './dc-management/add',
      hideInMenu: true
    },
    {
      name: 'list',
      path: '/dc-management/list',
      component: './dc-management/list',
    },
    {
      name: 'version',
      path: '/dc-management/version',
      component: './dc-management/version',
    },
    {
      name: 'data-board',
      path: '/dc-management/data-board',
      component: './dc-management/data-board',
    },
    {
      name: 'data-board-configuration',
      path: '/dc-management/data-board/data-board-configuration',
      component: './dc-management/data-board/data-board-configuration',
      hideInMenu: true
    },
    {
      name: 'import-export',
      path: '/dc-management/import-export',
      routes: [
        {
          name: 'export-configuration',
          path: '/dc-management/import-export/export-configuration',
          component: './dc-management/import-export/export-configuration',
        },
        {
          name: 'import-configuration',
          path: '/dc-management/import-export/import-configuration',
          component: './dc-management/import-export/import-configuration'
        }
      ]
    }
  ]
}