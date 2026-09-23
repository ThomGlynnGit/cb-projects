// Build-time templating for HTML pages, run as html-loader's preprocessor.
//
//   <!-- include: name -->  inserts src/partials/name.html
//   {{ key.path }}          inserts an HTML-escaped value from the page data:
//                             root     - relative path from the page to the
//                                        site root ("./" or "../")
//                             settings - content/settings.json
//                             work     - the project, on works/_template.html
//   <!-- render: name -->   inserts HTML built by one of the renderers below
import path from "node:path";
import fs from "node:fs";
import { loadSettings, loadWorks } from "./content.js";

const srcDir = path.resolve(import.meta.dirname, "../src");
const pagesDir = path.join(srcDir, "pages");
const partialsDir = path.join(srcDir, "partials");

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Plain text from the CMS, with blank lines separating paragraphs.
function paragraphs(text = "") {
  return text
    .split(/\n\s*\n/)
    .filter((para) => para.trim())
    .map((para) => `<p class="para-small">${escapeHtml(para.trim())}</p>`)
    .join("\n");
}

const workFacts = [
  ["location", "Location"],
  ["year", "Year"],
  ["client", "Client"],
  ["architect", "Architect"],
  ["sector", "Sector"],
];

const renderers = {
  "works-grid": ({ works, root, image }) =>
    works.length
      ? works
          .map(
            (work) => `
              <a class="project-card" href="${root}works/${work.slug}.html">
                <img src="${image(work.image)}" alt="${escapeHtml(work.title)}" />
                <div class="project-text">
                  <h3 class="head-small">${escapeHtml(work.title)}</h3>
                  <p class="list-small">${escapeHtml(work.summary ?? "")}</p>
                </div>
              </a>`,
          )
          .join("")
      : `<p class="para-small">Projects coming soon.</p>`,

  "work-hero": ({ work, image }) => image(work.image),

  "work-facts": ({ work }) =>
    workFacts
      .filter(([key]) => work[key])
      .map(
        ([key, label]) =>
          `<div><dt>${label}</dt><dd>${escapeHtml(work[key])}</dd></div>`,
      )
      .join(""),

  "work-overview": ({ work }) => paragraphs(work.overview),

  "work-details": ({ work }) => paragraphs(work.details),

  "work-gallery": ({ work, image }) =>
    (work.gallery ?? [])
      .map(
        (src) =>
          `<img src="${image(src)}" alt="${escapeHtml(work.title)}" class="gallery-img" />`,
      )
      .join(""),
};

export function renderPage(content, loaderContext) {
  const pageDir = path.dirname(loaderContext.resourcePath);
  const depth = path
    .relative(pagesDir, pageDir)
    .split(path.sep)
    .filter(Boolean).length;

  const works = loadWorks(loaderContext);
  const slug = new URLSearchParams(loaderContext.resourceQuery).get("slug");

  const data = {
    root: depth ? "../".repeat(depth) : "./",
    settings: loadSettings(loaderContext),
    works,
    work: works.find((work) => work.slug === slug),
    // Image fields hold site paths like "/images/uploads/x.jpg"; make them
    // relative to this template so webpack bundles them.
    image: (src) => {
      const relative = path
        .relative(pageDir, path.join(srcDir, src))
        .split(path.sep)
        .join("/");
      return escapeHtml(relative.startsWith(".") ? relative : `./${relative}`);
    },
  };

  if (slug && !data.work) {
    throw new Error(`No project in content/works/ with slug "${slug}"`);
  }

  return content
    .replace(/<!--\s*include:\s*([\w-]+)\s*-->/g, (_, name) => {
      const file = path.join(partialsDir, `${name}.html`);
      loaderContext.addDependency(file);
      return fs.readFileSync(file, "utf8");
    })
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const value = key.split(".").reduce((obj, part) => obj?.[part], data);
      if (value === undefined) {
        throw new Error(
          `Unknown template value "${key}" in ${loaderContext.resourcePath}`,
        );
      }
      return escapeHtml(value);
    })
    .replace(/<!--\s*render:\s*([\w-]+)\s*-->/g, (_, name) => {
      if (!renderers[name]) {
        throw new Error(
          `Unknown renderer "${name}" in ${loaderContext.resourcePath}`,
        );
      }
      return renderers[name](data);
    });
}
