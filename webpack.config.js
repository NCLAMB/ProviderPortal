const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
module.exports = {
    // ...
    optimization: {
        minimizer: [
          new BabelMinifyPlugin()
        ]
    }
};
module.exports = {
    mode:"production",
    entry: './src/app.jsx',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundlev11_4.js'
    },
    module: {
        rules: [
            { 
                loader: 'babel-loader',

                test: /\.js$/,
                exclude: /node_modules/
            },
            {
            loader: 'babel-loader',

            test: /\.jsx$/,
            exclude: /node_modules/
            }, {
                test: /\.css$/,
              
            include: /node_modules/,
            loaders: ['style-loader', 'css-loader'],

        },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }
     

        ]
    },

    //plugins: [
    //    new CopyPlugin([
    //        { from: './node_modules/pspdfkit/dist', to: './' }
    //    ])
    //],

    devtool: 'cheap-module-eval-source-map',
    performance: { hints: false }
};

