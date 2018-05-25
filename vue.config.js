const path = require('path')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        'util': path.resolve(__dirname, 'src/util')
      }
    }
  }
}
