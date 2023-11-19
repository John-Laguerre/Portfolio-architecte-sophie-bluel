// Appel fetch works
fetchWorks()
  .then(data => {

        // Sélection des éléments du DOM
        const portfolioSection = document.getElementById('portfolio');
        const gallery = portfolioSection.querySelector('.gallery');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalGallery = modalOverlay.querySelector('.modal-gallery');

        // Boucle sur les données de la notelist data
        data.forEach(project => {

            const { id, title, imageUrl, categoryId } = project;

            // Création des élément galerie principale
            const figure = document.createElement('figure');
            figure.dataset.category = categoryId;
            figure.dataset.projectId = id;


            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = title;


            const figcaption = document.createElement('figcaption');
            figcaption.textContent = title;

            // Ajout des éléments dans la galerie principal
            figure.appendChild(image);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);


            // Création des éléments galerie modale
            const modalGalleryDiv = document.createElement('div');
            modalGalleryDiv.style.position = 'relative';


            const modalGalleryImg = document.createElement('img');
            modalGalleryImg.src = imageUrl;
            modalGalleryImg.alt = title;

            // Création des liens de suppression pour la galerie modale
            const trashButton = document.createElement('a');
            trashButton.classList.add('delete-icon');
            trashButton.dataset.projectId = id;

            // Création de l'icône de poubelle
            const trashIcon = document.createElement('i');
            trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

            // Ajout des éléments dans la galerie modale
            trashButton.appendChild(trashIcon);
            modalGalleryDiv.appendChild(modalGalleryImg);
            modalGalleryDiv.appendChild(trashButton);
            modalGallery.appendChild(modalGalleryDiv);
        });

        const deleteIcons = document.querySelectorAll('.modal-gallery a.delete-icon');

        // Boucle sur les donnée de la noteList deleteIcons
        deleteIcons.forEach(deleteIcon => {

          // Suppression dans la galerie modale
          deleteIcon.addEventListener('click', () => {
            const projectId = deleteIcon.dataset.projectId;
            deleteProject(projectId);
          });
        });
    })
    .catch(error => {
    console.error('Erreur lors de la récupération des données des projets:', error);
});

// Appel fetch category
fetchCategory()
    .then(data => {

        // Sélection de l'élément DOM pour les liens de filtre
        const filterLinksContainer = document.querySelector('.filter__links');

        // Création du lien "Tous"
        const allLink = document.createElement("a");
        allLink.innerText = "Tous";
        allLink.classList.add("filters");
        allLink.dataset.category = "all";
        allLink.href = '#';
        
        // Ajout de l'élément allLink dans le parent
        filterLinksContainer.appendChild(allLink);

        // Boucle sur les données de la noteList data avec ça fonction fléché category
        data.forEach(category => {

            const categoryLink = document.createElement("a");

            categoryLink.innerText = category.name;
            categoryLink.dataset.category = category.id;
            categoryLink.classList.add("filters");
            categoryLink.href = '#';

            // Ajout de l'élément enfant dans le parent
            filterLinksContainer.appendChild(categoryLink);


            const selectUpload = document.querySelector('#category');

            // Création des options pour le menu déroulant de téléchargement
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;

            // Ajout de l'élément dans le selectUpload
            selectUpload.appendChild(option);
        });

        // Récupére l'élément du DOM
        const filterLinks = filterLinksContainer.querySelectorAll('.filters');

        // Boucle sur les donnée de la noteList filterlinks avec fonction fléché 
        filterLinks.forEach(link => {

            link.addEventListener('click', function (e) {
                e.preventDefault();

                // Boucle sur les donnée de la noteList et on parcourt tous les liens de filtre et on leur enlève la classe "active".
                filterLinks.forEach(lnk => lnk.classList.remove('active'));

                // Le lien de filtre actuellement cliqué se voit attribuer la classe "active".
                this.classList.add('active');
                
                // Filtrage des projets en fonction de la catégorie sélectionnée
                const selectedCategory = this.dataset.category;
                filterProjects(selectedCategory);
            });
        });
    })
    .catch(error => {
    console.error('Erreur lors de la récupération des données des catégories:', error);
});

// Mode édition

// Sélection des éléments du DOM
const header = document.querySelector('header');
const loginLink = document.querySelector(".login-link");
const logoutLink = document.querySelector(".logout-link");
const modeEditOverlay = document.querySelector('.mode-edit-overlay');
const editModif = document.querySelector('.edit-modif');
const filterLinkContainer = document.querySelector('.filter__links');
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


if (logoutLink) {

                                          // Déconnexion de l'utilisateur
  logoutLink.addEventListener("click", function () {

    // Supprime le token de l'utilisateur du stockage local
    localStorage.removeItem("token");

    // Redirigez l'utilisateur vers la page d'accueil
    window.location.href = 'login.html';
  });

                                          // Vérification de la connexion de l'utilisateur
  
  if (localStorage.getItem("token")) {

    // Affichez le mode édition
    showElements([modeEditOverlay]);

    editModif.classList.remove('display-none');
    loginLink.style.display = 'none';
    logoutLink.style.display = 'block';
    header.style.marginTop = '109px';
    portfoliotext.style.marginBottom = '100px';

    // Sélectionnez tous les icônes avec aria-hidden="true" et définissez-les sur "false"
    const iconsWithAriaHidden = document.querySelectorAll('[aria-hidden="true"]');
    updateAriaHidden(iconsWithAriaHidden, "false");

    // L'utilisateur est connecté, masquez complètement les filtres
    filterLinkContainer.style.display = "none";

  } else {
    // L'utilisateur n'est pas connecté
    loginLink.style.display = "block"
    logoutLink.style.display = "none";
  }

                                        // Gestion de l'ouverture et de la fermeture de la modale

  // Ouvrir la modale au clic sur le bouton "Modifier"
  editModif.addEventListener("click", function () {
    showElements([modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage]);
  });

  // Fermer la modale au clic sur le bouton de fermeture
  closeModalButton.addEventListener("click", function () {
    hideElements([modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage]);
  });

  // Fermer la modale au clic en dehors de la modale
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      hideElements([modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage, modalAddTitle, addImgForm, modalArrowButton]);
    }
  });

                                                  // Gestion de navigation dans la modale

  // Gestionnaire d'événements pour passer à la page suivante dans la modale
  nextPage.addEventListener('click', function () {
    const hide = [modalGalleryTitle, modalGallery, hrModalGallery, nextPage];
    hideElements(hide);

    const show = [modalAddTitle, addImgForm, modalArrowButton];
    showElements(show);
  });

  // Revenir à la page principale dans la modale
  modalArrowButton.addEventListener('click', function () {
    const show = [modalGalleryTitle, modalGallery, hrModalGallery, nextPage];
    showElements(show);

    const hide = [modalAddTitle, addImgForm, modalArrowButton];
    hideElements(hide);
  });
}

// Modal gallery

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

// Changement de fichier
fileInput.addEventListener('change', () => {
  previewPicture();
});

// Supprimer la prévisualisation
previewImg.addEventListener('click', () => {
  removePreviewPicture();
});

// Validation du champ titre
titleInput.addEventListener('input', function () {
  if (titleInput.value.trim() === '') {
    showValidationError(titleInput);
  } else {
    hideValidationError(titleInput);
  }
});

// Validation du champ catégorie
categorySelect.addEventListener('change', function () {
  if (categorySelect.value === '') {
    showValidationError(categorySelect);
  } else {
    hideValidationError(categorySelect);
  }
});

// Click sur le bouton de submitButton
submitButton.addEventListener('click', async (e) => {
  e.preventDefault();

  // Vérifie la validité du formulaire
  checkFormValidity([fileInput, titleInput, categorySelect]);

  if (!submitButton.classList.contains('disabled')) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);

    try {
      // Envoie des données au serveur
      const response = await fetchSend(userToken, formData);
      const data = await response.json();

      // Appel de la fonction mettre à jour le DOM
      Updatewithdata(data);

      console.log(data);

      // Réinitialise le formulaire
      resetForm();
    } catch (error) {
      console.error(error);
    }
  } else {

    // Empêche la soumission du formulaire si des erreurs sont présentes
    e.preventDefault();
    if (titleInput.value.trim() === '') {
      showValidationError(titleInput);
    }
    if (categorySelect.value === '') {
      showValidationError(categorySelect);
    }
    if (fileInput.value === '') {
      showValidationError(fileInputDiv);
    }
  }
});