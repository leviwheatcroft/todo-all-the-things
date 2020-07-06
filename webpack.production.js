const HtmlWebpackPlugin = require('html-webpack-plugin')
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      base: 'https://leviwheatcroft.github.io/todo-all-the-things/'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'docs')
  }
})
