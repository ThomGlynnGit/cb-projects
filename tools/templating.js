// Build-time templating for HTML pages, run as html-loader's preprocessor.
//
//   <!-- include: name -->  inserts src/partials/name.html
//   {{ key.path }}          inserts an HTML-escaped value from the page data:
//                             root     - relative path from the page to the
//                                        site root ("./" or "../")
//                             settings - content/settings.json
import fs from "node:fs";
import path from "node:path";

const projectDir = path.resolve(import.meta.dirname, "..");
const pagesDir = path.join(projectDir, "src/pages");
const partialsDir = path.join(projectDir, "src/partials");
const contentDir = path.join(projectDir, "content");

// Reads a file and tells webpack to rebuild when it changes.
function readDependency(file, loaderContext) {
  loaderContext.addDependency(file);
  return fs.readFileSync(file, "utf8");
}

function loadSettings(loaderContext) {
  const settings = JSON.parse(
    readDependency(path.join(contentDir, "settings.json"), loaderContext),
  );
  return { ...settings, phoneHref: settings.phone.replace(/[^\d+]/g, "") };
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderPage(content, loaderContext) {
  const depth = path
    .relative(pagesDir, path.dirname(loaderContext.resourcePath))
    .split(path.sep)
    .filter(Boolean).length;

  const data = {
    root: depth ? "../".repeat(depth) : "./",
    settings: loadSettings(loaderContext),
  };

  return content
    .replace(/<!--\s*include:\s*([\w-]+)\s*-->/g, (_, name) =>
      readDependency(path.join(partialsDir, `${name}.html`), loaderContext),
    )
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const value = key.split(".").reduce((obj, part) => obj?.[part], data);
      if (value === undefined) {
        throw new Error(
          `Unknown template value "${key}" in ${loaderContext.resourcePath}`,
        );
      }
      return escapeHtml(value);
    });
}
