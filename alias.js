// for webstorm
/*
 *  settings -> Language & Frameworks -> Javascript -> webpack    choose this alias file
 * */
const path = require('path')
module.exports = {
  resolve: {
    // for WebStorm
    alias: {
      '~': path.resolve(__dirname),
      '@': path.join(__dirname, 'src'),
      '@$': path.join(__dirname, 'src'),
      '@server': path.join(__dirname, 'server')
    }
  }
}
