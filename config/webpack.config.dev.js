const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development",
  devtool: false,
  devServer: {
    hot: false,
    port: 8080,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
}