const { execSync } = require('child_process')
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.COMMIT_HASH': JSON.stringify(execSync('git rev-parse HEAD').toString().trim()),
      'process.env.COMMIT_HASH_SHORT': JSON.stringify(execSync('git rev-parse --short HEAD').toString().trim())
    })
  ]
}
