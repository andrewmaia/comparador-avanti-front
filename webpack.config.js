/** @format */

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/favicon.ico" },
        { from: "src/index.html" },
        { from: "src/style.css" },
        { from: "src/images/bg-planos.jpg", to: "images/" },
        { from: "src/images/logo-palmeiras.png", to: "images/" },
      ],
    }),
  ],
};
