let works = [];

// Récupération des données avec Fetch
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
