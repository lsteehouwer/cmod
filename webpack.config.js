const path = require('path');
const webpack = require("webpack");
const conf = require("./config.json");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let config = {
    context: path.resolve(__dirname),
    devtool: 'eval-source-map',
    entry: path.resolve(__dirname, "src/main.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'main.js',
    },
    resolve: {
        alias: {
            "src": path.resolve(__dirname, "src"),
        },
        extensions: [ '.ts', '.js' ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.html$/,
                include: /src\/components/,
                loader: 'vue-template-loader',
                options: {
                    scoped: false,
                },
            },
            {
                test: /\.scss$/,
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                },
            },
            {
                enforce: 'post',
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'API_URL': JSON.stringify(conf.API_URL),
            'DEVELOPMENT': JSON.stringify(process.env.NODE_ENV == 'development'),
            'PRODUCTION': JSON.stringify(process.env.NODE_ENV == 'production'),
            'SOURCE_URL': JSON.stringify("https://github.com/lsteehouwer/cmod"),
            'BUG_URL': JSON.stringify("https://github.com/lsteehouwer/cmod/issues"),
            'INSTITUTION': JSON.stringify("Utrecht University"),
            'SHOW_SUCCESS_MESSAGE': JSON.stringify(conf.SHOW_SUCCESS_MESSAGE),
            'SHOW_QUESTIONNAIRE_MESSAGE': JSON.stringify(conf.SHOW_QUESTIONNAIRE_MESSAGE),
            'QUESTIONNAIRE_URL': JSON.stringify(conf.QUESTIONNAIRE_URL)
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            inject: "head",
        }),
        new MiniCssExtractPlugin({
            filename: "style.css"
        }),
    ]
}

module.exports = config;
