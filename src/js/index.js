import "../css/index.css";
import "../css/about.css";
import "../css/projects.css";
import { RenderProjects } from "./projects.js";
import { initForm } from "@formspree/ajax";

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  initForm({
    formElement: contactForm,
    formId: "mzdnabvj",
  });
}

RenderProjects();
