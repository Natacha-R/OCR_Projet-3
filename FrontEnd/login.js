let UserLogin = [];
let statusCode = 0;

// Récupération des données users/login avec Fetch
const request = async (bodyString) => {
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // contenu du body : JSON
    body: bodyString, // JSON en chaine de caractères
  })
    .then((response) => {
      if (response.status == 401) {
        // si la réponse est 401 = alerte
        alert("Mot de passe incorrect");
      } else if (response.status == 404) {
        alert("Utilisateur non trouvé");
      }
      statusCode = response.status;
      return response.json();
    })
    .then((data) => {
      UserLogin = data;

      if (statusCode == 200) {
        sessionStorage.setItem("userId", UserLogin["userId"]); // enregistrer dans la session du site
        sessionStorage.setItem("token", UserLogin["token"]);

        window.location.href = "index.html"; //rediriger vers la page d'accueil
      }
    })
    .catch(function (error) {
      alert("HTTP Error" + error.status);
    });
};

// Tentative de connexion utilisateur
let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#passWord");
let BtnCo = document.querySelector("#btnCo");


BtnCo.addEventListener("click", (event) => {
  event.preventDefault(); // Bloquer le comportement par defaut du navigateur
  const mail = inputEmail.value;
  const password = inputPassword.value;

  if (mail.length == 0 && password.length == 0) {
    //si aucune saisie dans mail ou password
    alert("Merci de saisir l'utilisateur et le mot de passe !");
  } else if (mail.length == 0) {
    alert("Merci de saisir l'utilisateur !");
  } else if (password.length == 0) {
    alert("Merci de saisir le mot de passe !");
  } else {
    //sinon, création du contenu de la requette
    const body = { email: mail, password: password }; //création du dictionnaire contenant les saisies utilisateur
    const bodyString = JSON.stringify(body); // Convertir en une chaine de caractères/objet au format JSON
    request(bodyString);
  }
});
