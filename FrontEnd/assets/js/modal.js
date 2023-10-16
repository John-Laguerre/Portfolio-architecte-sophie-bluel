document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments de l'interface utilisateur pour l'édition
    const header = document.querySelector('header');
    const modeEditOverlay = document.querySelector('.mode-edit-overlay');
    const editlink = document.querySelector('.edit-link');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalButton = modalOverlay.querySelector('.close-modal-button');

    // Sélection des éléments pour la navigation et la gestion du modal de galerie
    const nextPage = document.getElementById('nextPage');
    const modalGalleryTitle = document.querySelector('.modal-gallery-title');
    const modalGallery = document.querySelector('.modal-gallery');
    const hrModalGallery = document.getElementById('hrModalGallery');
    const modalAddTitle = document.querySelector('.modal-add-title');
    const addImgForm = document.getElementById('addImgForm');
    const modalArrowButton = document.querySelector('.modal-arrow-button');

    // Sélection des éléments du formulaire d'upload
    const fileInput = document.querySelector('.img-upload input[type="file"]');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const token = localStorage.getItem("token");
    const submitButton = document.querySelector('.modal-img-button');
    const fileInputDiv = document.querySelector('.img-upload');

    
      // Fonction pour modifier l'attribut aria-hidden
      function updateAriaHidden(elements, value) {
        elements.forEach(element => {
          element.setAttribute("aria-hidden", value);
        });
      }
      
      // Fonction pour montrer les éléments
      function showElements(elements) {
        elements.forEach(element => {
          element.classList.remove("display-none");
        });
      }
      
      // Fonction pour cacher les éléments
      function hideElements(elements) {
        elements.forEach(element => {
          element.classList.add("display-none");
        });
      }
      
      // Gestionnaire d'événements pour le bouton "Modifier"
      editlink.addEventListener("click", function () {
        const show = [modalOverlay];
        showElements(show);
      });
      
      // Gestionnaire d'événements pour le bouton de fermeture à l'intérieur de la modal
      closeModalButton.addEventListener("click", function () {
        const hide = [modalOverlay];
        hideElements(hide);
      });
      
      // Gestionnaire d'événements pour la zone en dehors de la modal (arrière-plan)
      modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) {
          const hide = [modalOverlay];
          hideElements(hide);
        }
      });
      
      // Sélectionnez tous les icônes avec aria-hidden="true" et définissez-les sur "false"
      const iconsWithAriaHidden = document.querySelectorAll('[aria-hidden="true"]');
      updateAriaHidden(iconsWithAriaHidden, "false");
      
      // Vérifiez si l'utilisateur est connecté en vérifiant la présence du token
      const authToken = localStorage.getItem("token"); // Récupère le token du stockage local
      
      if (authToken) {
        // Si le token est présent, l'utilisateur est connecté, affichez le mode édition
        showElements([modeEditOverlay]);
        // Affichez le bouton "Modifier" en supprimant la classe "display-none"
        editlink.classList.remove("display-none");
        // Ajoute la marge au header
        header.style.marginTop = '109px';
      } else {
        // Si le token n'est pas présent, masquez les éléments
        hideElements([modeEditOverlay, editlink]);
      }

  // Vérifier si l'utilisateur est connecté (utilisation de token)
  if (localStorage.getItem("token")) {

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

    // Gestionnaires d'événement pour l'upload d'images
    fileInput.addEventListener('change', (e) => {

        const types = ['image/jpeg', 'image/png'];

        hideValidationError(fileInputDiv);

        if (!types.includes(e.target.files[0].type)) {
            const errorText = "Format non autorisé";

            fileInput.value = '';

            showValidationError(fileInputDiv, true, errorText);
            return;
        } else if (fileInput.value === '') {
            showValidationError(fileInputDiv);
        } else {
            previewPicture(e.target);
            hideValidationError(fileInputDiv);
        }
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

    // Gestionnaire d'événement pour le bouton de soumission du formulaire
    submitButton.addEventListener('click', async (e) => {
      checkFormValidity([fileInput, titleInput, categorySelect]);

      if (!submitButton.classList.contains('disabled')) {
          e.preventDefault();
          const formData = new FormData();

          // Ajouter les données du formulaire au FormData
          formData.append('image', fileInput.files[0]);
          formData.append('title', titleInput.value);
          formData.append('category', categorySelect.value);

          // Effectuer une requête de soumission vers le serveur
          fetch('http://localhost:5678/api/works', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: formData
          })
          .then(response => response.json())
          .then(data => {
            const portfolioSection = document.getElementById('portfolio');
            const gallery = portfolioSection.querySelector('.gallery');
            const modalOverlay = document.getElementById('modal-overlay');
            const modalGallery = modalOverlay.querySelector('.modal-gallery');
            
            const hide = [modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage, modaladdTitle, addImgForm, modalArrowButton];
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

              resetForm();
          })
          .catch(err => {
              console.error(err);
          });
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
  }
});