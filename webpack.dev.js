const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appPath = process.cwd()

const config = (env) => ({
  mode: env,
  target: 'web',
  entry: {
    main: path.join(appPath, 'src/index.js')
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.join(appPath, 'dist/public')
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {hmr: true},
          },
          'css-loader'
        ]
      }, {
        test: /\.(png|jpg|gif)$/i,
        use: [{ 
          loader: 'file-loader', 
          options: {
            name: '[contenthash].[ext]',
          }
        }]
      }
    ]
  },
  resolve: {
    modules: [path.join(appPath, 'src'), 'node_modules'],
    extensions: ['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({}),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(appPath, 'src/index.html'),
    }),
    new MiniCssExtractPlugin({filename: '[name].css'}),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    }
  },  
  devServer: {
    contentBase: path.join(appPath, 'public'),
    compress: true,
    hot: true,
    port: 3000,
    index: 'index.html',
    historyApiFallback: true 
  }
})

module.exports = config;