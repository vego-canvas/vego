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
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
        }
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
