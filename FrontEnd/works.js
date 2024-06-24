let categories = [];
let works = [];
console.log(sessionStorage.getItem("token")); // verification token lors de la connexion

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
  if (sessionStorage.getItem("token") == null) {
    //Si pas d'utilisateurs connectés alors appliquer le code suivant (affichage barre de filtres)
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
  } else {
    //creation de "modifier"
    const p = document.createElement("p");
    p.textContent = "modifier";
    const i = document.createElement("i");
    i.classList.add("fa-regular", "fa-pen-to-square"); //icone Fontawesome
    const modify = document.getElementById("modify");
    modify.appendChild(i);
    modify.appendChild(p);

    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    modify.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "flex";
    });

    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", (event) => {
      modal.style.display = "none";
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    // changement login en logout
    document.querySelector(".logac").innerText = "logout";

    const logoutButton = document.querySelector(".logac");
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      window.location.href = "login.html";
    });
  }
};

categoriesList();

// Ajout des travaux "Mes Projets" (gallery)
const worksList = async () => {
  await requestWorks();

  const section = document.querySelector(".gallery");
  const grid = document.getElementById("grid");

  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl;
    myFigcaption.textContent = work.title;
    section.appendChild(myFigure);
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);

    const galleryImg = document.createElement("img");
    galleryImg.src = work.imageUrl;
    grid.appendChild(galleryImg);
  }
  /*
  Pour avoir le nombre de lignes requises : nombre de projets (works) / 5 (nombre projet par ligne)
  On multiplie par 100 car la hauteur de nos images est de 100
  On rajoute 55 car c'est l'espacement requis par la maquette
  On transforme le résultat en chaine de caractère car style.height attend ce type
  On ajoute px car on attend que notre grille ait une hauteur en pixels
  */
  const height = Math.ceil(works.length / 5) * 100 + 55;
  grid.style.height = height.toString() + "px";
  if (height > 355) {
    //Si hauteur images > 355 alors on scroll
    grid.style.overflow = "auto";
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
