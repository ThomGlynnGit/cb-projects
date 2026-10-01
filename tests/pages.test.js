// Page-by-page checks of each page's own content and elements.
import fs from "node:fs";
import path from "node:path";
import {
  buildDir,
  exists,
  loadPage,
  projectDir,
  readJson,
  resolveToBuild,
  settings,
  text,
} from "./helpers/site.js";

const texts = (els) => [...els].map(text);

describe("The Practice (index.html)", () => {
  let doc;
  beforeAll(() => {
    doc = loadPage("index.html");
  });

  test("has the title and a hidden page heading", () => {
    expect(doc.title).toBe(`${settings.name} | ${settings.tagline}`);
    const h1 = doc.querySelector("h1");
    expect(text(h1)).toBe(settings.name);
    expect(h1.classList).toContain("visually-hidden");
  });

  test("opens with 'Who are we' and the two intro paragraphs", () => {
    const top = doc.querySelector(".practice-top");
    expect(text(top.querySelector(".practice-heading"))).toBe("Who are we");
    const paras = texts(top.querySelectorAll(".practice-intro p"));
    expect(paras).toHaveLength(2);
    expect(paras[0]).toBe(
      "CBP is a chartered structural engineering design practice working across Brighton, London and the South East.",
    );
    expect(paras[1]).toBe(
      "We work across a broad range of sectors and project scales, from small alterations to complex new-build and refurbishment projects, with a particular interest in working with existing and historic buildings.",
    );
  });

  test("shows the wide image after the intro", () => {
    const banner = doc.querySelector(".practice-top + .practice-banner img");
    expect(banner).not.toBeNull();
    expect(banner.alt).not.toBe("");
  });

  test("has the About section with testimonial 1 and a link to Contact", () => {
    const about = doc.getElementById("about");
    expect(about.querySelector(".practice-heading")).toBeNull();
    expect(text(about.querySelector("blockquote"))).toBe("“Testimonial 1”");
    const link = about.querySelector("a.text-link");
    expect(text(link)).toBe("Get in touch");
    expect(link.getAttribute("href")).toBe("./contact.html");
    expect(text(link.parentElement)).toBe(
      "Get in touch to get your project off the ground.",
    );
  });

  test("shows a row of four images between About and Approach", () => {
    const gallery = doc.querySelector("#about + .practice-gallery");
    expect(gallery.querySelectorAll("img")).toHaveLength(4);
  });

  test("has the Approach section with six 'We are' paragraphs", () => {
    const approach = doc.getElementById("approach");
    expect(text(approach.querySelector(".practice-heading"))).toBe("Approach");
    const paras = approach.querySelectorAll(".practice-text p");
    expect(paras).toHaveLength(6);
    expect(texts(approach.querySelectorAll("strong"))).toEqual([
      "passionate",
      "practical",
      "problem solvers",
      "personable",
      "collaborative",
      "responsive",
    ]);
    for (const p of paras) {
      expect(p.firstElementChild.tagName).toBe("STRONG");
      expect(text(p)).toMatch(/^We are /);
    }
    expect(text(approach.querySelector("blockquote"))).toBe("“Testimonial 2”");
  });

  test("keeps the sections in the agreed order", () => {
    const order = [
      ...doc.querySelectorAll(
        ".content-container > :not(h1):not(.footer-container)",
      ),
    ].map((el) => el.id || el.className);
    expect(order).toEqual([
      "practice-row practice-top",
      "practice-banner",
      "about",
      "practice-gallery",
      "approach",
    ]);
  });
});

describe("Services (services.html)", () => {
  let doc;
  beforeAll(() => {
    doc = loadPage("services.html");
  });

  test("has the title, heading and intro", () => {
    expect(doc.title).toBe(`Services | ${settings.name}`);
    expect(text(doc.querySelector("h1"))).toBe("Services");
    expect(text(doc.querySelector(".services-head-container p"))).toBe(
      "We have experience across all construction sectors and project sizes from multi-storey towers to chimney breast removals - we treat each project with the time and care it deserves.",
    );
  });

  test("lists the nine key services", () => {
    const [keyServices] = doc.querySelectorAll(".service");
    expect(text(keyServices.querySelector("p"))).toBe(
      "Below summarises some of our key services:",
    );
    expect(texts(keyServices.querySelectorAll("li"))).toEqual([
      "Structural surveys, inspections and reports.",
      "Providing guidance on home buyers surveys.",
      "Structural engineering design and drawings.",
      "Residential refurbishments including loft conversions, extensions, wall removals, chimney removals.",
      "Listed/heritage buildings.",
      "Structural repairs to new and historic buildings.",
      "Temporary works.",
      "Feasibility studies.",
      "Building Safety Case reports.",
    ]);
  });

  test("lists the two services with the civil engineering practice", () => {
    const civil = doc.querySelectorAll(".service")[1];
    expect(text(civil.querySelector("p"))).toBe(
      "We work closely with a civil engineering practice to carry out:",
    );
    expect(texts(civil.querySelectorAll("li"))).toEqual([
      "Below ground drainage designs",
      "Flood Risk Assessments",
    ]);
  });
});

describe.each([
  ["Selected Works", "works.html", ".projects-grid"],
  ["Sketchbook", "sketchbook.html", ".sketchbook-grid"],
])("%s (%s)", (title, page, grid) => {
  let doc;
  beforeAll(() => {
    doc = loadPage(page);
  });

  test("has the title and heading", () => {
    expect(doc.title).toBe(`${title} | ${settings.name}`);
    expect(text(doc.querySelector("h1"))).toBe(title);
  });

  test("shows 'Page under construction' instead of the grid", () => {
    expect(text(doc.querySelector("h1 + p"))).toBe("Page under construction");
    expect(doc.querySelector(grid)).toBeNull();
  });
});

describe("Contact (contact.html)", () => {
  let doc;
  beforeAll(() => {
    doc = loadPage("contact.html");
  });

  test("has the title and heading", () => {
    expect(doc.title).toBe(`Contact | ${settings.name}`);
    expect(text(doc.querySelector("h1"))).toBe("Contact us");
  });

  test("lists the office, phone and email from site settings", () => {
    const rows = [...doc.querySelectorAll(".contact-details > div")];
    expect(rows.map((r) => text(r.querySelector("dt")))).toEqual([
      "Office",
      "Phone",
      "Email",
    ]);
    const [office, phone, email] = rows.map((r) => r.querySelector("dd"));
    expect(text(office)).toBe(settings.address);
    expect(text(phone)).toBe(settings.phone);
    expect(phone.querySelector("a").href).toBe(
      `tel:${settings.phone.replace(/\s/g, "")}`,
    );
    expect(text(email)).toBe(settings.email);
    expect(email.querySelector("a").href).toBe(`mailto:${settings.email}`);
  });

  describe("enquiry form", () => {
    let form;
    beforeAll(() => {
      form = doc.getElementById("contact-form");
    });

    test.each([
      ["name", "input", "text", true],
      ["email", "input", "email", true],
      ["phone", "input", "tel", false],
      ["subject", "input", "text", true],
      ["message", "textarea", undefined, true],
    ])("has a labelled %s field", (name, tag, type, required) => {
      const field = form.querySelector(`[name="${name}"]`);
      expect(field.tagName.toLowerCase()).toBe(tag);
      if (type) expect(field.type).toBe(type);
      expect(field.required).toBe(required);
      const label = form.querySelector(`label[for="${field.id}"]`);
      expect(text(label)).not.toBe("");
      expect(form.querySelector(`[data-fs-error="${name}"]`)).not.toBeNull();
    });

    test("has a submit button", () => {
      const button = form.querySelector('button[type="submit"]');
      expect(text(button)).toBe("Send enquiry");
    });

    test("has places for the success and error messages", () => {
      expect(doc.querySelector("[data-fs-success]")).not.toBeNull();
      expect(doc.querySelector("div[data-fs-error]")).not.toBeNull();
    });

    test("is connected to Formspree with the ID from site settings", () => {
      const inline = texts(doc.querySelectorAll("script:not([src])")).join();
      // The build minifies inline scripts, so allow for missing spaces
      expect(inline).toMatch(/formElement:\s*"#contact-form"/);
      expect(inline).toMatch(
        new RegExp(`formId:\\s*"${settings.formspreeId}"`),
      );
      expect(
        doc.querySelector('script[src^="https://unpkg.com/@formspree/ajax"]'),
      ).not.toBeNull();
    });
  });
});

const works = fs
  .readdirSync(path.join(projectDir, "content/works"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => [path.basename(f, ".json"), readJson(`content/works/${f}`)]);

describe.each(works)("Project page works/%s.html", (slug, work) => {
  let doc;
  beforeAll(() => {
    doc = loadPage(`works/${slug}.html`);
  });

  test("has the project title, heading and summary", () => {
    expect(doc.title).toBe(`${work.title} | ${settings.name}`);
    expect(text(doc.querySelector("h1"))).toBe(work.title);
    expect(text(doc.querySelector(".project-header p"))).toBe(work.summary);
  });

  test("shows the main image", () => {
    const hero = doc.querySelector(".project-hero-img");
    expect(hero.alt).toBe(work.title);
    expect(exists(resolveToBuild(doc, hero.src))).toBe(true);
  });

  test("lists only the key facts that are filled in", () => {
    const facts = ["location", "year", "client", "architect", "sector"].filter(
      (key) => work[key],
    );
    const dds = texts(doc.querySelectorAll(".project-facts dd"));
    expect(dds).toEqual(facts.map((key) => String(work[key])));
  });

  test("splits the overview and details into paragraphs", () => {
    const count = (t = "") => t.split(/\n\s*\n/).filter((p) => p.trim()).length;
    expect(doc.querySelectorAll(".project-overview p")).toHaveLength(
      count(work.overview),
    );
    expect(doc.querySelectorAll(".project-details p")).toHaveLength(
      count(work.details),
    );
  });

  test("shows every gallery image", () => {
    expect(doc.querySelectorAll(".project-gallery img")).toHaveLength(
      (work.gallery ?? []).length,
    );
  });

  test("links back to Selected Works", () => {
    const back = doc.querySelector(".back-button");
    expect(back.pathname.endsWith("/works.html")).toBe(true);
  });
});

describe("CMS admin (admin/)", () => {
  test("loads a pinned Sveltia CMS with an integrity hash", () => {
    const html = fs.readFileSync(
      path.join(buildDir, "admin/index.html"),
      "utf8",
    );
    expect(html).toMatch(
      /<script\s+src="https:\/\/unpkg\.com\/@sveltia\/cms@\d+\.\d+\.\d+\/dist\/sveltia-cms\.js"\s+integrity="sha384-[A-Za-z0-9+/=]+"\s+crossorigin="anonymous"/,
    );
    expect(html).toContain('<meta name="robots" content="noindex" />');
  });

  test("ships a config pointing at the content folders", () => {
    const config = fs.readFileSync(
      path.join(buildDir, "admin/config.yml"),
      "utf8",
    );
    for (const folder of [
      "folder: content/works",
      "folder: content/sketchbook",
      "file: content/settings.json",
      "media_folder: src/images/uploads",
    ]) {
      expect(config).toContain(folder);
    }
  });
});
