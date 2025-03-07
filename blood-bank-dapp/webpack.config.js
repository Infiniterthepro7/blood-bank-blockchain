const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust this to your entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Files ending in .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-optional-chaining'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'development', // Use 'production' for production builds
};
