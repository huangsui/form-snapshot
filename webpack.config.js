
const path = require('path');
var pkg = require('./package.json');

module.exports = {
    devtool: false,
    entry: './src/snapshot.js',
    output: {
        path: path.resolve(__dirname,'./dist/'),
        filename: 'snapshot.js'
    },
    devServer: {
        port: 8080,
        contentBase: './'
    },
    module: {
        loaders: []
    },
    plugins: []
};
