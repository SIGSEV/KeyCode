const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/logos/dev.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [new HtmlWebpackPlugin()],
}
