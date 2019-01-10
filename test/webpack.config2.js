const path = require('path');
module.exports = {
    mode: 'development',
    entry: {
        bundle: './chartV2.js',
    },
    output: {
        path: __dirname + '/',
        filename: '[name].js',
        publicPath: '/',
    },
    context: __dirname,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src/'),
        },
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 8081,
    },

    // module: {
    //     rules: [
    //         { test: /\.css$/, use: ['style-loader', 'css-loader', require.resolve('../../../index')] },
    //         { test: /\.png$/, use: ['file-loader'] },
    //     ],
    // },
    // plugins: [new CSSSpritePlugin()],
};
