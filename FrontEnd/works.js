let categories = [];
let works = [];

// Récupération des données categories avec Fetch
const request = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      categories = data;
    })
    .catch(function (error) {
      alert("HTTP Error" + error.status);
    });
};

// Récupération des données works avec Fetch
const requestWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      works = data;
    })
    .catch(function (error) {
      alert("HTTP Error" + error.status);
    });
};

// Ajout des filtres
const categoriesList = async () => {
  await request();

  const filtres = document.querySelector(".navbar");
  categories.unshift({ id: 0, name: "Tous" });

  for (const category of categories) {
    const li = document.createElement("li");
    li.setAttribute("id", category.id);
    li.textContent = category.name;
    filtres.appendChild(li);

    li.addEventListener("click", () => {
      if (li.id === "0") {
        filterWorks(works);
      } else {
        const filteredWorks = works.filter(
          (work) => work.category.id === parseInt(li.id)
        );
        filterWorks(filteredWorks);
      }
    });
  }
};

categoriesList();

// fonction pour les filtres
function filterWorks(works) {
  const element = document.querySelector(".gallery");

  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl;
    myFigcaption.textContent = work.title;
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);
    element.appendChild(myFigure);
  }
}

// Ajout des travaux "Mes Projets"
const worksList = async () => {
  await requestWorks();

  const section = document.querySelector(".gallery");

  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl;
    myFigcaption.textContent = work.title;
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);
    section.appendChild(myFigure);
  }
};
worksList();
