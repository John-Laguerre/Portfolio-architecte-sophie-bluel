// Sélectionner l'élément gallery dans le DOM
const gallery = document.querySelector('.gallery');

// 
const urlWorks = "http://localhost:5678/api/works";
const urlCategorie = "http://localhost:5678/api/categories";
const urlDeleteWork = "http://localhost:5678/api/works/";

// Fonction récupérant l'API works
async function appelApiWorks() {
  const response = await fetch(urlWorks);
  return await response.json();
}

// Fonction récupérant l'API catégories
async function appelApiCategorie() {
  const response = await fetch(urlCategorie);
  return await response.json();
}

// Fonction récupérant l'API de suppression d'un travail
async function appelApiDeleteWork() {
  const response = await fetch(urlDeleteWork);
  return await response.json();
}

let works = [];

// Affichage des images
async function affichageImage() {
  try {
    works = await appelApiWorks();
    gallery.innerHTML = ""; // Efface la galerie avant d'ajouter de nouvelles images

    works.forEach((projects) => {
      const allWorks = document.createElement("figure");
      allWorks.innerHTML = `
        <img src="${projects.imageUrl}" alt="${projects.title}">
        <figcaption>${projects.title}</figcaption>
      `;
      gallery.appendChild(allWorks);
    });
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des images :", error);
  }
}

// Appeler la fonction pour afficher les images
affichageImage();

// Création des boutons filtres
async function afficherFilter() {
  try {
    const categories = await appelApiCategorie();
    const filterLiensContainer = document.getElementById("filter__links");

    // Créez le lien "Tous"
    const allLien = document.createElement("a");
    allLien.innerText = "Tous";
    allLien.classList.add("filters");
    allLien.id = "all";
    filterLiensContainer.appendChild(allLien);

    // Créez des boutons pour chaque catégorie en utilisant les données des catégories
    categories.forEach((category) => {
      const allFilter = document.createElement("a");
      allFilter.innerText = category.name;
      allFilter.id = category.id;
      allFilter.classList.add("filters");
      filterLiensContainer.appendChild(allFilter);
    });

    // Ajoutez un gestionnaire d'événements au conteneur de filtres
    filterLiensContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("filters")) {
        const lienId = event.target.id;
        filterProjectsByCategory(lienId);
      }
    });
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des catégories :", error);
  }
}

// Appeler la fonction pour afficher les filtres
afficherFilter();

// Fonction pour filtrer les projets en fonction de la catégorie sélectionnée
function filterProjectsByCategory(categoryId) {
  gallery.innerHTML = ""; // Efface la galerie avant d'ajouter de nouvelles images

  if (categoryId === "all") {
    // Affichez tous les projets
    works.forEach((project) => {
      const projectFigure = document.createElement("figure");
      projectFigure.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
        <figcaption>${project.title}</figcaption>
      `;
      gallery.appendChild(projectFigure);
    });
  } else {
    // Filtrer les projets par catégorie
    works.forEach((project) => {
      if (project.categoryId.toString() === categoryId) {
        const projectFigure = document.createElement("figure");
        projectFigure.innerHTML = `
          <img src="${project.imageUrl}" alt="${project.title}">
          <figcaption>${project.title}</figcaption>
        `;
        gallery.appendChild(projectFigure);
      }
    });
  }
}
