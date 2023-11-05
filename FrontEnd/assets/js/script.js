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
const editModif = document.querySelector('.edit-modif');
const filterLinksContainer = document.getElementById('filter__links');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalButton = document.querySelector('.close-modal-button');
const portfoliotext = document.querySelector('.portfolio-text');
const modalGalleryTitle = document.querySelector('.modal-gallery-title');
const modalArrowButton = document.querySelector('.modal-arrow-button');
const modalAddTitle = document.querySelector('.modal-add-title');
const nextPage = document.getElementById('nextPage');
const hrModalGallery = document.getElementById('hrModalGallery');
const modalGallery = document.querySelector('.modal-gallery');
const addImgForm = document.getElementById('addImgForm');
const userToken = window.localStorage.getItem("token");

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
    editModif.classList.remove('display-none');
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
  editModif.addEventListener("click", function () {
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

// modal

// Affichage des works dans la galerie photo ( modal )

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

      trashButtons.push(trashButton);

      modalGalleryDiv.setAttribute('data-workid', projectID)

      trashButton.addEventListener('click', async (e) => {
        e.preventDefault();
  if (!userToken) {
    console.log("Suppression annulée par l'utilisateur.");
    return;
  }

  const workId = projectID; // Récupérez l'ID du projet à supprimer

  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}` // Ajoutez un en-tête d'autorisation si nécessaire
      },
    });

    if (response.ok) {
      // La suppression a réussi
      console.log(`Le projet avec l'ID ${workId} a été supprimé.`);
      // Vous pouvez également actualiser la liste des projets ou le DOM ici

      // Supprimez l'élément du DOM correspondant à workId dans la galerie principale
      const workFigure = document.querySelector(`figure[data-workid="${workId}"]`);
      if (workFigure) {
        workFigure.remove();
      }

      // Supprimez l'élément du DOM correspondant à workId dans la galerie modale
      const modalGalleryDiv = document.querySelector(`div[data-workid="${workId}"]`);
      if (modalGalleryDiv) {
        modalGalleryDiv.remove();
      }

      affichageImage();
    } else {
      // Gérer les erreurs, par exemple, afficher un message d'erreur
      console.error(`Échec de la suppression du projet avec l'ID ${workId}.`);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la suppression du projet :", error);
  }
});

    });
  })
  .catch(error => {
    console.error("Une erreur s'est produite lors de la récupération des projets :", error);
  });


// Sélection des éléments pour la navigation et la gestion du modal de galerie
const titleInput = document.getElementById('title');
const categorySelect = document.getElementById('category');
const submitButton = document.querySelector('.modal-img-button');
const fileInputDiv = document.querySelector('.img-add');
const addText = document.querySelector('.add-text');
const imgIcon = document.querySelector('.imgIcon');
const errorText = document.querySelector('.error');
const fileInput = document.querySelector('.img-add input[type="file"]');
const buttonAdd = document.querySelector('.button-add');
const previewImg = document.getElementById('preview');
const addInput = document.getElementById('add-image')

// Preview Picture
function previewPicture() {
  const elementsToHide = [buttonAdd, addText, imgIcon, errorText];
  const elementsToShow = [previewImg];

  hideElements(elementsToHide);
  showElements(elementsToShow);

  const picture = fileInput.files[0];
  previewImg.src = URL.createObjectURL(picture);
}

// Remove Preview
function removePreviewPicture() {
  const elementsToHide = [previewImg];
  const elementsToShow = [buttonAdd, addText, imgIcon, errorText];

  showElements(elementsToShow);
  hideElements(elementsToHide);

  errorText.textContent = "";

  previewImg.src = "";
}

// Reset Form
function resetForm() {
  addImgForm.reset();
  removePreviewPicture();
  hideValidationError(titleInput);
  hideValidationError(categorySelect);
  hideValidationError(fileInputDiv);
  disableSubmit();
}

// Gestionnaire d'événements pour le changement de fichier
fileInput.addEventListener('change', () => {
  previewPicture();
});

// Gestionnaire d'événements pour supprimer la prévisualisation
previewImg.addEventListener('click', () => {
  removePreviewPicture();
});

submitButton.addEventListener("click", async function (e) {
  e.preventDefault();
  
  if (addInput.value !== "" && titleInput.value !== "" && categorySelect.value !== "") {
      if (userToken !== null) {
          const tokenJson = JSON.parse(userToken);
          let token = tokenJson.token;

          if (confirm(`Voulez-vous vraiment ajouter le projet ?`)) {
              try {
                  const response = await fetch(`http://localhost:5678/api/works`, {
                      method: "POST",
                      headers: { "Authorization": `Bearer ${token}` },
                      body: new FormData // récupère directement les données du formulaire
                  })
                  if (response.ok) {
                      console.log("Succès")
                      resetForm()
                      gallery.innerHTML=""
                      affichageImage()
                  } else {
                      console.log("Erreur")
                  }
              } catch (error) {
                  console.error("Erreur lors de la requête :", error)
              }
          }
      }
  } else {
      alert("Veuillez remplir tous les champs");
  }
});

// Fonction pour charger les catégories depuis l'API et les ajouter au formulaire
async function loadCategories() {

  try {
    // Récupérer les catégories depuis votre API (remplacez "urlCategories" par l'URL correcte)
    const response = await fetch(urlDataCategorie);
    const categories = await response.json();

    // Ajouter les catégories au formulaire
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id; // Assurez-vous que l'ID est la valeur appropriée
      option.textContent = category.name; // Assurez-vous que "name" est le nom approprié
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Une erreur s'est produite lors du chargement des catégories :", error);
  }
}

// Appelez la fonction pour charger les catégories
loadCategories();