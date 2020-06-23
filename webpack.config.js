const {
  WebpackBundleSizeAnalyzerPlugin
} = require('webpack-bundle-size-analyzer')

const path = require('path')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'

module.exports = {
  mode,
  entry: './index.js',
  devtool: mode === 'development' ? 'source-map' : 'none',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'site.js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'raw-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.html$/,
        use: [
          { loader: 'raw-loader' }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'raw-loader' }
        ]
      }
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader
      //     },
      //     // {
      //     //   loader: 'style-loader' // creates style nodes from JS strings
      //     // },
      //     {
      //       loader: 'css-loader' // translates CSS into CommonJS
      //     }
      //   ]
      // },
      // {
      //   test: /\.pug$/,
      //   use: 'pug-loader'
      // }
    ]
  },
  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: 'site.css'
    // }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new WebpackBundleSizeAnalyzerPlugin('./sizeAnalyzer.txt')
  ],
  watchOptions: {
    aggregateTimeout: 200,
    ignored: /node_modules/
  },
  resolve: {
    alias: {
      // jquery: 'jquery/src/jquery'
    },
    extensions: ['.js', '.less', '.html']
  }
}
