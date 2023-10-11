// login.js

// Attend que le document HTML soit chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
  // Récupère le formulaire de connexion et le message d'erreur par leur ID
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  // Ajoute un gestionnaire d'événements lorsque le formulaire est soumis
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut

    // Récupère les valeurs de l'email et du mot de passe depuis les champs du formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Crée un objet avec les informations d'identification de l'utilisateur
    const userCredentials = {
      email: email,
      password: password,
    };

    try {
      // Effectue une requête asynchrone vers le serveur pour l'authentification
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials), // Convertit les informations en JSON
      });

      if (response.status === 200) {
        // Si l'authentification est réussie (statut 200), traite la réponse
        const data = await response.json(); // Récupère les données JSON de la réponse
        window.localStorage.setItem("token", data.token); // Stocke le token dans le stockage local
        window.location.href = 'index.html'; // Redirige vers la page d'accueil
      } else {
        // Si l'authentification échoue, affiche un message d'erreur
        errorMessage.textContent =
          "L'authentification a échoué. Vérifiez vos informations.";
      }
    } catch (error) {
      console.error(error); // En cas d'erreur, affiche l'erreur dans la console
    }
  });

  // Récupère le lien de connexion dans la barre de navigation
  const loginLink = document.querySelector("li#login-link");
  // Récupère le nom de la page actuellement affichée dans l'URL
  const currentPage = window.location.pathname.split("/").pop();

  // Vérifie si la page actuelle est "login.html" et ajoute une classe "active" au lien
  if (currentPage === "login.html") {
    loginLink.classList.add("active");
  }
});

// Gestionnaire d'événements pour le bouton de déconnexion
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    // Supprimez le token de l'utilisateur du stockage local
    localStorage.removeItem("token");
    // Redirigez l'utilisateur vers la page d'accueil
    window.location.href = 'index.html';
  });
}