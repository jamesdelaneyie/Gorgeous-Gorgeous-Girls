const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development",
  devtool: false,
  devServer: {
    // disables the Hot Module Replacement feature because probably not ideal
    // in the context of generative art
    // https://webpack.js.org/concepts/hot-module-replacement/
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