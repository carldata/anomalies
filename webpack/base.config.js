const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/app.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname,'../dist')
  },
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "../src")
    ],
    extensions: [".js", ".ts", ".json", ".jsx", ".tsx", ".css", ".scss"],
    alias: {
      "@app-state": path.resolve(__dirname, '../src/state'),
      "@common": path.resolve(__dirname, '../src/common'),
      "@models": path.resolve(__dirname, '../src/models')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)(\?.*)?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
}