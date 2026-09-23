// webpack.config.js
import fs from "node:fs";
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const pagesDir = path.resolve(import.meta.dirname, "src/pages");
const partialsDir = path.resolve(import.meta.dirname, "src/partials");

const pages = [
  "index",
  "about",
  "approach",
  "services",
  "works",
  "sketchbook",
  "contact",
];

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
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: `./src/pages/${page}.html`,
        }),
    ),
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
