UserLogin = [];

// Récupération des données users/login avec Fetch
const request = async () => {
  await fetch("http://localhost:5678/api/users/login")
    .then((response) => response.json())
    .then((data) => {
      UserLogin = data;
    })
    .catch(function (error) {
      alert("HTTP Error" + error.status);
    });
};

/*
let inputEmail = document.querySelector("#email");
let inputPassword = document.querySelector("#passWord");
let BtnCo = document.querySelector("#btnCo");

BtnCo.addEventListener("click", () => {
  if (inputEmail.value < 1 || inputPassword < 1) {
    console.log("stop !");
  }
});
*/
