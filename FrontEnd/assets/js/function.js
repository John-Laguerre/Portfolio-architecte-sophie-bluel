// Fonction pour modifier l'attribut aria-hidden des éléments
function updateAriaHidden(elements, value) {
  elements.forEach(element => {
    if (element) {
      element.setAttribute("aria-hidden", value);
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
  
// Fonction pour afficher les éléments
function showElements(elements) {
    elements.forEach (element => {
      if (element && element.classList) {
        element.classList.remove("display-none");
      }
    });
}
  
// Fonction pour basculer l'affichage des éléments
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

// Fonction pour supprimer un projet
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

// Fonction pour afficher un message d'erreur dans le formulaire
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
  
// Fonction pour masquer un message d'erreur dans le formulaire
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
  
// Fonction pour désactiver ou activer le bouton de soumission du formulaire
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

// Fonction pour vérifier la validité du formulaire de connexion
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
  
// Fonction pour valider le format d'une adresse e-mail
function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
}
