


const path =  require('path');
const diyLoader = require('css-loader');
module.exports = {
    chainWebpack(config){
      config.module
        .rule('diy-loader')
        .test(/\.js$/)
          .exclude
          .add([path.resolve('../src/pages/.umi'), path.resolve('node_modules')])
          .end()
        .use('../loader/jsx-px2rem-loader')
          .loader(path.join(__dirname, '../loader/jsx-px2rem-loader'));
    }
};




