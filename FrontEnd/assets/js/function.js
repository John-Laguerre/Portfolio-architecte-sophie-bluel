// Fonction modifier l'attribut aria-hidden des éléments
function updateAriaHidden(elements, value) {
  elements.forEach(element => {
    if (element) {
      element.setAttribute("aria-hidden", value);
    }
  });
}

// Fonction masquer les éléments
function hideElements(elements) {
    elements.forEach(element => {
      if (element && element.classList) {
        element.classList.add("display-none");
      }
    });
  }
  
// Fonction afficher les éléments
function showElements(elements) {
    elements.forEach (element => {
      if (element && element.classList) {
        element.classList.remove("display-none");
      }
    });
}
  
// Fonction basculer l'affichage des éléments
function toggleElements(elements, visible) {
    elements.forEach(element => {
      if (element && element.classList) {
        element.classList.toggle("display-none", !visible);
      }
    });
}

// Filtrer les projets
function filterProjects(category) {
	const gallery = document.querySelector('.gallery');
	const projects = gallery.querySelectorAll('figure');

	projects.forEach(project => {
		const projectCategory = project.dataset.category;

		if (category === 'all' || projectCategory === category) {
            const show = [project];
			showElements(show);
		} else {
            const hide = [project];
            hideElements(hide);
		}
	});
}

// Fonction supprimer un projet
function deleteProject(projectId) {

  const token = localStorage.getItem("token");
  const elementDeleted = document.querySelector(`.delete-icon[data-project-id="${projectId}"]`);
  const portfolioDeleted = document.querySelector(`figure[data-project-id="${projectId}"]`);
  const galleryDeleted = elementDeleted.parentElement;

  fetchDelete(projectId, token)
    .then(response => {
      if (response.ok) {
        portfolioDeleted.remove();
        galleryDeleted.remove();
        console.log(`Le projet avec l'ID ${projectId} a été supprimé.`);
      } else {
        console.log(`Une erreur s'est produite lors de la suppression du projet avec l'ID ${projectId}.`);
      }
    })
    .catch(error => {
      console.log('Une erreur s\'est produite lors de la communication avec l\'API :', error);
    });
}

// Fonction mise à jour du DOM aprés envois
function Updatewithdata(data) {
  
   // Sélection des éléments du DOM
   const portfolioSection = document.getElementById('portfolio');
   const gallery = portfolioSection.querySelector('.gallery');
   const modalOverlay = document.getElementById('modal-overlay');
   const modalGallery = modalOverlay.querySelector('.modal-gallery');

   // Masque les éléments de la modale
   const hide = [modalOverlay, modalGalleryTitle, modalGallery, hrModalGallery, nextPage, modalAddTitle, addImgForm, modalArrowButton];
   hideElements(hide);

   const { id, title, imageUrl, categoryId } = data;

   // Galerie principale
   const figure = document.createElement('figure');
   figure.dataset.category = categoryId;
   figure.dataset.projectId = id;

   const image = document.createElement('img');
   image.src = imageUrl;
   image.alt = title;

   const figcaption = document.createElement('figcaption');
   figcaption.textContent = title;

   // Ajout dans galerie 
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

  // Ajout dans la galerie modale
   trashButton.appendChild(trashIcon);
   modalGalleryDiv.appendChild(modalGalleryImg);
   modalGalleryDiv.appendChild(trashButton);
   modalGallery.appendChild(modalGalleryDiv);

   // Supprimer un projet
   trashButton.addEventListener('click', () => {
     const projectId = trashButton.dataset.projectId;
     deleteProject(projectId);
   });
}

// Prévisualisation de l'image
function previewPicture() {
  const elementsToHide = [buttonAdd, addText, imgIcon, errorText];
  const elementsToShow = [previewImg];

  hideElements(elementsToHide);
  showElements(elementsToShow);

  const picture = fileInput.files[0];
  previewImg.src = URL.createObjectURL(picture);
}

// Supprimer la prévisualisation
function removePreviewPicture() {
  const elementsToHide = [previewImg];
  const elementsToShow = [buttonAdd, addText, imgIcon, errorText];

  showElements(elementsToShow);
  hideElements(elementsToHide);

  errorText.textContent = "";

  previewImg.src = "";
}

// Réinitialiser le formulaire
function resetForm() {
  addImgForm.reset();
  removePreviewPicture();
  hideValidationError(titleInput);
  hideValidationError(categorySelect);
  hideValidationError(fileInputDiv);
  disableSubmit();
}

// Fonction afficher un message d'erreur dans le formulaire
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
  
// Fonction masquer un message d'erreur dans le formulaire
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
  
// Fonction désactiver ou activer le bouton de soumission du formulaire
function disableSubmit() {
    const isTitleValid = titleInput.value.trim() !== '';
    const isCategoryValid = categorySelect.value !== '';
    const isFileValid = fileInput.value !== '';
    const isFormValid = isTitleValid && isCategoryValid && isFileValid;
    if (isFormValid) {
      submitButton.classList.remove('disabled');
    } else {
      submitButton.classList.add('disabled');
    }
}

// Vérifier la validité du formulaire
function checkFormValidity(elements) {

  elements.forEach(el => {
      if(el.value.trim() === '') {
          if(el.id==='') {
              el = el.parentElement.parentElement;
          }
          showValidationError(el);
      } else {
          hideValidationError(el);
      }
  });
  disableSubmit();
}

// Fonction vérifier la validité du formulaire de connexion
function checkLoginFormValidity(email, password) {
    if (email.value.trim() === '') {
      showValidationError(email, false);
    } else if (!validateEmail(email.value.trim())) {
      showValidationError(email, false, 'Format incorrect');
    } else {
      hideValidationError(email, false);
    }
  
    if (password.value === '') {
      showValidationError(password, false);
    } else {
      hideValidationError(password, false);
    }
}

// Fonction valider le format d'une adresse e-mail
function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
}