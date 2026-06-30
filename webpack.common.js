// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/index.html"],
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
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
