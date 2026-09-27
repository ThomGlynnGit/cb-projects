// Helpers for reading the built site in .test-build/.
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";

export const projectDir = path.resolve(import.meta.dirname, "../..");
export const buildDir = path.join(projectDir, ".test-build");

export const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(projectDir, file), "utf8"));

export const settings = readJson("content/settings.json");

// Every generated page except the CMS admin, as paths relative to the build
export function builtPages() {
  return fs
    .readdirSync(buildDir, { recursive: true })
    .map((file) => file.split(path.sep).join("/"))
    .filter((file) => file.endsWith(".html") && !file.startsWith("admin/"))
    .sort();
}

// Parses a built page. Scripts are not run; this checks the HTML itself.
export function loadPage(page) {
  const html = fs.readFileSync(path.join(buildDir, page), "utf8");
  return new JSDOM(html, { url: `https://site.test/${page}` }).window.document;
}

// Resolves a link/src on a page to a file in the build, or null for
// external URLs (http to other hosts, mailto:, tel:).
export function resolveToBuild(document, url) {
  const resolved = new URL(url, document.URL);
  if (resolved.host !== "site.test") return null;
  return path.join(buildDir, decodeURIComponent(resolved.pathname));
}

export const exists = (file) => fs.existsSync(file);

// Text with whitespace collapsed, as a reader would see it
export const text = (el) => el?.textContent.replace(/\s+/g, " ").trim();
