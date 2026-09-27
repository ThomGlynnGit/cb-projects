// Runs a production build into .test-build/ so the page tests check exactly
// what would be deployed.
import webpack from "webpack";
import prodConfig from "../../webpack.prod.js";
import { buildDir } from "../helpers/site.js";

export default async function buildSite() {
  const config = {
    ...prodConfig,
    output: { ...prodConfig.output, path: buildDir },
  };

  const stats = await new Promise((resolve, reject) => {
    webpack(config, (err, result) => (err ? reject(err) : resolve(result)));
  });

  if (stats.hasErrors()) {
    throw new Error(`Site build failed:\n${stats.toString("errors-only")}`);
  }
}
