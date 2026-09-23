// webpack.config.js
import fs from "node:fs";
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const pagesDir = path.resolve(import.meta.dirname, "src/pages");
const partialsDir = path.resolve(import.meta.dirname, "src/partials");

// Replaces <!-- include: name --> with src/partials/name.html, and {{root}}
// with the relative path from the page back to the site root.
function includePartials(content, loaderContext) {
  const depth = path
    .relative(pagesDir, path.dirname(loaderContext.resourcePath))
    .split(path.sep)
    .filter(Boolean).length;
  const root = depth ? "../".repeat(depth) : "./";

  return content
    .replace(/<!--\s*include:\s*([\w-]+)\s*-->/g, (_, name) => {
      const file = path.join(partialsDir, `${name}.html`);
      loaderContext.addDependency(file);
      return fs.readFileSync(file, "utf8");
    })
    .replaceAll("{{root}}", root);
}

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
    new HtmlWebpackPlugin({
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
        options: {
          preprocessor: includePartials,
        },
      },
    ],
  },
};
