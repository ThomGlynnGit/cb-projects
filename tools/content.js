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

// Reads every JSON file in content/<name>/, adding its filename as `slug`.
function loadCollection(name, loaderContext) {
  const dir = path.join(contentDir, name);
  if (!fs.existsSync(dir)) return [];

  loaderContext?.addContextDependency(dir);

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => ({
      slug: path.basename(file, ".json"),
      ...readJson(path.join(dir, file), loaderContext),
    }));
}

// Each file in content/works/ is one project; its filename is the page slug.
// Newest first, then alphabetical.
export function loadWorks(loaderContext) {
  return loadCollection("works", loaderContext).sort(
    (a, b) =>
      String(b.year).localeCompare(String(a.year)) ||
      a.title.localeCompare(b.title),
  );
}

// Each file in content/sketchbook/ is one sketch. Lowest order first; sketches
// without an order go last.
export function loadSketches(loaderContext) {
  return loadCollection("sketchbook", loaderContext).sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.slug.localeCompare(b.slug),
  );
}
