let categories = [];

// Récupération des données avec Fetch
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

// Ajout des filtres
const categoriesList = async () => {
  await request();

  const filtres = document.querySelector(".navbar");
  const tous = document.createElement("li");
  tous.textContent = "Tous";
  filtres.appendChild(tous);

  for (const category of categories) {
    const li = document.createElement("li");

    li.textContent = category.name;
    filtres.appendChild(li);
  }
};

categoriesList();
