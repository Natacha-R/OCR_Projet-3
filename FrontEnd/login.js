let UserLogin = []; //(déclaration variable globale UserLogin en tant que tableau vide pour stocker les informations de l'utilisateur aprés la connexion)
let statusCode = 0; //(déclaration variable globale statusCode pour suivre le statut de la reponse HTTP du serveur)

/******************************** Fonction asynchrone, requete POST pour connexion au serveur (swagger) **************************************/

//* déclaration de la fonction asynchrone 'request' :
const request = async (bodyString) => {
  //* envoi requete fetch users/login :
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // (contenu du body format JSON)
    body: bodyString, // (contenu de la requete en chaine de caracteres JSON)
  })
    //* Traitement de la réponse avec '.then :
    .then((response) => {
      // (si le statut de la réponse est 401 ou 404 = afficher une alerte)
      if (response.status == 401) {
        alert("Mot de passe incorrect");
      } else if (response.status == 404) {
        alert("Utilisateur non trouvé");
      }
      statusCode = response.status;
      return response.json(); // (convertir la réponse en JSON)
    })
    //* utilisation des données retournées :
    .then((data) => {
      UserLogin = data;
      // (si le statut est = 200, enregistrer les informations de l'utilisateur dans la session)
      if (statusCode == 200) {
        sessionStorage.setItem("userId", UserLogin["userId"]); // (stocker l'ID utilisateur)
        sessionStorage.setItem("token", UserLogin["token"]); // (stocker le token d'authentification)

        window.location.href = "index.html"; //(rediriger vers la page d'accueil)
      }
    })
    //* gestion des erreurs avec '.catch' :
    .catch(function (error) {
      alert("HTTP Error" + error.status); //(alerte qui affiche un message avec le statut de l'erreur)
    });
};

/******************************** Gestion tentative de connexion utilisateur sur la page Web **************************************/

//* selection des elements du DOM :
let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#passWord");
let BtnCo = document.querySelector("#btnCo");

//* fonction de validation de l'email :
// ('validateEmail' = expression régulière pour verifier si l'email est valide)
function validateEmail(email) {
  const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  return emailRegex.test(email);
}

//* ecouteur d'evenement sur le bouton de connexion :
BtnCo.addEventListener("click", (event) => {
  event.preventDefault(); // (Bloquer le comportement par defaut du navigateur, soumission formulaire)
  const mail = inputEmail.value; // (recupere la valeur saisie par l'utilisateur pour l'email)
  const password = inputPassword.value;
  //* verification des saisies utilisateur :
  //(si aucune saisie dans mail ou password)
  if (mail.length == 0 && password.length == 0) {
    alert("Erreur dans l'identifiant ou le mot de passe");
  } else if (!validateEmail(mail)) {
    alert("Erreur identifiant, mail non conforme");
  } else if (password.length == 0) {
    alert("Erreur mot de passe");
  } else {
    //* sinon, création du contenu de la requette et appel de la fonction 'request' :
    const body = { email: mail, password: password }; //(création de l'objet avec les saisies utilisateur)
    const bodyString = JSON.stringify(body); // (Convertir en une chaine de caractères, format JSON)
    request(bodyString); //(appel de la fonction request pour tenter la connexion)
  }
});
