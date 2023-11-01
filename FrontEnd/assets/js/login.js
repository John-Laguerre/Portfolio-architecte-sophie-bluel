const userMail = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("loginForm")
const message = document.getElementById("errorMessage")

// Fonction pour valider le format de l'e-mail
function isValidEmail(email) {
  // Utilisez une expression régulière pour vérifier le format de l'e-mail
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Empêche l'envoi du formulaire par défaut

  // Récupère les valeurs de l'email et du mot de passe depuis les champs du formulaire
  const email = userMail.value;
  const pass = password.value;

  // Vérifie si les champs email et password ne sont pas vides
  if (email.trim() === "" || pass.trim() === "") {
    message.textContent = "Veuillez remplir tous les champs.";
    return; // Arrête le traitement si les champs sont vides
  }

  // Vérifie le format de l'e-mail
  if (!isValidEmail(email)) {
    message.textContent = "Adresse e-mail invalide. Veuillez vérifier le format.";
    return; // Arrête le traitement si l'e-mail est invalide
  }

  const data = {
    email: email,
    password: pass,
  };
  const chargeUtile = JSON.stringify(data);

  // Récupérer le token du serveur
  try {
    const responseLogin = await fetch("http://localhost:5678/api/users/login", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: chargeUtile,
    });

    if (responseLogin.status === 200) {
      const responseLoginJSON = await responseLogin.json();

      const token = responseLoginJSON.token;
      const userId = responseLoginJSON.userId;

      const userToken = {
        user: `${userId}`,
        token: `${token}`
      };

      const valeurUserToken = JSON.stringify(userToken);
      window.localStorage.setItem("userToken", valeurUserToken);
      window.location.href = "index.html";
    } else if (responseLogin.status === 404) {
      message.innerText = "ERREUR Aucun utilisateur trouvé";
    } else if (responseLogin.status === 401) {
      message.innerText = "ERREUR mot de passe incorrecte";
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la requête :", error);
  }
});
