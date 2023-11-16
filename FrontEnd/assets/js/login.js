// Attend que le DOM soit entièrement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function () {
  
  // Récupère les éléments du DOM
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('login-submit');

  // Clic sur le bouton de submitButton
  submitButton.addEventListener('click', async (e) => {

    // Empêche le comportement par défaut
    e.preventDefault();

    // Vérifie la validité du formulaire de connexion
    checkLoginFormValidity(emailInput, passwordInput);

    // Si le formulaire est valide
    if (!emailInput.classList.contains('error-input') && !passwordInput.classList.contains('error-input')) {
      const email = emailInput.value;
      const password = passwordInput.value;

      // Si l'adresse e-mail n'est pas au bon format, affiche une erreur
      if (!validateEmail(email)) {
        showValidationError(emailInput, 'Format incorrect');
        return;
      }

      // Prépare les données à envoyer pour la connexion
      const data = {
        email: email,
        password: password,
      };

      // appel la fonction fetchlogin avec le paramétre (data)
      fetchLogin(data)
        .then(response => {
          // Si la connexion réussit, traite la réponse
          if (response.ok) {
            return response.json();
          } else if (response.status === 401) {
            throw new Error('Adresse mail ou mot de passe invalide');
          } else {
            throw new Error('Erreur lors de la connexion');
          }
        })
        .then(responseData => {
          // Stocke le token dans le stockage local et redirige vers la page d'accueil
          const token = responseData.token;
          localStorage.setItem('token', token);
          window.location.href = 'index.html';
        })
        .catch(error => {
          // Affiche une erreur en cas d'échec de la connexion
          showValidationError(passwordInput, error.message);
          passwordInput.value = '';
        });
    }
  });

  // Récupère de l'élément du DOM
  const loginLink = document.querySelector(".login-link");

  // Récupère le nom de la page actuellement affichée dans l'URL
  const currentPage = window.location.pathname.split("/").pop();

  // Vérifie si la page actuelle est "login.html" et ajoute une classe "active" au lien
  if (currentPage === "login.html") {
    loginLink.classList.add("active");
  }

  // Ajoute un gestionnaire d'événements à la saisie dans le champ d'e-mail
  emailInput.addEventListener('input', function () {
    hideValidationError(emailInput, false);
    if (emailInput.value.trim() === '') {
        showValidationError(emailInput, false);
    } else if (!validateEmail(emailInput.value.trim())) {
        showValidationError(emailInput, false, 'Format incorrect');
    } else {
        hideValidationError(emailInput, false);
    }
  });

  // Ajoute un gestionnaire d'événements à la saisie dans le champ de mot de passe
  passwordInput.addEventListener('input', function () {
    if (passwordInput.value === '') {
        showValidationError(passwordInput, false);
    } else {
        hideValidationError(passwordInput, false);
    }
  });

});
