// webpack.config.js
import path from "node:path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { loadWorks } from "./tools/content.js";
import { renderPage } from "./tools/templating.js";

const pages = ["index", "services", "works", "sketchbook", "contact"];

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
    watchFiles: ["./src/**/*.html"],
  },
  plugins: [
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: `./src/pages/${page}.html`,
        }),
    ),
    // One page per project in content/works/, all from the same template
    ...loadWorks().map(
      ({ slug }) =>
        new HtmlWebpackPlugin({
          filename: `works/${slug}.html`,
          template: `./src/pages/works/_template.html?slug=${slug}`,
        }),
    ),
    // The CMS admin is copied as-is, without the site's CSS/JS
    new CopyWebpackPlugin({
      patterns: [{ from: "src/admin", to: "admin" }],
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
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.woff2$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          preprocessor: renderPage,
        },
      },
    ],
  },
};
