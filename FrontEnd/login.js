UserLogin = [];
statusCode = 0;

// Récupération des données users/login avec Fetch
const request = async (bodyString) => {
  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bodyString,
  })
    .then((response) => {
      if (response.status == 401) {
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
        sessionStorage.setItem("userId", UserLogin["userId"]);
        sessionStorage.setItem("token", UserLogin["token"]);

        /*console.log("User ID : " + sessionStorage.getItem("userId"));
        console.log("Token : " + sessionStorage.getItem("token"));*/
        window.location.href = "index.html";
      }
    })
    .catch(function (error) {
      alert("HTTP Error" + error.status);
    });
};

let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#passWord");
let BtnCo = document.querySelector("#btnCo");

BtnCo.addEventListener("click", (event) => {
  event.preventDefault();
  const username = inputEmail.value;
  const password = inputPassword.value;

  if (username.length == 0 && password.length == 0) {
    alert("Merci de saisir l'utilisateur et le mot de passe !");
  } else if (username.length == 0) {
    alert("Merci de saisir l'utilisateur !");
  } else if (password.length == 0) {
    alert("Merci de saisir le mot de passe !");
  } else {
    const body = { email: username, password: password };
    const bodyString = JSON.stringify(body);
    request(bodyString);
  }
});
