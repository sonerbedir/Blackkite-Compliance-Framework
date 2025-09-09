const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const loader = require('sass-loader');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  devtool: 'source-map',
  devServer: { 
    port: 4000, 
    open: true, 
    hot: true,
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/'
      },
      {
        directory: path.join(__dirname, 'src'),
        publicPath: '/src'
      }
    ]
  },
  module: {
    rules: [
      { 
        test: /\.(scss|css)$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        quietDeps: true
                    }
                }
            }

          ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: './src/index.html',
      favicon: './public/favicon.svg'
    })
  ]
};
