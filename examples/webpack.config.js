const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
console.log(path.resolve(__dirname,  './'))
module.exports = {
    entry: {
        bundle: './index.js',
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
        }
      },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 8080
    },
    mode: 'development',
    module: {
        rules:[
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options:{
                    presets: ['@babel/preset-env'],
                }
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
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {}
                  }
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
