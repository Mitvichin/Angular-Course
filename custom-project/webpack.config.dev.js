var path = require("path");

var webpackMerge = require("webpack-merge");
var commonConfig = require("./webpack.config.common");

module.exports = webpackMerge(commonConfig, {
  devtool: "cheap-eval-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    public: "/",
    filename: "bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  mode: 'development',
  module: {
    rule: [
      {
        test: /\.ts$/,
        use: [
          {
            test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
            loader: '@ngtools/webpack'
          },
          {
            loader: "awesome-typescript-loader",
            options: {
              transpileOnly: true
            }
          },
          {
            loader: "angular2-template-loader"
          },
          {
            loader: "angular-router-loader"
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    stats: "minimal"
  }
});
