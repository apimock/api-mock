// for webstorm
/*
 *  settings -> Language & Frameworks -> Javascript -> webpack    choose this alias file
 * */
const path = require('path')

module.exports = {
  resolve: {
    // for WebStorm
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname),
      '~assets': path.resolve(__dirname, 'assets'),
      '@server': path.join(__dirname, 'server'),
      '@models': path.join(__dirname, 'server/models'),
      '@core': path.join(__dirname, 'server/core'),
      '@controllers': path.join(__dirname, 'server/controllers'),
      '@config': path.join(__dirname, 'server/config'),
      '@utils': path.join(__dirname, 'utils'),
      '@provider': path.join(__dirname, 'server/provider'),
      '@routes': path.join(__dirname, 'server/routes')
    }
  }
}
