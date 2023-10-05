// Mettez tout votre code JavaScript à l'intérieur de l'événement "DOMContentLoaded"
document.addEventListener("DOMContentLoaded", function () {
  // Vérifiez si vous êtes sur la page "index.html" en vérifiant si l'élément .gallery existe
  const galleryElement = document.querySelector(".gallery");
  if (galleryElement) {
    // Si .gallery existe, vous êtes sur "index.html"
    let projects = []; // Déclarez une variable pour stocker les projets

    // Fonction pour créer la structure HTML d'un projet
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

    // Fonction pour créer la galerie de projets
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

    // Effectuez une requête GET pour récupérer les données de l'API des projets
    fetch('http://localhost:5678/api/works')
      .then(response => {
        return response.json();
      }) 
      .then((data) => {
        projects = data; // Stockez les projets dans la variable projects
        // Affichez tous les projets par défaut
        createGallery(projects, galleryElement); // Utilisez galleryElement
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des projets :', error);
      });

    // categories and filter
    function createFilterButtons(categories, galleryElement) {
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
            createGallery(projects, galleryElement); // Utilisez galleryElement
          } else {
            // Filtrer les projets par catégorie
            const filteredArray = projects.filter(
              (project) => project.categoryId == buttonId
            );
            createGallery(filteredArray, galleryElement); // Utilisez galleryElement
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
        createFilterButtons(categories, galleryElement);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des catégories :', error);
      });

  } else {
    // Sinon, vous êtes sur "login.html"
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const userCredentials = {
        email: email,
        password: password,
      };

      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Authentification réussie, stockez le token et redirigez
            // vers la page d'accueil
            localStorage.setItem("token", data.token);
            
            // Redirigez vers la page d'accueil
            window.location.href = "index.html";
          } else {
            // Authentification échouée, affichez un message d'erreur
            errorMessage.textContent =
              "L'authentification a échoué. Vérifiez vos informations.";
          }
        })
        .catch((error) => {
          console.error("Erreur de communication avec l'API : " + error);
        });
    });
  }
});
