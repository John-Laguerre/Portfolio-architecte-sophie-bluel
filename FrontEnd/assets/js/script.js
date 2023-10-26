// Sélection de l'élément gallery dans le DOM
const gallery = document.querySelector('.gallery');

// URLs des API
const urlDataWorks = "http://localhost:5678/api/works";
const urlDataCategorie = "http://localhost:5678/api/categories";
const urlDataDeleteWork = "http://localhost:5678/api/works/";

// Fonction pour récupérer l'API works
async function appelApiWorks() {
  const response = await fetch(urlDataWorks);
  return await response.json();
}

// Fonction pour récupérer l'API catégories
async function appelApiCategorie() {
  const response = await fetch(urlDataCategorie);
  return await response.json();
}

let works = [];

// Fonction pour créer un élément figure pour afficher une image
function createFigureElement(imageUrl, title) {
  const figure = document.createElement('figure');
  figure.innerHTML =`<img src="${imageUrl}" alt="${title}">
  <figcaption>${title}</figcaption>`;
  return figure;
}

// Affichage des images
async function affichageImage() {
  try {
    works = await appelApiWorks();

    // Effacez le contenu de la galerie
    gallery.innerHTML = "";

    works.forEach((work) => {
      const workFigure = createFigureElement(work.imageUrl, work.title);
      gallery.appendChild(workFigure);
    });
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération des images :", error);
  }
}

// Création des boutons filtres
async function afficherFilter() {
  try {
    const categories = await appelApiCategorie();
    const filterLiensContainer = document.getElementById('filter__links');

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
      allFilter.classList.add("btn"); // Ajoutez la classe "btn" si nécessaire
      filterLiensContainer.appendChild(allFilter);
    });

    // Ajoutez un gestionnaire d'événements au conteneur de filtres
    filterLiensContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("filters")) {
        const lienId = event.target.id;

        // Retirez la classe "active" de tous les filtres
        document.querySelectorAll(".filters").forEach((filter) => {
          filter.classList.remove("active");
        });

        event.target.classList.add("active");

        filterProjectsByCategory(lienId);
      }
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

// Fonction pour filtrer les projets en fonction de la catégorie sélectionnée
function filterProjectsByCategory(categoryId) {
  gallery.innerHTML = ""; // Efface la galerie avant d'ajouter de nouvelles images

  if (categoryId === "all") {
    // Affichez tous les projets
    works.forEach((project) => {
      const projectFigure = createFigureElement(project.imageUrl, project.title);
      gallery.appendChild(projectFigure);
    });
  } else {
    // Filtrer les projets par catégorie
    works.forEach((project) => {
      if (project.categoryId.toString() === categoryId) {
        const projectFigure = createFigureElement(project.imageUrl, project.title);
        gallery.appendChild(projectFigure);
      }
    });
  }
}

// Appeler la fonction pour afficher les filtres et les images
afficherFilter();
affichageImage();

// mode édition

// Sélection des éléments de l'interface utilisateur pour le mode édition
const header = document.querySelector('header');
const loginLink = document.querySelector(".login-link");
const logoutLink = document.querySelector(".logout-link");
const modeEditOverlay = document.querySelector('.mode-edit-overlay');
const editlink = document.querySelector('.edit-link');
const filterLinksContainer = document.getElementById('filter__links');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalButton = document.querySelector('.close-modal-button');
const portfoliotext = document.querySelector('.portfolio-text');
const modalGalleryTitle = document.querySelector('.modal-gallery-title');
const modalArrowButton = document.querySelector('.modal-arrow-button');
const modalAddTitle = document.querySelector('.modal-add-title');

// Fonction pour modifier l'attribut aria-hidden des éléments
function updateAriaHidden(elements, value) {
  elements.forEach(element => {
    if (element) {
      element.setAttribute("aria-hidden", value);
    }
  });
}

// Fonction pour afficher les éléments
function showElements(elements) {
  elements.forEach(element => {
    if (element && element.classList) {
      element.classList.remove("display-none");
    }
  });
}

// Fonction pour masquer les éléments
function hideElements(elements) {
  elements.forEach(element => {
    if (element && element.classList) {
      element.classList.add("display-none");
    }
  });
}

// Gestionnaire d'événements pour le bouton de déconnexion
if (logoutLink) {
  logoutLink.addEventListener("click", function () {
    // Supprimez le token de l'utilisateur du stockage local
    localStorage.removeItem("token");
    // Redirigez l'utilisateur vers la page d'accueil
    window.location.href = 'login.html';
  });

  // Vérifiez si un token est présent dans le stockage local (utilisateur connecté)
  if (localStorage.getItem("token")) {
    // L'utilisateur est connecté, affichez le mode édition
    showElements([modeEditOverlay]);
    editlink.classList.remove('display-none');
    loginLink.style.display = 'none'; // Masquez le lien de connexion
    logoutLink.style.display = 'block'; // Affichez le lien de déconnexion
    header.style.marginTop = '109px'; // Ajoutez une marge au header
    portfoliotext.style.marginBottom = '100px';

    // Sélectionnez tous les icônes avec aria-hidden="true" et définissez-les sur "false"
    const iconsWithAriaHidden = document.querySelectorAll('[aria-hidden="true"]');
    updateAriaHidden(iconsWithAriaHidden, "false");

    // L'utilisateur est connecté, masquez complètement les filtres
    filterLinksContainer.style.display = "none";
  } else {
    // L'utilisateur n'est pas connecté
    loginLink.style.display = "block"; // Affichez le lien de connexion
    logoutLink.style.display = "none"; // Masquez le lien de déconnexion
  }

  // Gestionnaire d'événements pour ouvrir la modale au clic sur le bouton "Modifier"
  editlink.addEventListener("click", function () {
    showElements([modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage]);
  });

  // Gestionnaire d'événements pour fermer la modale au clic sur le bouton de fermeture
  closeModalButton.addEventListener("click", function () {
    hideElements([modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage]);
  });

  // Gestionnaire d'événements pour fermer la modale au clic en dehors de la modale
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      hideElements([modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage, modalAddTitle, addImgForm, modalArrowButton]);
    }
  });
}

// modal

// Sélection des éléments pour la navigation et la gestion du modal de galerie
const nextPage = document.getElementById('nextPage');
const hrModalGallery = document.getElementById('hrModalGallery');
const addImgForm = document.getElementById('addImgForm');
const fileInput = document.querySelector('.img-add input[type="file"]');
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const token = localStorage.getItem("token");
const submitButton = document.querySelector('.modal-img-button');
const fileInputDiv = document.querySelector('.img-add');
const modalGallery = document.querySelector('.modal-gallery');

// Requête GET pour récupérer les données des projets depuis l'API
fetch('http://localhost:5678/api/works')
  .then(response => {
    return response.json();
  })
  .then((data) => {
    // Remplacez la variable 'projects' par 'data' pour stocker les projets
    works = data;

    // Appeler la fonction pour afficher les images
    affichageImage(works);

    // Code pour la galerie modale
    const modalOverlay = document.getElementById('modal-overlay');
    const modalGallery = modalOverlay.querySelector('.modal-gallery');

    // Créez un tableau pour stocker les boutons de suppression
    const trashButtons = [];

    works.forEach(project => {
      const projectID = project.id;
      const projectTitle = project.title;
      const projectImageUrl = project.imageUrl;

      const modalGalleryDiv = document.createElement('div');
      const modalGalleryImg = document.createElement('img');
      const trashButton = document.createElement('a');
      const trashIcon = document.createElement('i');

      modalGalleryDiv.style.position = "relative";

      trashButton.classList.add('delete-icon');
      trashButton.dataset.projectId = projectID;

      modalGalleryImg.src = projectImageUrl;
      modalGalleryImg.alt = projectTitle;

      trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

      modalGalleryDiv.appendChild(modalGalleryImg);
      trashButton.appendChild(trashIcon);
      modalGalleryDiv.appendChild(trashButton);
      modalGallery.appendChild(modalGalleryDiv);

      // Ajoutez le bouton de suppression au tableau
      trashButtons.push(trashButton);

      trashButton.addEventListener('click', async () => {
        
        if(confirm("voulez vous vraiment supprimer le projet ?")){
      
          try {
            const authToken = localStorage.getItem("token"); // Récupérez le token depuis le stockage local
            const response = await fetch(`http://localhost:5678/api/works/${projectID}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${authToken}` // Utilisez le token d'authentification
              },
            });

            if (!response.ok) {
              throw new Error(`Erreur lors de la suppression : ${response.status}`);
            }

            // Supprimez l'élément du DOM (le projet) après suppression réussie
            modalGalleryDiv.remove();

            // Mettez à jour la galerie principale en rechargeant les projets depuis l'API
            await affichageImage();
          } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression du projet :", error);
          }
        }
      });
    });
  })
  .catch(error => {
    console.error("Une erreur s'est produite lors de la récupération des projets :", error);
  });

/*
// Gestionnaire d'événements pour la sélection de fichier
fileInput.addEventListener('change', function () {
  previewPicture(this); // "this" fait référence à l'élément input de type fichier
});

// Vérifiez si l'utilisateur est connecté en vérifiant la présence du token
const authToken = localStorage.getItem("token");
// Vérifier si l'utilisateur est connecté (utilisation de token)
if (authToken) {
  nextPage.addEventListener('click', function () {
    const hide = [modalGalleryTitle, modalGallery, hrModalGallery, nextPage];
    hideElements(hide);

    const show = [modalAddTitle, addImgForm, modalArrowButton];
    showElements(show);
  });

  modalArrowButton.addEventListener('click', function () {
    const show = [modalGalleryTitle, modalGallery, hrModalGallery, nextPage];
    showElements(show);

    const hide = [modalAddTitle, addImgForm, modalArrowButton];
    hideElements(hide);
  });
}

// Fonction de validation du formulaire
function validateForm() {
  let valid = true;

  // Valider le champ de titre
  if (titleInput.value.trim() === '') {
    showValidationError(titleInput, true, "Le champ du titre est requis.");
    valid = false;
  } else {
    hideValidationError(titleInput);
  }

  // Valider le champ de catégorie
  if (categorySelect.value === '') {
    showValidationError(categorySelect, true, "Veuillez sélectionner une catégorie.");
    valid = false;
  } else {
    hideValidationError(categorySelect);
  }

  // Valider le champ de fichier (image)
  if (!fileInput.files[0]) {
    showValidationError(fileInputDiv, true, "Veuillez sélectionner une image.");
    valid = false;
  } else {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(fileInput.files[0].type)) {
      showValidationError(fileInputDiv, true, "Format de fichier non pris en charge.");
      valid = false;
    } else {
      hideValidationError(fileInputDiv);
    }
  }

  return valid;
}

// Fonction pour afficher un message d'erreur
function showValidationError(element, show = true, errorMessage = "Ce champ est requis.") {
  const errorText = element.nextElementSibling;
  errorText.textContent = errorMessage;
  if (show) {
    errorText.classList.remove("display-none");
    element.classList.add("error");
  } else {
    errorText.classList.add("display-none");
    element.classList.remove("error");
  }
}

// Fonction pour masquer le message d'erreur
function hideValidationError(element) {
  showValidationError(element, false);
}

// Ajouter un gestionnaire d'événements pour le formulaire
addImgForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    // Appel de la fonction pour envoyer le formulaire
    submitForm(new FormData(addImgForm));
  }
});


// Créez un tableau d'options de catégorie que vous souhaitez ajouter
const categories = ['Ojets', 'Appartements', 'Hôtels et restaurants'];

// Parcourez le tableau de catégories et ajoutez-les au <select>
categories.forEach((category) => {
  const option = document.createElement('option');
  option.value = category; // La valeur que vous souhaitez associée à chaque catégorie
  option.text = category; // Le texte affiché pour chaque catégorie
  categorySelect.appendChild(option);
});



// Preview Picture
function previewPicture(file) {
  const previewImg = document.getElementById('preview');
  const buttonAdd = document.querySelector('.button-add');
  const addText = document.querySelector('.add-text');
  const imgIcon = document.querySelector('.imgIcon');
  const errorText = document.querySelector('.error');

  const hide = [buttonAdd, addText, imgIcon, errorText];
  hideElements(hide);

  const show = [previewImg];
  showElements(show);

  const picture = file.files[0];

  const preview = document.getElementById('preview');
  preview.src = URL.createObjectURL(picture);
}

// Remove Preview
function removePreviewPicture() {
  const previewImg = document.getElementById('preview');
  const buttonAdd = document.querySelector('.button-add');
  const addText = document.querySelector('.add-text');
  const imgIcon = document.querySelector('.imgIcon');
  const errorText = document.querySelector('.error');

  const show = [buttonAdd, addText, imgIcon, errorText];
  showElements(show);

  const hide = [previewImg];
  hideElements(hide);

  errorText.textContent = "";

  const preview = document.getElementById('preview');
  preview.src = "";
}
// Reset Form
function resetForm() {
  document.getElementById('addImgForm').reset();
  removePreviewPicture();
  hideValidationError(titleInput);
  hideValidationError(categorySelect);
  hideValidationError(fileInputDiv);
  disableSubmit();
}

async function submitForm(formData) {
  try {
    const response = await fetch(urlWorks, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: formData,
    });

    if (response.ok) {
      // Envoi réussi, obtenez les données du nouveau projet depuis la réponse de l'API
      const nouveauProjet = await response.json();
      
      // Ajoutez le nouveau projet à la galerie
      ajouterNouveauProjetALaGalerie(nouveauProjet);
    } else {
      console.error("Échec de l'envoi du formulaire.");
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'envoi du formulaire :", error);
  }
}


// Fonction pour ajouter dynamiquement un nouveau projet à la galerie
function ajouterNouveauProjetALaGalerie(nouveauProjet) {
  const projectFigure = document.createElement("figure");
  projectFigure.innerHTML = `
    <img src="${nouveauProjet.imageUrl}" alt="${nouveauProjet.title}">
    <figcaption>${nouveauProjet.title}</figcaption>
  `;
  gallery.appendChild(projectFigure);
}

// Fonction pour soumettre le formulaire et ajouter un nouveau projet
async function soumettreFormulaireEtAjouterProjet(formData) {
  try {
    const response = await fetch(urlWorks, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      body: formData,
    });

    if (response.ok) {
      // Envoi réussi, obtenez les données du nouveau projet depuis la réponse de l'API
      const nouveauProjet = await response.json();
      
      // Ajoutez le nouveau projet à la galerie
      ajouterNouveauProjetALaGalerie(nouveauProjet);
    } else {
      console.error("Échec de l'envoi du formulaire.");
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'envoi du formulaire :", error);
  }
}

// Gestionnaire d'événements pour la soumission du formulaire
addImgForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (validateForm()) {
    // Créez un objet FormData avec les données du formulaire
    const formData = new FormData(addImgForm);
    // Appelez la fonction pour soumettre le formulaire et ajouter un nouveau projet
    await soumettreFormulaireEtAjouterProjet(formData);
  }
});
*/