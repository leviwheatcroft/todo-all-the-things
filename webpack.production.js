// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'docs')
  }
})
