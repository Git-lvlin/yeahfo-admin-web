/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/auth/': {
      target: 'https://adminapi-dev.yeahgo.com',
      // target: 'https://adminapi.yeahgo.com',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
    '/java-admin/': {
      // target: 'http://192.168.3.2:6664',
      target: 'http://admin.waiad.icu',
      changeOrigin: true,
      pathRewrite: {
        '^': ''
      }
    }
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
