var path = require('path');
var webpack = require('webpack');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ngtools = require('@ngtools/webpack');
var root = require('./helpers');

module.exports = {
    entry: {
        browser: root('./src/main.browser.ts'),
        angular: ['@angular/core', '@angular/platform-browser', '@angular/platform-browser-dynamic', '@angular/common', '@angular/router', '@angular/http', '@angular/forms'],
        polyfill: ['zone.js/dist/zone', 'reflect-metadata']
    },
    output: {
        path: root('build'),
        filename: '[name].js',
        chunkFilename: "[chunkhash:8].chunk.js",
        publicPath: 'http://support.163.com:9000/'
    },
    target: 'web',
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: [
                    '@ngtools/webpack'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 100
                }
            },
            {
                test: /\.scss$/,
                exclude: [
                    root('src/app')
                ],
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
            },
            {
                test: /\.scss$/,
                include: [
                    root('src/app')
                ],
                loaders: [
                    'to-string-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }, {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new DefinePlugin({
            'ENV': '"dev"'
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['bootstrap', 'angular', 'polyfill']
        }),
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: root('./src/index.ejs'),
            title: 'universal demo'
        }),
        new ngtools.AotPlugin({
            skipCodeGeneration: true,   //默认false. false：使用AoT ; true：不使用AoT 
            tsConfigPath: root('src/tsconfig.browser.json')
        })
    ],
    devtool: 'source-map' // 'eval' | cheap-module-source-map' | 'source-map'
}