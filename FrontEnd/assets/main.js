// Sélectionne l'élément .gallery dans lequel je souhaite afficher les projets
const galleryElement = document.querySelector(".gallery");
let projects = []; // Déclarez une variable pour stocker les projets

// Fonction pour créer la structure HTML d'un projet
function createProjectElement(project) {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  const figcaptionElement = document.createElement("figcaption");

  // Définis l'attribut src de l'image en utilisant l'URL de l'image du projet
  imgElement.src = project.imageUrl;

  // Définis le texte du figcaption en utilisant le titre du projet
  figcaptionElement.textContent = project.title;

  // Ajout de l'image et le figcaption à la figure
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);

  return figureElement;
}


// Fonction pour créer la galerie de projets
function createGallery(projects) {
  // Effacez le contenu existant de la galerie
  galleryElement.innerHTML = "";

  // Parcourez les données récupérées et affichez-les dans la galerie
  for (const project of projects) {
    const projectElement = createProjectElement(project);
    // Ajoutez le projet à la galerie
    galleryElement.appendChild(projectElement);
  }
}


// Effectuez une requête GET pour récupérer les données de l'API des projets
fetch('http://localhost:5678/api/works')
  .then(response => {
    return response.json();
  }) 
  .then((data) => {
    projects = data; // Stockez les projets dans la variable projects
    // Affichez tous les projets par défaut
    createGallery(projects);

    // ... Le reste de votre code pour gérer les catégories et le filtrage
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des projets :', error);
  });


// categories and filter
function createFilterButtons(categories) {
  const filterButtonsContainer = document.getElementById("filter__btn");

  // Créez le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.classList.add("btn");
  allButton.id = "all";
  filterButtonsContainer.appendChild(allButton);

  // Créez des boutons pour chaque catégorie en utilisant les données des catégories
  categories.forEach((category) => {
    const filterButton = document.createElement("button");
    filterButton.innerText = category.name;
    filterButton.name = category.id;
    filterButton.classList.add("btn");
    filterButtonsContainer.appendChild(filterButton);
  });

  // Gérez les clics sur les boutons de filtrage
  const allFilterButtons = document.querySelectorAll(".btn");
  allFilterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const buttonId = e.target.name;
      if (buttonId === "") {
        // Affichez tous les projets
        createGallery(projects);
      } else {
        // Filtrer les projets par catégorie
        const filteredArray = projects.filter(
          (project) => project.categoryId == buttonId
        );
        createGallery(filteredArray);
      }
    });
  });
}

// Utilisez les données des catégories depuis l'API pour créer les boutons de filtre
fetch('http://localhost:5678/api/categories')
  .then(response => {
    return response.json();
  })
  .then((categories) => {
    // Appelez la fonction pour créer les boutons de filtre avec les données des catégories
    createFilterButtons(categories);
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
  });
