// "/" and "/index.html" are the same page, but the browser treats them as
// different addresses and reloads when a link switches between them.
const pagePath = (url) => url.pathname.replace(/index\.html$/, "");

// Makes links to a section of the current page (e.g. About's
// "index.html#about" while on "/") scroll there instead of reloading.
function initSectionLinks() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href*='#']");
    // Leave new-tab clicks (ctrl/cmd/shift/middle) to the browser
    if (!link || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    const url = new URL(link.href);
    const section = document.getElementById(url.hash.slice(1));
    if (pagePath(url) !== pagePath(location) || !section) return;

    e.preventDefault();
    // Uses the CSS scroll-behavior and scroll-padding-top
    section.scrollIntoView();
  });
}

// Pages always open at the top: the browser doesn't restore an old scroll
// position, and after jumping to a section from another page (e.g.
// index.html#about) the #about is removed so reloading starts at the top.
function initScrollReset() {
  history.scrollRestoration = "manual";

  // Wait until the browser has jumped to the section before removing it
  addEventListener("load", () => {
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });
}

// Opens and closes the mobile menu. CSS shows/hides the menu from the
// button's aria-expanded state.
function initMenu() {
  const toggle = document.querySelector(".nav-menu-toggle");

  if (!toggle) return;

  const menu = document.getElementById(toggle.getAttribute("aria-controls"));
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = (open) => toggle.setAttribute("aria-expanded", open);

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  // Close after choosing a link, as About/Approach may only scroll the page
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!toggle.parentElement.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

export function initNav() {
  initScrollReset();
  initSectionLinks();
  initMenu();
}
