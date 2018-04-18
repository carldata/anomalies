const merge = require('webpack-merge')
const base = require('./base.config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(base,{
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})