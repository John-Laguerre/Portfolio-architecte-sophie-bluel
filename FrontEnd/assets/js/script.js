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

      // Partie 4 : Utilisation des données des catégories depuis l'API pour créer les liens de filtre
      fetch('http://localhost:5678/api/categories')
        .then(response => {
          return response.json();
        })
        .then((categories) => {
          // Modification : Ajout de l'argument "projects"
          createFilterLiens(categories, galleryElement, projects); // Ajout de "projects"
        })
        .catch(error => {
          console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
        });
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la récupération des projets :', error);
    });

  // Partie 5 : Création des liens de filtre
  function createFilterLiens(categories, galleryElement, projects) {
    const filterLiensContainer = document.getElementById("filter__links");

    // Créez le lien "Tous"
    const allLien = document.createElement("a");
    allLien.innerText = "Tous";
    allLien.classList.add("filters");
    allLien.id = "all"; // L'ID doit être "all"
    filterLiensContainer.appendChild(allLien);

    // Créez des boutons pour chaque catégorie en utilisant les données des catégories
    categories.forEach((category) => {
      const filterLien = document.createElement("a");
      filterLien.innerText = category.name;
      filterLien.id = category.id;
      filterLien.classList.add("filters");
      filterLiensContainer.appendChild(filterLien);
    });

    // Ajoutez l'écouteur d'événement au clic pour chaque lien de filtre
    const filterLiens = filterLiensContainer.querySelectorAll("a");
    filterLiens.forEach((lien) => {
      lien.addEventListener("click", () => {
        const lienId = lien.id;
        if (lienId === "all") {
          // Affichez tous les projets
          createGallery(projects, galleryElement);
        } else {
          // Filtrer les projets par catégorie
          const filteredArray = projects.filter(
            (project) => project.categoryId.toString() === lienId
          );
          createGallery(filteredArray, galleryElement);
        }
      });
    });
  }
}

// Gestionnaire d'événements pour le bouton de déconnexion
const logoutLink = document.querySelector(".logout-link");

if (logoutLink) {
  logoutLink.addEventListener("click", function () {
    // Supprimez le token de l'utilisateur du stockage local
    localStorage.removeItem("token");
    // Redirigez l'utilisateur vers la page d'accueil
    window.location.href = 'login.html';
  });
}
const loginLink = document.querySelector(".login-link")

if (localStorage.getItem("token")) {
  loginLink.classList.add('display-none');
  logoutLink.classList.remove('display-none');
} else {
  loginLink.classList.remove('display-none');
  logoutLink.classList.add('display-none');
}