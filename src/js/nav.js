// Opens and closes the mobile menu. CSS shows/hides the menu from the
// button's aria-expanded state.
export function initNav() {
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
