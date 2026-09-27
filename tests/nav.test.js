/**
 * @jest-environment jsdom
 */
// Tests the navigation script (mobile menu and scroll behaviour) in a
// simulated browser.
import fs from "node:fs";
import path from "node:path";

// Not imported from helpers/site.js, which loads its own jsdom
const projectDir = path.resolve(import.meta.dirname, "..");

const header = fs
  .readFileSync(path.join(projectDir, "src/partials/header.html"), "utf8")
  .replaceAll("{{root}}", "./");

let initNav;
let toggle;

beforeAll(async () => {
  document.body.innerHTML = `${header}<main><p id="outside">Text</p></main>`;
  ({ initNav } = await import("../src/js/nav.js"));
  initNav();
  toggle = document.querySelector(".nav-menu-toggle");
});

const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
const click = (el) =>
  el.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );

describe("mobile menu", () => {
  afterEach(() => toggle.setAttribute("aria-expanded", "false"));

  test("starts closed", () => {
    expect(isOpen()).toBe(false);
  });

  test("opens and closes with the menu button", () => {
    click(toggle);
    expect(isOpen()).toBe(true);
    click(toggle);
    expect(isOpen()).toBe(false);
  });

  test("closes when a link in the menu is chosen", () => {
    click(toggle);
    const link = document.querySelector("#nav-menu a");
    link.addEventListener("click", (e) => e.preventDefault(), { once: true });
    click(link);
    expect(isOpen()).toBe(false);
  });

  test("closes on a click outside the header", () => {
    click(toggle);
    click(document.getElementById("outside"));
    expect(isOpen()).toBe(false);
  });

  test("closes on Escape and returns focus to the menu button", () => {
    click(toggle);
    document.querySelector("#nav-menu a").focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(isOpen()).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });
});

describe("scroll position", () => {
  test("pages don't restore an old scroll position", () => {
    expect(history.scrollRestoration).toBe("manual");
  });

  test("a #section in the address is removed once the page has loaded", () => {
    history.replaceState(null, "", "/index.html#about");
    window.dispatchEvent(new Event("load"));
    expect(location.hash).toBe("");
    expect(location.pathname).toBe("/index.html");
  });
});
