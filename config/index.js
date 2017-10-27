// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: './',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    proxyTable: {
      // 测试服务器
      '/maintenance': {
        /*本地测试服务*/
        /* target: 'http://easy-mock.com/mock/590a8d177a878d73716eb90e/zhuzhu',*/

        /*测试环境地址*/
        target: 'http://mobile.zhuzhu.com',
        /* target: 'http://192.168.1.121',*/
        changeOrigin: true
      },
      '/user': {
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      },
      '/query': {
        target: 'http://easy-mock.com/mock/590a8d177a878d73716eb90e/zhuzhu',
        changeOrigin: true
      },
      '/customer': {
        /*target: 'http://easy-mock.com/mock/590a8d177a878d73716eb90e/zhuzhu',*/
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      },
      '/seller': {
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      },
      '/category': {
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      },
      '/coupon': {
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      },
      '/banner': {
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      },
      '/presale': {
        target: 'http://mobile.zhuzhu.com',
        changeOrigin: true
      }

    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true,
  }
}
