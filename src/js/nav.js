// Makes a button toggle its aria-expanded state (CSS shows/hides the menu
// from that), closing on Escape or a click outside its area.
function initToggle(toggle, area) {
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = (open) => toggle.setAttribute("aria-expanded", open);

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  document.addEventListener("click", (e) => {
    if (!area.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// The Practice dropdown also opens on hover on desktop, handled in CSS.
// The dropdown is set up first so that, when Escape closes both, focus ends
// on the mobile menu button.
export function initNav() {
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
  const menuToggle = document.querySelector(".nav-menu-toggle");

  if (dropdownToggle) initToggle(dropdownToggle, dropdownToggle.parentElement);
  if (menuToggle) initToggle(menuToggle, menuToggle.parentElement);
}
