const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const assetFilterExclusions = [
  /three\..*js/
];

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            {
              "plugins": [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-private-property-in-object",
                "@babel/plugin-proposal-private-methods"
              ]
            }
          ]
        }
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          minSize: 0,
          maxInitialRequests: Infinity,
          test: /node_modules/,
          name: (module) => {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return 'vendor/' + packageName;
          }
        }
      }
    }
  },
  performance: {
    assetFilter: function (assetFilename) {
      for (let regExp of assetFilterExclusions) {
        if (regExp.test(assetFilename)) {
          return false;
        }
      }

      return !(/\.map$/.test(assetFilename));
    }
  },
  mode: 'production'
};