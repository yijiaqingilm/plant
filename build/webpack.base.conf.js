var webpack = require('webpack')
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js',
        /* 存在问题 先注释掉*/
        // vendor: ['vue', 'framework7-vue'],
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    externals: {
        'f7': 'Framework7',
        'wx': 'jWeixin',
        'AMap': 'window.AMap',
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'src': resolve('src'),
            'assets': resolve('src/assets'),
            'pages': resolve('src/assets/vue/pages'),
            'components': resolve('src/components'),
            'directives': resolve('src/directives'),
            'static': resolve('src/assets/static'),
            'api': resolve('src/api'),
            'lib': resolve('src/lib'),
            'section': resolve('src/section'),
            'config': resolve('src/config'),
            'font':resolve('src/font')

        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.scss$/,
                loader: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
                /*use: ExtractTextPlugin.extract({
                 fallback: "style-loader",
                 use: ['css-loader', 'postcss-loader', 'sass-loader'],
                 })*/
            },
            {
                test: /\.less$/,
                loader: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 100,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|TTF)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ],
        noParse: /node_modules\/(jquey|framework7|moment|chart\.js)/,
    }


}
