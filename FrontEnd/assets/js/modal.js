// modal.js

// Récupération des éléments du DOM
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.querySelector(".modal-content");
const modalCloseBtn = document.querySelector(".close-modal-btn");
const addProjectBtn = document.querySelector(".edit-btn");
const addImgForm = document.getElementById("addImgForm");
const modalGallery = document.querySelector(".modal-gallery");
const modalAddTitle = document.querySelector(".modal-add-title");
const modalImgBtn = document.querySelector(".modal-img-btn");
const galleryElement = document.querySelector(".gallery");

// Gestionnaire d'événement pour ouvrir la modal
addProjectBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("display-none");
  modalContent.classList.remove("display-none");
  modalAddTitle.classList.remove("display-none");
  modalImgBtn.classList.remove("display-none");
});

// Gestionnaire d'événement pour fermer la modal
modalCloseBtn.addEventListener("click", () => {
  closeModal();
});

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

// Fonction pour fermer la modal
function closeModal() {
  modalOverlay.classList.add("display-none");
  modalContent.classList.add("display-none");
  modalAddTitle.classList.add("display-none");
  modalImgBtn.classList.add("display-none");
}

// Étape 3.2 : Suppression de travaux existants
galleryElement.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const projectId = event.target.dataset.projectId;
    // Effectuez ici la requête fetch pour supprimer le projet avec projectId
    // Assurez-vous de mettre à jour le DOM après la suppression
    fetch(`URL_de_votre_API_pour_supprimer_le_projet/${projectId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // Mettez à jour le DOM ici pour supprimer le projet
        event.target.parentElement.remove();
      })
      .catch((error) => console.error("Une erreur s'est produite :", error));
  }
});

// Étape 3.3 : Envoi d'un nouveau projet au back-end via le formulaire de la modal
addImgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Récupérez les données du formulaire
  const formData = new FormData(addImgForm);

  // Effectuez ici la requête fetch pour envoyer le nouveau projet au backend
  fetch("URL_de_votre_API_pour_ajouter_un_projet", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // Mettez à jour le DOM ici pour ajouter le nouveau projet
      addProjectToGallery(data);
      closeModal();
      addImgForm.reset();
    })
    .catch((error) => console.error("Une erreur s'est produite :", error));
});

// Étape 3.4 : Traitement de la réponse de l'API pour afficher dynamiquement la nouvelle image de la modal
// Vous devrez ajouter dynamiquement un nouvel élément à la galerie dans la modal
// Assurez-vous également de mettre à jour la liste des images dans la modal

// Fonction pour ajouter un projet à la galerie
function addProjectToGallery(project) {
  const projectElement = createProjectElement(project);
  galleryElement.appendChild(projectElement);
}

// Partie 1 : Fonctions pour créer la structure HTML d'un projet
function createProjectElement(project) {
  const figureElement = document.createElement("figure");
  const imgElement = document.createElement("img");
  const figcaptionElement = document.createElement("figcaption");
  const deleteBtn = document.createElement("button");

  // Définissez l'attribut src de l'image en utilisant l'URL de l'image du projet
  imgElement.src = project.imageUrl;

  // Définissez le texte du figcaption en utilisant le titre du projet
  figcaptionElement.textContent = project.title;

  // Configurez le bouton de suppression avec l'ID du projet
  deleteBtn.textContent = "Supprimer";
  deleteBtn.dataset.projectId = project.id;
  deleteBtn.classList.add("delete-btn");

  // Ajoutez l'image, le figcaption et le bouton de suppression à la figure
  figureElement.appendChild(imgElement);
  figureElement.appendChild(figcaptionElement);
  figureElement.appendChild(deleteBtn);

  return figureElement;
}

// Utilisez cette fonction pour ajouter des projets existants à la galerie
function addExistingProjectsToGallery(projects) {
  for (const project of projects) {
    addProjectToGallery(project);
  }
}

// Assurez-vous d'appeler cette fonction pour ajouter les projets existants à la galerie au chargement de la page
fetch("URL_de_votre_API_pour_les_projets_existants")
  .then((response) => response.json())
  .then((data) => addExistingProjectsToGallery(data))
  .catch((error) => console.error("Une erreur s'est produite lors de la récupération des projets :", error));

// login.js

// Récupération des éléments du DOM
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

// Gestionnaire d'événement pour soumettre le formulaire de connexion
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Récupérez les valeurs des champs email et mot de passe
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Effectuez une requête fetch pour vous connecter à l'API
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Si la connexion réussit, redirigez l'utilisateur ou effectuez d'autres actions nécessaires
      console.log("Connexion réussie !");
    } else {
      // Si la connexion échoue, affichez un message d'erreur
      const data = await response.json();
      errorMessage.textContent = data.message;
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la connexion :", error);
  }
});
