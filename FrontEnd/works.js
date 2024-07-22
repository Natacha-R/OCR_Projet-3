console.log(sessionStorage.getItem("token")); // (verification token (authentification) lors de la connexion)
let categories = []; // (declaration variable en tant que tableau vide pour stocker les categories)
let works = []; // (pour stocker les projets)
const formulaire = document.getElementById("formAddPhoto");
let file = null; // (variable fichier = aucun fichier selectionne)

//**************************************** Recuperation des projets avec Fetch :

const requestWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      works = data;
    })
    .catch((err) => alert(err));
};

//**************************************** Recuperation des donnees categories avec Fetch :

//* declaration de la fonction asynchrone 'request' :
const request = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json()) // (traite la réponse de la requête => convertit la réponse en JSON)
    .then((data) => {
      // (traite les donnees converties en JSON)
      categories = data; // (les donnees sont stockees dans la variable categories)
    })
    .catch((err) => alert(err));
};

//**************************************** Suppression d'un projet avec fetch (methode delete) :

//* declaration de la fonction asynchrone 'requestDeleteWorks' avec parametre 'id' qui est l'identifiant du projet à supprimer
const requestDeleteWorks = async (id) => {
  // (envoi requete delete avec fetch à l'url http, incluant l'id du projet)
  await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE", // (specifie que la requete est une suppression)
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"), // (ajout un token d'authentification pour verifier que l'utilisateur a le droit de supprimer le projet)
    },
  })
    .then((response) => {
      // (Si succès de la requete : la fonction 'workslist' est appelée pour rafraichir la liste des projets sur la page d'accueil + modale)
      worksList();
    })
    .catch((err) => alert(err)); // (gestion des erreurs avec '.catch')
};

/************************************************ Affichage des filtres et mode edition selon l'etat de connexion ********************************************************/

//* Declaration de la fonction asynchrone 'categoriesList' :
const categoriesList = async () => {
  //* verification de l'authentification de l'utilisateur :
  if (sessionStorage.getItem("token") == null) {
    // (Si pas d'utilisateurs connectés (token absent) alors appliquer le code suivant (affichage barre de filtres))
    //* affichage de la barre de filtres :
    await request(); // (appel de la fonction asynchrone request pour recuperer les categories)
    categories.unshift({ id: 0, name: "Tous" }); // (création du filtre "Tous" au debut de la liste des categories)

    const filtres = document.querySelector(".navbar"); // (selection de la barre de filtres dans le DOM)

    //* Creation et ajout des elements de filtre :
    for (const category of categories) {
      const li = document.createElement("li"); // (Creation de <li> pour chaque categorie)
      li.setAttribute("id", category.id); // (Attribue l'id de la categorie (swagger) à l'element <li>)
      li.textContent = category.name; // (definit le texte de <li> = name de la categorie (swagger))
      filtres.appendChild(li); // (ajout des <li> à la barre de filtres dans le DOM)

      //* Gestionnaire d'evenement pour les filtres :
      li.addEventListener("click", () => {
        if (li.id === "0") {
          filterWorks(works); // (si id de li = 0 ("tous") alors afficher tous les projets)
        } else {
          const filteredWorks = works.filter(
            (work) => work.category.id === parseInt(li.id) // (convertir une chaine de caractères en un nombre entier)
          ); // (sinon filtrer les travaux par category avec id)
          filterWorks(filteredWorks); // (afficher les projets filtres)
        }
      });
    } //* Affichage du mode edition pour utilisateur connectes :
  } else {
    // (Barre mode edition visible si utilisateur connecté)
    const editionMode = document.querySelector(".edition");
    editionMode.style.display = "block"; // (afficher le mode edition)
    const header = document.querySelector(".header");
    header.style.marginTop = "97px"; //(marge du haut sur la partie header si mode edition)

    //* changement login en logout
    document.querySelector(".logac").innerText = "logout";
    const logoutButton = document.querySelector(".logac");

    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("token"); // (suppression du token donc de la connexion de l'utilisateur)
      window.location.href = "login.html"; // (redirection vers la page login.html)
    });

    //* Ajout du bouton 'modifier' :
    const p = document.createElement("p");
    p.textContent = "modifier";
    const i = document.createElement("i");
    i.classList.add("fa-regular", "fa-pen-to-square"); // (ajout icone Fontawesome)
    const modify = document.getElementById("modify");
    modify.appendChild(i);
    modify.appendChild(p);

    //* Gestion des Modales :
    var modal = document.getElementById("myModal"); // (modale 'galerie photo')
    var modalAddition = document.getElementById("modalAddition"); // (modale 'ajout photo')
    var backArrow = document.getElementById("backArrow"); // (selection flèche retour modale 'ajout photo')
    var span = document.getElementsByClassName("close")[0]; // (élément span pour fermer la modale (galerie photo))
    var closeAdditionButton = document.getElementById("closeAddition"); // (élément span pour fermer la modale (ajout photo))
    var addButton = document.getElementById("addButton"); // (selection du bouton 'ajouter une photo')

    //* ouvrir la modale lors du clic sur modifier ('galerie photo') :
    modify.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "flex";
    });
    //* fermer la modale lors du clic sur span close ('galerie photo') :
    span.addEventListener("click", (event) => {
      modal.style.display = "none";
    });

    //* fermer la modale lors du clic sur close ('ajout photo') :
    closeAdditionButton.addEventListener("click", (event) => {
      formulaire.reset(); // (reset le formulaire 'ajout photo')
      modalAddition.style.display = "none";
      imgSpan.style.display = "block";
      fileLabel.style.display = "block";
      imgP.style.display = "block";
      img.style.display = "none";
      img.src = ""; // (supprime l'image du bloc)
      file = null; // (deselectionner le fichier)
    });

    //* fermer les modales lors du clic en dehors de celle-ci :
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none"; // (fermer la modale 'galerie photo' lors d'un clic en dehors de celle-ci)
      } else if (event.target == modalAddition) {
        formulaire.reset();
        modalAddition.style.display = "none"; // (fermer la modale 'ajout photo' lors d'un clic en dehors de celle-ci)
        imgSpan.style.display = "block";
        fileLabel.style.display = "block";
        imgP.style.display = "block";
        img.style.display = "none";
        img.src = "";
        file = null;
      }
    };

    //* ouvrir 'ajout photo' au clic sur bouton 'ajouter une photo' :
    addButton.addEventListener("click", (event) => {
      modal.style.display = "none";
      modalAddition.style.display = "flex";
    });

    //* Ecouteur d'evenement sur fleche retour ('ajout photo'):
    backArrow.addEventListener("click", (event) => {
      modal.style.display = "flex";
      modalAddition.style.display = "none";
      formulaire.reset();
      validateButton.style.backgroundColor = "#a7a7a7";
      imgSpan.style.display = "block";
      fileLabel.style.display = "block";
      imgP.style.display = "block";
      img.style.display = "none";
      img.src = "";
      file = null;
    });
  }
};

categoriesList(); // (appel de la fonction pour executer le code)

/*************************************************** Ajout des travaux "Mes Projets" (gallery) / suppression / ajout de nouveaux projets *****************************************************/

//* Declaration de la fonction asynchrone 'workslist' :
const worksList = async () => {
  await requestWorks(); // (appel à la fonction requestWorks pour recuperer les projets)

  //* Suppression des elements existant dans la section 'gallery' et le conteneur 'grid' :
  const section = document.querySelector(".gallery");
  while (section.firstChild) {
    section.removeChild(section.firstChild); //supprime tous les enfants de .gallery pour raffraichir la liste
  }

  const grid = document.getElementById("grid");
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild); //supprime tous les enfants de .grid pour raffraichir la liste
  }

  //* Creation et ajout des nouveaux elements pour chaque projet :
  // (boucle pour chaque projet 'work' dans 'works')
  for (const work of works) {
    const myFigure = document.createElement("figure"); // (pour encapsuler l'image et le titre)
    const myImg = document.createElement("img"); // (pour afficher l'image du projet)
    const myFigcaption = document.createElement("figcaption"); // (pour afficher le titre du projet)

    myImg.src = work.imageUrl; // (definit la source de l'image avec l'url de l'image du projet)
    myFigcaption.textContent = work.title; // (definit le texte de la legende avec le titre du projet)
    section.appendChild(myFigure);
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);

    //* Création des miniatures dans la modale 'galerie photo' (div > img / button > i) :
    const gridDiv = document.createElement("div"); // (creation div pour encapsuler l'image et le bouton de suppression)
    gridDiv.classList.add("gridDiv"); // (ajoute une classe à 'gridDiv' pour le styliser)
    const gridImg = document.createElement("img"); // (creation 'img' pour afficher l'image miniature du projet)
    gridImg.src = work.imageUrl; // (definit la source de l'image avec l'url de l'image du projet)
    gridDiv.appendChild(gridImg); // (ajouter l'image au div 'gridDiv')

    //* On récupère plus tard l'id du projet à supprimer via le bouton :
    const gridButton = document.createElement("button"); // (creation du bouton pour permettre la suppression du projet dans 'galerie photo')
    gridButton.id = work.id; // (stock l'id du projet dans l'id du bouton)
    gridDiv.appendChild(gridButton);
    const gridI = document.createElement("i"); // (creer 'i' pour icone poubelle)
    gridI.classList.add("fa-solid", "fa-trash-can", "fa-sm", "deleteImage"); // (icone poubelle)
    gridButton.appendChild(gridI); // (ajouter l'icone au bouton)
    grid.appendChild(gridDiv); // (ajouter le div contenant la miniature et le bouton)

    //* gestionnaire d'evenements pour le bouton de suppression :
    gridButton.addEventListener("click", (event) => {
      event.preventDefault();
      requestDeleteWorks(gridButton.id); // (appel à la fonction 'requestDeleteWorks' avec l'id du projet pour le supprimer)
    });
  }

  //* Calcul de la hauteur de la grille et ajout de la gestion du defilement :

  /* (Pour avoir le nombre de lignes requises : nombre de projets (works) / 5 (nombre projet par ligne)
  On multiplie par 130 car la hauteur de nos images est de 130
  On rajoute 55 car c'est l'espacement requis par la maquette
  On transforme le résultat en chaine de caractère car style.height attend ce type
  On ajoute px car on attend que notre grille ait une hauteur en pixels) */
  const height = Math.ceil(works.length / 5) * 130 + 55;
  grid.style.height = height.toString() + "px";
  if (height > 445) {
    grid.style.overflow = "auto"; //Si hauteur images > 445 alors on scroll
  }
  //* Redirection du bouton contact de la page login vers la page index (if intégré aprés les projets pour que le chargement des images puissent se faire) :
  if (window.location.href.endsWith("index.html#contacttitle")) {
    window.location.href = "index.html#contacttitle";
  }
};

worksList(); // (appel a la fonction 'worksList' pour executer le code)

/**************************************************************** Fonction pour filtrer par travaux (page d'acceuil) ******************************************************************/

//* Fonction 'filterWorks' :
function filterWorks(works) {
  const element = document.querySelector(".gallery"); // (selection de l'element html 'gallery')

  while (element.firstChild) {
    // (Tant que gallery a des enfants (elements enfants) : les supprimer un par un. (permet de vider completement la galerie avant d'ajouter les nouveaux projets filtres))
    element.removeChild(element.firstChild);
  }
  // (pour chaque projet dans la liste 'works', creer les elements suivants)
  for (const work of works) {
    const myFigure = document.createElement("figure");
    const myImg = document.createElement("img");
    const myFigcaption = document.createElement("figcaption");

    myImg.src = work.imageUrl; // (definit la source de l'image avec l'url de l'image du projet)
    myFigcaption.textContent = work.title; // (definit titre de myFigcaption)

    // (ajout des elements crees a l'element 'gallery')
    element.appendChild(myFigure);
    myFigure.appendChild(myImg);
    myFigure.appendChild(myFigcaption);
  }
}

/**************************************************************** liste deroulante categories 'ajout photo' ******************************************************************/

// (fonction asynchrone 'addSelect')
const addSelect = async () => {
  await request(); // (appel à la fonction 'request' pour recuperer les donnees categories)

  const select = document.getElementById("category");
  const option = document.createElement("option");
  option.textContent = ""; // (ajout de l'option vide)
  select.appendChild(option); // (ajout de l'option vide à category : liste deroulante)

  for (const category of categories) {
    // (pour chaque categorie de la liste 'categories)
    const option = document.createElement("option");
    option.value = category.id; // (definit l'attribut value de l'option avec l'id de la categorie)
    option.textContent = category.name; // (text option = name category)
    select.appendChild(option);
  }
};

addSelect(); // (appel de la fonction 'addSelect' pour remplir la liste deroulante des que le script est execute)

/**************************************************************** Formulaire ******************************************************************/

//* Declaration constante 'reader' pour lire le fichier (image) de manière asynchrone :
const reader = new FileReader();
//* Recuperation des elements HTML :
const fileInput = document.getElementById("image");
const img = document.getElementById("preview"); // (element html qui affiche un apreçu de l'image telechargee)
const imgSpan = document.getElementById("imgSpan");
const fileLabel = document.getElementById("fileLabel");
const imgP = document.getElementById("imgP");
const title = document.getElementById("title");
const category = document.getElementById("category");
const validateButton = document.getElementById("validateButton");

//* Declaration de la fonction asynchrone 'requestAddWorks :
const requestAddWorks = async () => {
  const formData = new FormData(formulaire); // (Créer le body de la requête à partir du formulaire html (name formulaire = nom paramètre API))

  //* Envoi de la requete POST avec fetch :
  await fetch("http://localhost:5678/api/works/", {
    // (envoi une requete post à l'url http)
    method: "POST",
    body: formData, // (donnees du formulaire sous forme de 'formData')
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"), //Permet de s'assurer que l'utilisateur connecté pour ajouter (ajout token d'authentification)
    },
  })
    //* traitement de la reponse :
    .then((response) => {
      // (Si succès on rafraichit la liste des projets dans la modale et sur l'accueil grace a la fonction 'workList')
      worksList();
      var modalAddition = document.getElementById("modalAddition");
      modalAddition.style.display = "none"; // (cacher la modale 'ajout photo')

      // (reinitialiser le formulaire et ses elements associes a leur etat initial)
      formulaire.reset();
      validateButton.style.backgroundColor = "#a7a7a7";
      imgSpan.style.display = "block";
      fileLabel.style.display = "block";
      imgP.style.display = "block";
      img.style.display = "none";
      img.src = "";
    })
    .then((data) => data) // (traitement des donnees retournees)
    .catch((err) => alert(err)); // alerte en cas d'erreur pendant la requete)
};

//* écouteur d'événement 'change' sur fileInput (lorsque l'utilisateur selectionne un fichier, cette fonction sera executee)) :
fileInput.addEventListener("change", (event) => {
  const titleText = title.value;
  const categoryText = category.options[category.selectedIndex].text; // (recupere le texte de l'option selecitonnee dans la lsite deroulante 'category')

  file = event.target.files[0]; // (On récupère le premier fichier sélectionné)
  reader.readAsDataURL(file); // (demande à 'fileReader' de lire le fichier et de le convertir en url de donnees, pour permettre de previsualiser l'image)

  // (Si les champs de formulaire sont valides alors on change la couleur du bouton valider)
  if (file != null && titleText.length > 0 && categoryText.length > 0) {
    validateButton.style.backgroundColor = "#1d6154";
  } else {
    validateButton.style.backgroundColor = "#a7a7a7";
  }
});

//* Une fois que la lecture de l'image est faite on l'affiche avec reader (Affiche le contenu de l'élément selectionne par l'utilisateur dans html)
reader.onload = (event) => {
  imgSpan.style.display = "none";
  fileLabel.style.display = "none";
  imgP.style.display = "none";
  img.style.display = "block";
  img.src = event.target.result; // (Affichage de l'image (definit la source de l'image sur le resultat de la lecture du fichier))
};

//* Ecouteur d'evenements pour le clic sur 'validateButton' :
validateButton.addEventListener("click", (event) => {
  event.preventDefault(); // (evite le comportement par defaut de rechargement de la page)
  const titleText = title.value;
  const categoryText = category.options[category.selectedIndex].text;

  if (file != null && titleText.length > 0 && categoryText.length > 0) {
    requestAddWorks(); // (si photo,titre,categorie ok, alors : requette ajout photo)
  } else {
    alert("Veuillez remplir tous les champs");
  }
});

//* Evenement de type change  sur titre = changement valeur (couleur bouton de validation) :
title.addEventListener("change", (event) => {
  const titleText = title.value;
  const categoryText = category.options[category.selectedIndex].text;

  // (Si les champs de formulaire sont valides alors on change la couleur du bouton valider)
  if (file != null && titleText.length > 0 && categoryText.length > 0) {
    validateButton.style.backgroundColor = "#1d6154";
  } else {
    validateButton.style.backgroundColor = "#a7a7a7";
  }
});

//* Evenement de type change sur category = changement valeur (couleur bouton de validation) :
category.addEventListener("change", (event) => {
  const titleText = title.value;
  const categoryText = category.options[category.selectedIndex].text;

  // (Si les champs de formulaire sont valides alors on change la couleur du bouton valider)
  if (file != null && titleText.length > 0 && categoryText.length > 0) {
    validateButton.style.backgroundColor = "#1d6154";
  } else {
    validateButton.style.backgroundColor = "#a7a7a7";
  }
});
