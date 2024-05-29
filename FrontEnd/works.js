let works = [];

// Récupération des données avec Fetch
const request = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      works = data;
    })
    .catch(function (error) {
      alert("HTTP Error " + error.status);
    });
};
