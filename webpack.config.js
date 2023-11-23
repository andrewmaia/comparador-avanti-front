/** @format */

const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    common: "./src/common.js",
    index: "./src/index.js",
    "sugestao/index": "./src/sugestao/index.js",
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/sitemap.xml" },
        { from: "src/favicon.ico" },
        { from: "src/index.html" },
        { from: "src/index.css" },
        { from: "src/common.css" },
        { from: "src/const.js" },
        { from: "src/sugestao/index.html", to: "sugestao/" },
        { from: "src/sugestao/index.css", to: "sugestao/" },
        { from: "src/images/bg-planos.jpg", to: "images/" },
        { from: "src/images/logo-palmeiras.png", to: "images/" },
      ],
    }),
  ],
};
