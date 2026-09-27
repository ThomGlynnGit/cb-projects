// Checks that apply to every generated page: head, header, nav, footer,
// images, links and leftover template markers.
import {
  builtPages,
  exists,
  loadPage,
  resolveToBuild,
  settings,
  text,
} from "./helpers/site.js";

const pages = builtPages();

const expectedNav = [
  ["The Practice", "index.html"],
  ["Services", "services.html"],
  ["Selected Works", "works.html"],
  ["Sketchbook", "sketchbook.html"],
  ["Contact", "contact.html"],
];

test("builds every page", () => {
  expect(pages).toEqual(
    expect.arrayContaining([
      "contact.html",
      "index.html",
      "services.html",
      "sketchbook.html",
      "works.html",
    ]),
  );
});

describe.each(pages)("%s", (page) => {
  let doc;
  beforeAll(() => {
    doc = loadPage(page);
  });

  const resolves = (url) => {
    const file = resolveToBuild(doc, url);
    return file === null || exists(file);
  };

  describe("head", () => {
    test("declares English, UTF-8 and a mobile viewport", () => {
      expect(doc.documentElement.lang).toBe("en");
      expect(doc.characterSet).toBe("UTF-8");
      expect(doc.querySelector('meta[name="viewport"]')?.content).toContain(
        "width=device-width",
      );
    });

    test("has a title naming the practice", () => {
      expect(doc.title).toMatch(new RegExp(`\\b${settings.name}\\b`));
      expect(doc.title).not.toMatch(/CB[- ]Projects/);
    });

    test("links the stylesheet, script and icons to built files", () => {
      const assets = [
        ...[...doc.querySelectorAll("link[href]")].map((l) => l.href),
        ...[...doc.querySelectorAll("script[src]")].map((s) => s.src),
      ].filter((url) => !url.startsWith("https://unpkg.com"));

      expect(doc.querySelector('link[rel="stylesheet"]')).not.toBeNull();
      expect(doc.querySelector('link[rel="icon"]')).not.toBeNull();
      expect(doc.querySelector('link[rel="apple-touch-icon"]')).not.toBeNull();
      expect(doc.querySelector("script[src]")).not.toBeNull();
      for (const url of assets) expect(resolves(url)).toBe(true);
    });
  });

  describe("header", () => {
    test("has the logo linking to the Practice page", () => {
      const logo = doc.querySelector(".head-container a.logo");
      expect(logo.pathname.endsWith("/index.html")).toBe(true);
      const img = logo.querySelector("img");
      expect(img.alt).toBe(`${settings.name} structural engineers`);
      expect(resolves(img.src)).toBe(true);
    });

    test("has the nav links in order, each to a built page", () => {
      const links = [...doc.querySelectorAll("#nav-menu a")];
      expect(links.map((a) => text(a))).toEqual(expectedNav.map(([t]) => t));
      links.forEach((a, i) => {
        expect(a.pathname.endsWith(`/${expectedNav[i][1]}`)).toBe(true);
        expect(resolves(a.href)).toBe(true);
      });
    });

    test("has an accessible mobile menu button for the nav", () => {
      const toggle = doc.querySelector(".nav-menu-toggle");
      expect(toggle.type).toBe("button");
      expect(toggle.getAttribute("aria-label")).toBe("Menu");
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(doc.getElementById(toggle.getAttribute("aria-controls"))).toBe(
        doc.getElementById("nav-menu"),
      );
    });
  });

  describe("footer", () => {
    let footer;
    beforeAll(() => {
      footer = doc.querySelector(".footer-container .address-bar");
    });

    test("is the last thing in the page content", () => {
      expect(doc.querySelector(".content-container").lastElementChild).toBe(
        footer.parentElement,
      );
    });

    test("names the practice and gives its address", () => {
      expect(text(footer.querySelector("h3"))).toBe(
        `${settings.name} ${settings.tagline}`,
      );
      expect(text(footer)).toContain(settings.address);
    });

    test("links the email and phone number", () => {
      const mail = footer.querySelector('a[href^="mailto:"]');
      const tel = footer.querySelector('a[href^="tel:"]');
      expect(mail.href).toBe(`mailto:${settings.email}`);
      expect(text(mail)).toBe(settings.email);
      expect(tel.href).toBe(`tel:${settings.phone.replace(/\s/g, "")}`);
      expect(text(tel)).toBe(settings.phone);
    });
  });

  describe("content", () => {
    test("has exactly one main heading (h1)", () => {
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
      expect(text(doc.querySelector("h1"))).not.toBe("");
    });

    test("gives every image alt text and a file that exists", () => {
      for (const img of doc.querySelectorAll("img")) {
        expect(img.hasAttribute("alt")).toBe(true);
        expect(resolves(img.src)).toBe(true);
      }
    });

    test("links only to pages, files and sections that exist", () => {
      for (const a of doc.querySelectorAll("a[href]")) {
        const url = new URL(a.href);
        if (url.host === "site.test") {
          expect(resolves(a.href)).toBe(true);
          if (url.hash) {
            const target = loadPage(url.pathname.slice(1));
            expect(target.getElementById(url.hash.slice(1))).not.toBeNull();
          }
        }
      }
    });

    test("has no duplicate ids", () => {
      const ids = [...doc.querySelectorAll("[id]")].map((el) => el.id);
      expect(ids.length).toBe(new Set(ids).size);
    });

    test("has no unfilled template markers", () => {
      const html = doc.documentElement.outerHTML;
      expect(html).not.toMatch(/\{\{|\}\}|include:|render:/);
    });
  });
});
