document.addEventListener('DOMContentLoaded', function () {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('login-submit');

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    checkLoginFormValidity(emailInput, passwordInput);

    if (!emailInput.classList.contains('error-input') && !passwordInput.classList.contains('error-input')) {
      const email = emailInput.value;
      const password = passwordInput.value;

      if (!validateEmail(email)) {
        showValidationError(emailInput, 'Format incorrect');
        return;
      }

      const data = {
        email: email,
        password: password,
      };

      try {
        const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const responseData = await response.json();
          const token = responseData.token;
          localStorage.setItem('token', token);
          window.location.href = 'index.html';
        } else if (response.status === 401) {
          throw new Error('Adresse mail ou mot de passe invalide');
        } else {
          throw new Error('Erreur lors de la connexion');
        }
      } catch (error) {
        showValidationError(passwordInput, error.message);
        passwordInput.value = '';
      }
    }
  });

 // Récupère le lien de connexion dans la barre de navigation
 const loginLink = document.querySelector(".login-link");

 // Récupère le nom de la page actuellement affichée dans l'URL
 const currentPage = window.location.pathname.split("/").pop();

 // Vérifie si la page actuelle est "login.html" et ajoute une classe "active" au lien
 if (currentPage === "login.html") {
   loginLink.classList.add("active");
 }

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

  passwordInput.addEventListener('input', function () {
  if (passwordInput.value === '') {
      showValidationError(passwordInput, false);
  } else {
      hideValidationError(passwordInput, false);
  }
  });
 
});

