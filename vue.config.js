const path = require('path')

const rules = []

if (process.env.NODE_ENV === 'test') {
  rules.push({
    test: /\.(js|ts)$/,
    include: path.resolve('src'),
    loader: 'istanbul-instrumenter-loader',
    query: {
      esModules: true
    }
  })
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@util', path.resolve(__dirname, 'src/util'))
      .set('@router', path.resolve(__dirname, 'src/router.js'))
  },
  configureWebpack: {
    module: {
      rules: rules
    }
  }
}
