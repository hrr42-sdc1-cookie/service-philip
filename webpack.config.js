
const path = require('path');
//    entry: './src/index.js'
// entry: path.resolve(__dirname, 'src') + '/index.js'
module.exports = {
  entry: './client/index.jsx',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
  },
  // optimization: {
  //   splitChunks: {
  //   chunks: 'all',
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.m?jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
