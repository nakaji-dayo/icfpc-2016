var path = require("path");
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "dist.js"
  },
  module: {
    loaders: [
      {
        test: /\.js.*$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ]
  },
  devtool: 'inline-source-map'
};
