// Loads the CMS-editable content in content/. When given a loaderContext, the
// files are registered with webpack so the dev server rebuilds on changes.
import fs from "node:fs";
import path from "node:path";

const contentDir = path.resolve(import.meta.dirname, "../content");

function readJson(file, loaderContext) {
  loaderContext?.addDependency(file);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function loadSettings(loaderContext) {
  const settings = readJson(
    path.join(contentDir, "settings.json"),
    loaderContext,
  );
  return { ...settings, phoneHref: settings.phone.replace(/[^\d+]/g, "") };
}

// Each file in content/works/ is one project; its filename is the page slug.
// Newest first, then alphabetical.
export function loadWorks(loaderContext) {
  const dir = path.join(contentDir, "works");
  if (!fs.existsSync(dir)) return [];

  loaderContext?.addContextDependency(dir);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      slug: path.basename(file, ".json"),
      ...readJson(path.join(dir, file), loaderContext),
    }))
    .sort(
      (a, b) =>
        String(b.year).localeCompare(String(a.year)) ||
        a.title.localeCompare(b.title),
    );
}
