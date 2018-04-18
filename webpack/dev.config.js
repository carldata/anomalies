const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./base.config')

module.exports = merge(base, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    hot: true,
    port: 9000
  }
})
