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
      '@server': path.join(__dirname, 'server')
    }
  }
}
