const moment = require('moment')

export default () => {
  return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
}
