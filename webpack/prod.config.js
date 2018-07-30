const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./base.config.js');
const constants = require('./constants');

const files = [
  { from: './src/json/config/config.prod.json', to: 'configuration.json', dot: true },
];

module.exports = merge(base, {
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: constants.PRODUCTION, DEBUG: false }),
    new CopyWebpackPlugin(files, { copyUnmodified: true })
  ]
});