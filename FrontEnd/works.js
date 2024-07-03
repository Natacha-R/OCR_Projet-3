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

// Suppression d'un projet avec fetch
const requestDeleteWorks = async (id) => {
  //id du projet à supprimer
  await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"), //Permet de s'assurer que l'utilisateur connecté peut supprimer un projet
    },
  })
    .then((response) => {
      //Si succès on rafraichit la liste des projets dans la modale et sur l'accueil
      worksList();
    })
    .then((data) => data)
    .catch((err) => alert(err));
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

    // Modale
    var modal = document.getElementById("myModal");
    var modalAddition = document.getElementById("modalAddition");
    var backArrow = document.getElementById("backArrow");
    var span = document.getElementsByClassName("close")[0]; //élément span pour fermer la modale
    var addButton = document.getElementById("addButton");

    modify.addEventListener("click", (event) => {
      event.preventDefault(); // ouvrir la modale lors du clic sur modifier
      modal.style.display = "flex";
    });

    span.addEventListener("click", (event) => {
      modal.style.display = "none"; // fermer la modale lors du clic sur span close
    });

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none"; // fermer la modale lors d'un clic en dehors de celle-ci
      }
    };

    addButton.addEventListener("click", (event) => {
      modal.style.display = "none";
      modalAddition.style.display = "flex";
    });

    backArrow.addEventListener("click", (event) => {
      modal.style.display = "flex";
      modalAddition.style.display = "none";
    });

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
  while (section.firstChild) {
    section.removeChild(section.firstChild); //supprime tous les enfants de .gallery pour raffraichir la liste
  }

  const grid = document.getElementById("grid");
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild); //supprime tous les enfants de .grid pour raffraichir la liste
  }

  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl;
    myFigcaption.textContent = work.title;
    section.appendChild(myFigure);
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);

    //Création des miniatures dans la modale (div > img / button > i)
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("gridDiv");
    const gridImg = document.createElement("img");
    gridImg.src = work.imageUrl;
    gridDiv.appendChild(gridImg);
    const gridButton = document.createElement("button");
    //On récupère plus tard l'id du projet à supprimer via le bouton
    gridButton.id = work.id;
    gridDiv.appendChild(gridButton);
    const gridI = document.createElement("i");
    gridI.classList.add("fa-solid", "fa-trash-can", "fa-sm", "deleteImage");
    gridButton.appendChild(gridI);
    grid.appendChild(gridDiv);

    //Appel au fetch pour supprimer le projet correspondant
    gridButton.addEventListener("click", (event) => {
      event.preventDefault();
      //On recupère l'id du projet grâce à l'id du bouton
      requestDeleteWorks(gridButton.id);
    });
  }
  /*
  Pour avoir le nombre de lignes requises : nombre de projets (works) / 5 (nombre projet par ligne)
  On multiplie par 130 car la hauteur de nos images est de 130
  On rajoute 55 car c'est l'espacement requis par la maquette
  On transforme le résultat en chaine de caractère car style.height attend ce type
  On ajoute px car on attend que notre grille ait une hauteur en pixels
  */
  const height = Math.ceil(works.length / 5) * 130 + 55;
  grid.style.height = height.toString() + "px";
  if (height > 445) {
    grid.style.overflow = "auto"; //Si hauteur images > 445 alors on scroll
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
