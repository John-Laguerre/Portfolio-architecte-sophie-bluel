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
  
// Fonction pour supprimer un projet
function deleteProject(projectId) {
    const token = localStorage.getItem("token");
    const elementDeleted = document.querySelector(`.delete-icon[data-project-id="${projectId}"]`);
    const portfolioDeleted = document.querySelector(`figure[data-project-id="${projectId}"]`);
    const galleryDeleted = elementDeleted.parentElement;
  
    fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
  
  const buttonAdd = document.querySelector('.button-add');
  const addText = document.querySelector('.add-text');
  const imgIcon = document.querySelector('.imgIcon');
  const errorText = document.querySelector('.error');
  
  const elementsToHidePreview = [buttonAdd, addText, imgIcon, errorText];
  const elementsToShowPreview = [previewImg];
  const elementsToHideRemove = [previewImg];
  const elementsToShowRemove = [buttonAdd, addText, imgIcon, errorText];
  
// Fonction pour prévisualiser une image
function previewPicture() {
    hideElements(elementsToHidePreview);
    showElements(elementsToShowPreview);
  
    const picture = fileInput.files[0];
    previewImg.src = URL.createObjectURL(picture);
}
  
// Fonction pour supprimer la prévisualisation de l'image
function removePreviewPicture() {
    showElements(elementsToShowRemove);
    hideElements(elementsToHideRemove);
  
    errorText.textContent = "";
  
    previewImg.src = "";
}
  
// Fonction pour réinitialiser le formulaire
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