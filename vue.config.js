const webpack = require('webpack');
const {defineConfig} = require('@vue/cli-service');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = defineConfig({
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    transpileDependencies: true,
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/,
                threshold: 10240,
                deleteOriginalAssets: false
            })
        ],
        resolve: {
            fallback: {
                "fs": false,
                "util": false,
                "path": false,
                "assert": false
            }
        }
    }
})
