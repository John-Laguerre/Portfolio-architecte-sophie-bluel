// Fetch Works
fetch('http://localhost:5678/api/works')
	.then(response => response.json())
	.then(data => {
		const portfolioSection = document.getElementById('portfolio');
		const gallery = portfolioSection.querySelector('.gallery');
		const modalOverlay = document.getElementById('modal-overlay');
		const modalGallery = modalOverlay.querySelector('.modal-gallery');

		data.forEach(project => {
			const projectID = project.id;
			const projectTitle = project.title;
			const projectImageUrl = project.imageUrl;
			const projectCategoryID = project.categoryId;

			// Portfolio Gallery
			const figure = document.createElement('figure');
			const image = document.createElement('img');
			const figcaption = document.createElement('figcaption');

			figure.dataset.category = projectCategoryID;
			figure.dataset.projectId = projectID;

			image.src = projectImageUrl;
			image.alt = projectTitle;
			figcaption.textContent = projectTitle;

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
			trashButton.dataset.projectId = projectID;

			modalGalleryImg.src = projectImageUrl;
			modalGalleryImg.alt = projectTitle;

			trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');

			modalGalleryDiv.appendChild(modalGalleryImg);
			trashButton.appendChild(trashIcon);
			modalGalleryDiv.appendChild(trashButton);
			modalGallery.appendChild(modalGalleryDiv)
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
fetch('http://localhost:5678/api/categories')
.then(response => response.json())
.then(data => {
  const filterLinksContainer = document.querySelector('.filter__links');

  // Créez le lien "Tous"
  const allLien = document.createElement("a");
  allLien.innerText = "Tous";
  allLien.classList.add("filters");
  allLien.dataset.category  = "all";
  allLien.href = '#';
  filterLinksContainer.appendChild(allLien);

  // Créez des boutons pour chaque catégorie en utilisant les données des catégories
  data.forEach((category) => {
    const allFilter = document.createElement("a");
    const categoryID = category.id;
		const categoryName = category.name;

    allFilter.innerText = categoryName;
    allFilter.dataset.category  = categoryID;
    allFilter.classList.add("filters");
    allFilter.href = '#';
    filterLinksContainer.appendChild(allFilter);

    const selectUpload = document.querySelector('#category');
		const option = document.createElement('option');
			option.value = categoryID;
			option.textContent = categoryName;

			selectUpload.appendChild(option);
			filterLinksContainer.appendChild(allFilter);
  });

  const filterLinks = filterLinksContainer.querySelectorAll('.filters'); // Sélectionnez par classe "filters"

  filterLinks.forEach(allFilter => {
    allFilter.addEventListener('click', function (e) {
      e.preventDefault();
      filterLinks.forEach(lnk => lnk.classList.remove('active'));
      this.classList.add('active');
      const selectedCategory = this.dataset.category; // Récupérez l'ID de la catégorie à partir de l'attribut "data-category"
      filterProjects(selectedCategory);
    });
  });


})
.catch(error => {
  console.error('Erreur lors de la récupération des données:', error);
});

// Filter
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

// Delete project
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

// Check Form Validity
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

      fetch('http://localhost:5678/api/works', {

          method: 'POST',
          headers: {
              'Authorization': `Bearer ${userToken}`
          },
          body: formData

      })
          .then(response => response.json())
          .then(data => {
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
