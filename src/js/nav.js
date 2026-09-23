// Opens the Practice dropdown on click/tap, and closes it on Escape or a
// click elsewhere. Hover opening on desktop is handled in CSS.
export function initNav() {
  const toggle = document.querySelector(".nav-dropdown-toggle");

  if (!toggle) return;

  const setOpen = (open) => toggle.setAttribute("aria-expanded", open);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("click", (e) => {
    if (!toggle.parentElement.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
}
