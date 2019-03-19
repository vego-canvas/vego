const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
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
            '@': path.resolve(__dirname, '../src-dev/'),
            // vegocore: path.resolve(__dirname, '../core/'),
        },
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        compress: true,
        port: 8081,
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
        ],
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     title: 'demo',
        //     chunks: ['bundle'],
        //     template: 'index.html',
        // }),
        new VueLoaderPlugin(),
    ],
};
