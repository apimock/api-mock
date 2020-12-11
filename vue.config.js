const webpack = require('webpack')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const createThemeColorReplacerPlugin = require('./src/config/plugin.config')
const alias = require('./alias')
const config = require('config')
const port = config.get('port')
const host = config.get('host')
const server = `http://${host}:${port}`
const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    resolve: alias.resolve,
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new MonacoWebpackPlugin({
        languages: ['javascript', 'css', 'html', 'typescript', 'json']
      })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    const snippets = config.module.rule('snippets')
    snippets.uses.clear()
    snippets.test(/\.snippets/).use('raw-loader').loader('raw-loader')

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '^/api': {
        target: server,
        ws: false,
        changeOrigin: true,
        secure: false, // 若接口地址为https需要设为true
        logLevel: 'debug',
        cookieDomainRewrite: 'localhost',
        preserveHeaderKeyCase: true
      },
      '^/mock': {
        target: server,
        hostRewrite: 301,
        logLevel: 'debug'
      },
      // 示例pathRewrite
      '^/dev-api/customer/': {
        target: `http://127.0.0.1:8000/`,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: function (path, req) {
          return path.replace('dev-api/customer', '/mock/95/dev-api/customer/')
        }
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
