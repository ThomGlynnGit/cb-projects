import london from "../images/projects/london.jpg";
import birmingham from "../images/projects/birmingham.jpg";
import brighton from "../images/projects/brighton.jpg";
import manchester from "../images/projects/manchester.jpg";
import newcastle from "../images/projects/newcastle.jpg";

const projects = [
  {
    title: "London",
    image: london,
    description: "A project based in the city of London",
    page: "./projects/london.html",
  },
  {
    title: "Birmingham",
    image: birmingham,
    description: "A project based in the city of Birmingham",
    page: "./projects/birmingham.html",
  },
  {
    title: "Brighton",
    image: brighton,
    description: "A project based in the city of Brighton",
    page: "./projects/brighton.html",
  },
  {
    title: "Manchester",
    image: manchester,
    description: "A project based in the city of Manchester",
    page: "./projects/manchester.html",
  },
  {
    title: "Newcastle",
    image: newcastle,
    description: "A project based in the city of Newcastle",
    page: "./projects/newcastle.html",
  },
];

export function RenderProjects() {
  const grid = document.querySelector(".projects-grid");

  projects.forEach((project) => {
    const card = document.createElement("a");

    card.classList.add("project-card");
    card.href = project.page;

    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
  
        <div class="project-text">
        <h3 class="head-small">${project.title}</h3>
        <p class="list-small">${project.description}</p>
        </div>
        
    `;

    grid.appendChild(card);
  });
}
