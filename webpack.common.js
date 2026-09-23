// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  entry: {
    app: "./src/js/index.js",
  },
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/pages/*.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "production",
      template: "./src/pages/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./src/pages/about.html",
    }),
    new HtmlWebpackPlugin({
      filename: "projects.html",
      template: "./src/pages/projects.html",
    }),
    new HtmlWebpackPlugin({
      filename: "contact.html",
      template: "./src/pages/contact.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
};
