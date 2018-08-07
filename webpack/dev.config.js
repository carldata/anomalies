const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./base.config')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const constants = require('./constants');
const config = require('../src/json/config/config.dev.json')

const files = [
  { from: './src/json/config/config.dev.json', to: 'configuration.json', dot: true },
]

module.exports = merge(base, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin(files, { copyUnmodified: true }),
    new webpack.EnvironmentPlugin({ NODE_ENV: constants.DEVELOPMENT, DEBUG: true }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    hot: true,
    port: 9000
  }
})
