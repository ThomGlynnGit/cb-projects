// Unit tests for the build-time templating and content loading.
import fs from "node:fs";
import path from "node:path";
import { loadSettings, loadSketches, loadWorks } from "../tools/content.js";
import { escapeHtml, renderPage } from "../tools/templating.js";
import { projectDir } from "./helpers/site.js";

// Stands in for the webpack loader context that html-loader passes in
function fakeLoaderContext(page, query = "") {
  return {
    resourcePath: path.join(projectDir, "src/pages", page),
    resourceQuery: query,
    dependencies: [],
    addDependency(file) {
      this.dependencies.push(file);
    },
    addContextDependency() {},
  };
}

describe("escapeHtml", () => {
  test("escapes characters that could break the HTML", () => {
    expect(escapeHtml(`<a href="x">Tom & Jerry's</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;",
    );
  });

  test("turns numbers into text", () => {
    expect(escapeHtml(2025)).toBe("2025");
  });
});

describe("renderPage", () => {
  test("inserts partials and fills in settings", () => {
    const ctx = fakeLoaderContext("index.html");
    const html = renderPage("<!-- include: footer -->", ctx);
    const settings = loadSettings();
    expect(html).toContain(`${settings.name} ${settings.tagline}`);
    expect(html).not.toContain("{{");
    expect(ctx.dependencies).toContain(
      path.join(projectDir, "src/partials/footer.html"),
    );
  });

  test("points {{root}} at the site root from any folder depth", () => {
    expect(renderPage("{{root}}", fakeLoaderContext("index.html"))).toBe("./");
    expect(
      renderPage(
        "{{root}}",
        fakeLoaderContext("works/_template.html", "?slug=sample-project"),
      ),
    ).toBe("../");
  });

  test("fails the build on a misspelt value", () => {
    expect(() =>
      renderPage("{{ settings.adress }}", fakeLoaderContext("index.html")),
    ).toThrow('Unknown template value "settings.adress"');
  });

  test("fails the build on an unknown renderer", () => {
    expect(() =>
      renderPage("<!-- render: nope -->", fakeLoaderContext("index.html")),
    ).toThrow('Unknown renderer "nope"');
  });

  test("fails the build for a project page with no matching content", () => {
    expect(() =>
      renderPage(
        "x",
        fakeLoaderContext("works/_template.html", "?slug=does-not-exist"),
      ),
    ).toThrow('No project in content/works/ with slug "does-not-exist"');
  });

  test("escapes text from the CMS", () => {
    const ctx = fakeLoaderContext(
      "works/_template.html",
      "?slug=sample-project",
    );
    const [work] = loadWorks().filter((w) => w.slug === "sample-project");
    const html = renderPage("{{ work.title }}", ctx);
    expect(html).toBe(escapeHtml(work.title));
  });
});

describe("content", () => {
  test("site settings have every field the site uses", () => {
    const settings = loadSettings();
    for (const key of ["name", "tagline", "address", "email", "phone"]) {
      expect(settings[key]).toEqual(expect.any(String));
      expect(settings[key]).not.toBe("");
    }
    expect(settings.email).toMatch(/^\S+@\S+\.\S+$/);
    expect(settings.phoneHref).toMatch(/^\+?\d+$/);
  });

  test("projects are sorted newest year first", () => {
    const years = loadWorks().map((w) => Number(w.year));
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  test("every project has the fields the CMS requires", () => {
    for (const work of loadWorks()) {
      expect(work.title).toBeTruthy();
      expect(work.summary).toBeTruthy();
      expect(work.image).toBeTruthy();
      expect(String(work.year)).toMatch(/^\d{4}$/);
    }
  });

  test("sketches are sorted by order, unnumbered last", () => {
    const orders = loadSketches().map((s) => s.order ?? Infinity);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  test("every image in the content exists", () => {
    const images = [
      ...loadWorks().flatMap((w) => [w.image, ...(w.gallery ?? [])]),
      ...loadSketches().map((s) => s.image),
    ];
    for (const src of images) {
      expect(fs.existsSync(path.join(projectDir, "src", src))).toBe(true);
    }
  });
});
