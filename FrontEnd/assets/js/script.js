// Fetch Works
fetchWorks()
    .then(data => {
        const portfolioSection = document.getElementById('portfolio');
        const gallery = portfolioSection.querySelector('.gallery');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalGallery = modalOverlay.querySelector('.modal-gallery');

        data.forEach(project => {
            const { id, title, imageUrl, categoryId } = project;

            // Portfolio Gallery
            const figure = document.createElement('figure');
            figure.dataset.category = categoryId;
            figure.dataset.projectId = id;

            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = title;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = title;

            figure.appendChild(image);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);

            // Modal Gallery
            const modalGalleryDiv = document.createElement('div');
            modalGalleryDiv.style.position = 'relative';

            const modalGalleryImg = document.createElement('img');
            modalGalleryImg.src = imageUrl;
            modalGalleryImg.alt = title;

            const trashButton = document.createElement('a');
            trashButton.classList.add('delete-icon');
            trashButton.dataset.projectId = id;

            const trashIcon = document.createElement('i');
            trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

            trashButton.appendChild(trashIcon);
            modalGalleryDiv.appendChild(modalGalleryImg);
            modalGalleryDiv.appendChild(trashButton);
            modalGallery.appendChild(modalGalleryDiv);
        });

        const deleteIcons = document.querySelectorAll('.modal-gallery a.delete-icon');

        deleteIcons.forEach(deleteIcon => {
            deleteIcon.addEventListener('click', () => {
                const projectId = deleteIcon.dataset.projectId;
                deleteProject(projectId);
            });
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
    });


// Fetch Categories
fetchCategory()
    .then(data => {
        const filterLinksContainer = document.querySelector('.filter__links');

        // Créer le lien "Tous"
        const allLink = document.createElement("a");
        allLink.innerText = "Tous";
        allLink.classList.add("filters");
        allLink.dataset.category = "all";
        allLink.href = '#';
        filterLinksContainer.appendChild(allLink);

        // Créer des liens pour chaque catégorie en utilisant les données des catégories
        data.forEach(category => {
            const categoryLink = document.createElement("a");
            categoryLink.innerText = category.name;
            categoryLink.dataset.category = category.id;
            categoryLink.classList.add("filters");
            categoryLink.href = '#';
            filterLinksContainer.appendChild(categoryLink);

            const selectUpload = document.querySelector('#category');
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            selectUpload.appendChild(option);
        });

        const filterLinks = filterLinksContainer.querySelectorAll('.filters');

        filterLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                filterLinks.forEach(lnk => lnk.classList.remove('active'));
                this.classList.add('active');
                const selectedCategory = this.dataset.category;
                filterProjects(selectedCategory);
            });
        });
  })
  .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
});


// mode édition

// Sélection des éléments de l'interface utilisateur pour le mode édition
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
    filterLinkContainer.style.display = "none";
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

// Gestionnaire d'événements pour le changement de fichier
fileInput.addEventListener('change', () => {
  previewPicture();
});

// Gestionnaire d'événements pour supprimer la prévisualisation
previewImg.addEventListener('click', () => {
  removePreviewPicture();
});

titleInput.addEventListener('input', function () {
  if (titleInput.value.trim() === '') {
      showValidationError(titleInput);
  } else {
      hideValidationError(titleInput);
  }
});

categorySelect.addEventListener('change', function () {
  if (categorySelect.value === '') {
      showValidationError(categorySelect);
  } else {
      hideValidationError(categorySelect);
  }
});

submitButton.addEventListener('click', async (e) => {
  checkFormValidity([fileInput, titleInput, categorySelect]);

  if (!submitButton.classList.contains('disabled')) {

      e.preventDefault();
      const formData = new FormData();

      formData.append('image', fileInput.files[0]);
      formData.append('title', titleInput.value);
      formData.append('category', categorySelect.value);

      try {
          const response = await fetchSend(userToken, formData);
          const data = await response.json();

          const portfolioSection = document.getElementById('portfolio');
          const gallery = portfolioSection.querySelector('.gallery');
          const modalOverlay = document.getElementById('modal-overlay');
          const modalGallery = modalOverlay.querySelector('.modal-gallery');

          const hide = [modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage, modalAddTitle, addImgForm, modalArrowButton];
          hideElements(hide);

          const figure = document.createElement('figure');
          const image = document.createElement('img');
          const figcaption = document.createElement('figcaption');

          figure.dataset.category = categorySelect.value;
          figure.dataset.projectId = data.id;

          image.src = URL.createObjectURL(fileInput.files[0]);
          image.alt = titleInput.value;
          figcaption.textContent = titleInput.value;

          figure.appendChild(image);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);

          // Modal Gallery
          const modalGalleryDiv = document.createElement('div');
          const modalGalleryImg = document.createElement('img');
          const trashButton = document.createElement('a');
          const trashIcon = document.createElement('i');

          modalGalleryDiv.style.position = "relative";

          trashButton.classList.add('delete-icon');
          trashButton.dataset.projectId = data.id;

          modalGalleryImg.src = URL.createObjectURL(fileInput.files[0]);
          modalGalleryImg.alt = titleInput.value;

          trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

          modalGalleryDiv.appendChild(modalGalleryImg);
          trashButton.appendChild(trashIcon);
          modalGalleryDiv.appendChild(trashButton);
          modalGallery.appendChild(modalGalleryDiv)

          trashButton.addEventListener('click', () => {
              const projectId = trashButton.dataset.projectId;

              deleteProject(projectId);
          });

          console.log(data);
          resetForm();
      } catch (error) {
          console.error(error);
      }
  } else {
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
