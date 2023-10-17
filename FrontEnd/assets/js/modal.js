// modal.js

document.addEventListener("DOMContentLoaded", function () {
  // Sélection des éléments de l'interface utilisateur pour l'édition
  const elements = {
    header: document.querySelector('header'),
    modeEditOverlay: document.querySelector('.mode-edit-overlay'),
    editlink: document.querySelector('.edit-link'),
    modalOverlay: document.getElementById('modal-overlay'),
    closeModalButton: document.querySelector('.close-modal-button'),
  };

  // Sélection des éléments pour la navigation et la gestion du modal de galerie
  const galleryElements = {
    nextPage: document.getElementById('nextPage'),
    modalGalleryTitle: document.querySelector('.modal-gallery-title'),
    modalGallery: document.querySelector('.modal-gallery'),
    hrModalGallery: document.getElementById('hrModalGallery'),
    modalAddTitle: document.querySelector('.modal-add-title'),
    addImgForm: document.getElementById('addImgForm'),
    modalArrowButton: document.querySelector('.modal-arrow-button'),
  };

  // Sélection des éléments du formulaire d'upload
  const formElements = {
    fileInput: document.querySelector('.img-add input[type="file"]'),
    titleInput: document.getElementById('title'),
    categorySelect: document.getElementById('category'),
    token: localStorage.getItem("token"),
    submitButton: document.querySelector('.modal-img-button'),
    fileInputDiv: document.querySelector('.img-add'),
  };

  // Fonction pour modifier l'attribut aria-hidden
  function updateAriaHidden(elements, value) {
    elements.forEach(element => {
      if (element) {
        element.setAttribute("aria-hidden", value);
      }
    });
  }

  // Fonction pour montrer les éléments
  function showElements(elements) {
    elements.forEach(element => {
      if (element && element.classList) {
        element.classList.remove("display-none");
      }
    });
  }

  // Fonction pour cacher les éléments
  function hideElements(elements) {
    elements.forEach(element => {
      if (element && element.classList) {
        element.classList.add("display-none");
      }
    });
  }

  // Gestionnaire d'événements pour le bouton "Modifier"
  elements.editlink.addEventListener("click", function () {
    const show = [elements.modalOverlay, galleryElements.modalGalleryTitle, galleryElements.modalGallery, galleryElements.hrModalGallery, galleryElements.nextPage];
    showElements(show);
    resetForm();
  });

  // Gestionnaire d'événements pour le bouton de fermeture à l'intérieur de la modal
  elements.closeModalButton.addEventListener("click", function () {
    const hide = [elements.modalOverlay, galleryElements.modalGalleryTitle, galleryElements.modalGallery, galleryElements.hrModalGallery, galleryElements.nextPage];
    hideElements(hide);
    resetForm();
  });

  // Gestionnaire d'événements pour la zone en dehors de la modal (arrière-plan)
  elements.modalOverlay.addEventListener("click", function (e) {
    if (e.target === elements.modalOverlay) {
      const hide = [elements.modalOverlay, galleryElements.modalGalleryTitle, galleryElements.modalGallery, galleryElements.hrModalGallery, galleryElements.nextPage, galleryElements.modalAddTitle, galleryElements.addImgForm, galleryElements.modalArrowButton];
      hideElements(hide);
      resetForm();
    }
  });

  // Sélectionnez tous les icônes avec aria-hidden="true" et définissez-les sur "false"
  const iconsWithAriaHidden = document.querySelectorAll('[aria-hidden="true"]');
  updateAriaHidden(iconsWithAriaHidden, "false");

  // Vérifiez si l'utilisateur est connecté en vérifiant la présence du token
  const authToken = localStorage.getItem("token");

  if (authToken) {
    // Si le token est présent, l'utilisateur est connecté, affichez le mode édition
    showElements([elements.modeEditOverlay]);
    // Affichez le bouton "Modifier" en supprimant la classe "display-none"
    elements.editlink.classList.remove("display-none");
    // Ajoute la marge au header
    elements.header.style.marginTop = '109px';
  } else {
    // Si le token n'est pas présent, masquez les éléments
    hideElements([elements.modeEditOverlay, elements.editlink]);
  }

  // Vérifier si l'utilisateur est connecté (utilisation de token)
  if (authToken) {
    galleryElements.nextPage.addEventListener('click', function () {
      const hide = [galleryElements.modalGalleryTitle, galleryElements.modalGallery, galleryElements.hrModalGallery, galleryElements.nextPage];
      hideElements(hide);

      const show = [galleryElements.modalAddTitle, galleryElements.addImgForm, galleryElements.modalArrowButton];
      showElements(show);
    });

    galleryElements.modalArrowButton.addEventListener('click', function () {
      const show = [galleryElements.modalGalleryTitle, galleryElements.modalGallery, galleryElements.hrModalGallery, galleryElements.nextPage];
      showElements(show);

      const hide = [galleryElements.modalAddTitle, galleryElements.addImgForm, galleryElements.modalArrowButton];
      hideElements(hide);
    });

    // Gestionnaires d'événement pour l'upload d'images
    formElements.fileInput.addEventListener('change', (e) => {
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        const allowedTypes = ['image/jpeg', 'image/png'];

        if (allowedTypes.includes(selectedFile.type)) {
          // Fichier valide, vous pouvez effectuer les actions nécessaires
          // Par exemple, afficher la prévisualisation de l'image
          previewPicture(selectedFile);
        } else {
          // Fichier non pris en charge, affichez un message d'erreur
          const errorText = "Format non autorisé";
          showValidationError(formElements.fileInputDiv, true, errorText);
          resetForm(); // Réinitialise le formulaire si nécessaire
        }
      } else {
        // Aucun fichier sélectionné, affichez un message d'erreur si nécessaire
        showValidationError(formElements.fileInputDiv);
      }
    });

    formElements.titleInput.addEventListener('input', function () {
      if (formElements.titleInput.value.trim() === '') {
        showValidationError(formElements.titleInput);
      } else {
        hideValidationError(formElements.titleInput);
      }
    });

    formElements.categorySelect.addEventListener('change', function () {
      if (formElements.categorySelect.value === '') {
        showValidationError(formElements.categorySelect);
      } else {
        hideValidationError(formElements.categorySelect);
      }
    });

    // Gestionnaire d'événement pour le bouton de soumission du formulaire
    formElements.submitButton.addEventListener('click', async (e) => {
      checkFormValidity([formElements.fileInput, formElements.titleInput, formElements.categorySelect]);

      if (!formElements.submitButton.classList.contains('disabled')) {
        e.preventDefault();
        const formData = new FormData();

        // Ajouter les données du formulaire au FormData
        formData.append('image', formElements.fileInput.files[0]);
        formData.append('title', formElements.titleInput.value);
        formData.append('category', formElements.categorySelect.value);

        // Effectuer une requête de soumission vers le serveur
        fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            const portfolioSection = document.getElementById('portfolio');
            const gallery = portfolioSection.querySelector('.gallery');
            const modalOverlay = document.getElementById('modal-overlay');
            const modalGallery = modalOverlay.querySelector('.modal-gallery');

            const hide = [modalOverlay, galleryElements.modalGalleryTitle, modalGallery, galleryElements.hrModalGallery, galleryElements.nextPage, galleryElements.modalAddTitle, galleryElements.addImgForm, galleryElements.modalArrowButton];
            hideElements(hide);

            const figure = document.createElement('figure');
            const image = document.createElement('img');
            const figcaption = document.createElement('figcaption');

            figure.dataset.category = formElements.categorySelect.value;
            figure.dataset.projectId = data.id;

            image.src = URL.createObjectURL(formElements.fileInput.files[0]);
            image.alt = formElements.titleInput.value;
            figcaption.textContent = formElements.titleInput.value;

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

            modalGalleryImg.src = URL.createObjectURL(formElements.fileInput.files[0]);
            modalGalleryImg.alt = formElements.titleInput.value;

            trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

            modalGalleryDiv.appendChild(modalGalleryImg);
            trashButton.appendChild(trashIcon);
            modalGalleryDiv.appendChild(trashButton);
            modalGallery.appendChild(modalGalleryDiv);

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
        if (formElements.titleInput.value.trim() === '') {
          showValidationError(formElements.titleInput);
        }
        if (formElements.categorySelect.value === '') {
          showValidationError(formElements.categorySelect);
        }
        if (!formElements.fileInput.value) {
          showValidationError(formElements.fileInputDiv);
        }
      }
    });
  }
});

// Fonction pour supprimer un projet par son ID
function deleteProject(projectId) {
  // Faites une requête DELETE à votre API pour supprimer le projet
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}` // Assurez-vous que le token d'authentification est inclus
    }
  })
    .then(response => {
      if (response.status === 204) {
        // Suppression réussie
        console.log('Projet supprimé avec succès');
        // Vous pouvez actualiser la page ou prendre d'autres mesures ici
      } else {
        // Gérez l'erreur en conséquence
        console.error('Impossible de supprimer le projet.');
      }
    })
    .catch(error => {
      console.error('Une erreur s\'est produite lors de la suppression du projet :', error);
    });
}


// Hide Element
function hideElement(elements) {
  elements.forEach(el => {
    if (el && el.classList) {
      el.classList.add("display-none");
    }
  });
}

// Show Element
function showElement(elements) {
  elements.forEach(el => {
    if (el && el.classList) {
      el.classList.remove("display-none");
    }
  });
}

// Preview Picture
function previewPicture(file) {
  const previewImg = document.getElementById('preview');
  const btnAdd = document.querySelector('.btn-add');
  const addText = document.querySelector('.add-text');
  const imgIcon = document.querySelector('.imgIcon');
  const errorText = document.querySelector('.error');

  var hide = [btnAdd, addText, imgIcon, errorText];
  hideElement(hide);

  var show = [previewImg];
  showElement(show);

  if (file.files && file.files[0]) {
    const picture = file.files[0];

    const preview = document.getElementById('preview');
    preview.src = URL.createObjectURL(picture);
  }
}

// Remove Preview
function removePreviewPicture() {
  const previewImg = document.getElementById('preview');
  const buttonAdd = document.querySelector('.button-add');
  const addText = document.querySelector('.add-text');
  const imgIcon = document.querySelector('.imgIcon');
  const errorText = document.querySelector('.error');

  const show = [buttonAdd, addText, imgIcon, errorText];
  showElement(show);

  const hide = [previewImg];
  hideElement(hide);

  errorText.textContent = "";

  const preview = document.getElementById('preview');
  preview.src = "";
}

// Reset Form
function resetForm() {
  const addImgForm = document.getElementById('addImgForm');
  removePreviewPicture();
  hideValidationError(addImgForm.titleInput);
  hideValidationError(addImgForm.categorySelect);
  hideValidationError(addImgForm.fileInputDiv);
  disableSubmit();
}

// Show Form Error
function showValidationError(inputElement, submit = true, text = 'Ce champ doit être rempli') {
  const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);
  if (errorElement) {
    return;
  }

  inputElement.classList.add('error-input');

  const errorMessage = document.createElement('p');
  errorMessage.classList.add('error-message');
  errorMessage.textContent = text;
  errorMessage.dataset.input = inputElement.id;
  inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
  if (submit) {
    disableSubmit();
  }
}

// Hide Form Error
function hideValidationError(inputElement, submit = true) {
  inputElement.classList.remove('error-input');
  const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);
  if (errorElement) {
    errorElement.parentNode.removeChild(errorElement);
  }
  if (submit) {
    disableSubmit();
  }
}

// Disable/Enable Submit
function disableSubmit() {
  const formElements = {
    titleInput: document.getElementById('title'),
    categorySelect: document.getElementById('category'),
    fileInputDiv: document.querySelector('.img-add'),
  };
  const isTitleValid = formElements.titleInput.value.trim() !== '';
  const isCategoryValid = formElements.categorySelect.value !== '';
  const isFileValid = formElements.fileInputDiv.value !== '';
  const isFormValid = isTitleValid && isCategoryValid && isFileValid;
  const submitButton = document.querySelector('.modal-img-button');
  if (submitButton) {
    if (isFormValid) {
      submitButton.classList.remove('disabled');
    } else {
      submitButton.classList.add('disabled');
    }
  }
}

// Check Form Validity
function checkFormValidity(elements) {
  elements.forEach(el => {
    if (el.value.trim() === '') {
      if (el.id === '') {
        el = el.parentElement.parentElement;
      }
      showValidationError(el);
    } else {
      hideValidationError(el);
    }
  });
  disableSubmit();
}
