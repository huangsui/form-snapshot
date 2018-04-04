
const path = require('path');
var pkg = require('./package.json');

module.exports = {
    devtool: false,
    entry: './src/entry/snapshot-standard.js',
    output: {
        path: path.resolve(__dirname,'./dist/'),
        filename: 'snapshot.standard-1.0.0.js'
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
