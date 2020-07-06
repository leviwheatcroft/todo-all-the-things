const HtmlWebpackPlugin = require('html-webpack-plugin')
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')
const {
  WebpackBundleSizeAnalyzerPlugin
} = require('webpack-bundle-size-analyzer')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      base: '/'
    }),
    new WebpackBundleSizeAnalyzerPlugin('./sizeAnalyzer.txt')
  ],
  watchOptions: {
    aggregateTimeout: 200,
    ignored: /node_modules/
  },
  output: {
    path: path.resolve(__dirname, 'build')
  }
})
