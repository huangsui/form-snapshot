

const path = require('path');
var pkg = require('./package.json');

module.exports = {
  devtool: false,
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname,'./public/'),
    filename: 'bundle.js'
  },
  devServer: {
      hot: true,
      port: 8080,
      contentBase: './'
  },
  module: {
    loaders: []
  },
  plugins: []
};