// Script.js

// Vérifiez si vous êtes sur la page "index.html" en vérifiant si l'élément .gallery existe
const galleryElement = document.querySelector(".gallery");
if (galleryElement) {
  // Si .gallery existe, vous êtes sur "index.html"
  let projects = []; // Déclarez une variable pour stocker les projets

  // Partie 1 : Fonctions pour créer la structure HTML d'un projet
  function createProjectElement(project) {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    // Définissez l'attribut src de l'image en utilisant l'URL de l'image du projet
    imgElement.src = project.imageUrl;

    // Définissez le texte du figcaption en utilisant le titre du projet
    figcaptionElement.textContent = project.title;

    // Ajoutez l'image et le figcaption à la figure
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);

    return figureElement;
  }

  // Partie 2 : Fonction pour créer la galerie de projets
  function createGallery(projects, galleryElement) {
    // Effacez le contenu existant de la galerie
    galleryElement.innerHTML = "";

    // Parcourez les données récupérées et affichez-les dans la galerie
    for (const project of projects) {
      const projectElement = createProjectElement(project);
      // Ajoutez le projet à la galerie
      galleryElement.appendChild(projectElement);
    }
  }

  // Partie 3 : Requête GET pour récupérer les données des projets depuis l'API
  fetch('http://localhost:5678/api/works')
    .then(response => {
      return response.json();
    }) 
    .then((data) => {
      projects = data; // Stockez les projets dans la variable projects
      // Affichez tous les projets par défaut en utilisant createGallery
      createGallery(projects, galleryElement); // Utilisez galleryElement

      // Partie 4 : Utilisation des données des catégories depuis l'API pour créer les boutons de filtre
      fetch('http://localhost:5678/api/categories')
        .then(response => {
          return response.json();
        })
        .then((categories) => {
          // Modification : Ajout de l'argument "projects"
          createFilterButtons(categories, galleryElement, projects); // Ajout de "projects"
        })
        .catch(error => {
          console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
        });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des projets :', error);
    });

  // Partie 5 : Création des boutons de filtre
  function createFilterButtons(categories, galleryElement, projects) {
    const filterButtonsContainer = document.getElementById("filter__btn");

    // Créez le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.innerText = "Tous";
    allButton.classList.add("btn");
    allButton.id = "all"; // L'ID doit être "all"
    filterButtonsContainer.appendChild(allButton);

    // Créez des boutons pour chaque catégorie en utilisant les données des catégories
    categories.forEach((category) => {
      const filterButton = document.createElement("button");
      filterButton.innerText = category.name;
      filterButton.id = category.id;
      filterButton.classList.add("btn");
      filterButtonsContainer.appendChild(filterButton);
    });

    // Ajoutez l'écouteur d'événement au clic pour chaque bouton de filtre
    const filterButtons = filterButtonsContainer.querySelectorAll("button");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const buttonId = button.id;
        if (buttonId === "all") {
          // Affichez tous les projets
          createGallery(projects, galleryElement);
        } else {
          // Filtrer les projets par catégorie
          const filteredArray = projects.filter(
            (project) => project.categoryId.toString() === buttonId
          );
          createGallery(filteredArray, galleryElement);
        }
      });
    });
  }
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalGallery = modalOverlay.querySelector('.modal-gallery');
  // Partie Modal Gallery : Création des éléments pour la galerie modale
  projects.forEach(project => {
    const projectID = project.id;
    const projectTitle = project.title;
    const projectImageUrl = project.imageUrl;

    // Pour chaque projet, créez des éléments pour la galerie modale
    // - projectID : Identifiant unique du projet
    // - projectTitle : Titre du projet
    // - projectImageUrl : URL de l'image du projet

    // Étape 1 : Créez un conteneur pour chaque projet dans la galerie modale
    const modalGalleryDiv = document.createElement('div');
    modalGalleryDiv.style.position = "relative";

    // Étape 2 : Créez une image pour afficher le projet
    const modalGalleryImg = document.createElement('img');
    modalGalleryImg.src = projectImageUrl; // Définissez l'URL de l'image du projet
    modalGalleryImg.alt = projectTitle; // Définissez le texte alternatif de l'image

    // Étape 3 : Créez un bouton de suppression pour le projet
    const trashButton = document.createElement('a');
    const trashIcon = document.createElement('i');
    trashButton.classList.add('delete-icon');
    trashButton.dataset.projectId = projectID; // Stockez l'identifiant du projet en tant que données personnalisées

    // Étape 4 : Ajoutez l'icône de suppression à l'élément du bouton
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

    // Étape 5 : Construisez la structure de la galerie modale en ajoutant les éléments créés
    modalGalleryDiv.appendChild(modalGalleryImg); // Ajoutez l'image du projet
    trashButton.appendChild(trashIcon); // Ajoutez l'icône de suppression au bouton
    modalGalleryDiv.appendChild(trashButton); // Ajoutez le bouton à la galerie modale

    // Étape 6 : Ajoutez le conteneur du projet à la galerie modale
    modalGallery.appendChild(modalGalleryDiv); // Ajoutez le conteneur du projet à la galerie modale existante
  });
}
