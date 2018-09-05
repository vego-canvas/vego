const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: {
        bundle: './index.js',
    },
    output: {
        path: __dirname + '/',
        filename: '[name].js',
        publicPath: '/',
    },
    mode: 'development',
    module: {
        rules:[
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                  'vue-style-loader',
                  'css-loader'
                ]
            }
        ]
    },
    plugins: [
    // make sure to include the plugin!
        new VueLoaderPlugin()
    ]
    // module: {
    //     rules: [
    //         { test: /\.css$/, use: ['style-loader', 'css-loader', require.resolve('../../../index')] },
    //         { test: /\.png$/, use: ['file-loader'] },
    //     ],
    // },
    // plugins: [new CSSSpritePlugin()],
};
