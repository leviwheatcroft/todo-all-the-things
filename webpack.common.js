const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './index.js',
  target: 'web',
  output: {
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
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'assets' }]
    })
  ],
  resolve: {
    alias: {
      // jquery: 'jquery/src/jquery'
    },
    extensions: ['.js', '.less', '.html'],
    mainFiles: ['index', '_index']
  }
}
