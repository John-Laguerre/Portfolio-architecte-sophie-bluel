// login.js

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCredentials = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      if (response.status === 200) {
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        window.location.href = 'index.html';
      } else {
        errorMessage.textContent =
          "L'authentification a échoué. Vérifiez vos informations.";
      }
    } catch (error) {
      console.error(error);
    }
  });

  const loginLink = document.querySelector("li#login-link");
  const currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "login.html") {
    loginLink.classList.add("active");
  }
});

// Gestionnaire d'événements pour le bouton de déconnexion
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    // Supprimez le token de l'utilisateur
    localStorage.removeItem("token");
    // Redirigez vers la page d'accueil
    window.location.href = 'index.html';
  });
}
