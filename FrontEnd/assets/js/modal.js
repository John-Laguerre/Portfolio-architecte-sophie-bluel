document.addEventListener("DOMContentLoaded", function () {
    const modalOverlay = document.getElementById("modal-overlay");
    const modeEditOverlay = document.querySelector(".mode-edit-overlay");
    const editButton = document.querySelector(".edit-button");
    const closeModalButton = modalOverlay.querySelector(".close-modal-button");
  
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
    editButton.addEventListener("click", function () {
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
    } else {
      // Si le token n'est pas présent, masquez les éléments
      hideElements([modeEditOverlay]);
    }
  });
  