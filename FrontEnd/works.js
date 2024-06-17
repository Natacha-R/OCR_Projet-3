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

// Création des filtres (navbar)
const categoriesList = async () => {
  await request();

  const filtres = document.querySelector(".navbar"); //récupération barre de filtres (html)
  categories.unshift({ id: 0, name: "Tous" }); //création filtre "Tous"

  for (const category of categories) {
    const li = document.createElement("li"); //création li
    li.setAttribute("id", category.id); //li = id de category (works)
    li.textContent = category.name; //texte du li = name de category (works)
    filtres.appendChild(li); //li enfant de filtres

    // écoute au click des filtres
    li.addEventListener("click", () => {
      if (li.id === "0") {
        filterWorks(works); //si id de li = 0 ("tous") alors mettre tous les travaux
      } else {
        const filteredWorks = works.filter(
          (work) => work.category.id === parseInt(li.id) // (convertir une chaine de caractères en un nombre entier)
        ); //sinon filtrer les travaux par category avec id
        filterWorks(filteredWorks);
      }
    });
  }
};
categoriesList();

// Ajout des travaux "Mes Projets" (gallery)
const worksList = async () => {
  await requestWorks();

  const section = document.querySelector(".gallery");

  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl;
    myFigcaption.textContent = work.title;
    section.appendChild(myFigure);
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);
  }
};
worksList();

// fonction pour filtrer par travaux
function filterWorks(works) {
  const element = document.querySelector(".gallery");

  while (element.firstChild) {
    element.removeChild(element.firstChild); //supprime tous les enfants de .gallery
  }

  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl;
    myFigcaption.textContent = work.title;
    element.appendChild(myFigure);
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);
  }
}
