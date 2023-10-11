// Sélectionnez les éléments du DOM
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitButton = document.querySelector('#login-submit');

// Gestionnaire d'événement pour la saisie dans le champ e-mail
emailInput.addEventListener('input', () => {
    // Efface les messages d'erreur précédents pour le champ e-mail
    hideValidationError(emailInput, false);

    // Vérifie si le champ e-mail est vide
    if (emailInput.value.trim() === '') {
        // Affiche un message d'erreur si le champ est vide
        showValidationError(emailInput, false);
    } else if (!validateEmail(emailInput.value.trim())) {
        // Vérifie si le format de l'e-mail est incorrect et affiche un message d'erreur
        showValidationError(emailInput, false, 'Format incorrect');
    } else {
        // Cache les messages d'erreur s'il n'y a pas d'erreur
        hideValidationError(emailInput, false);
    }
});

// Gestionnaire d'événement pour la saisie dans le champ de mot de passe
passwordInput.addEventListener('input', () => {
    if (passwordInput.value === '') {
        // Affiche un message d'erreur si le champ du mot de passe est vide
        showValidationError(passwordInput, false);
    } else {
        // Cache les messages d'erreur s'il n'y a pas d'erreur
        hideValidationError(passwordInput, false);
    }
});

// Gestionnaire d'événement pour le clic sur le bouton de soumission du formulaire
submitButton.addEventListener('click', async (e) => {
    // Vérifie la validité du formulaire
    checkLoginFormValidity(emailInput, passwordInput);

    e.preventDefault();

    // Vérifie que le champ d'e-mail et le champ du mot de passe n'ont pas de classes "error-input"
    if (!emailInput.classList.contains("error-input") && !passwordInput.classList.contains("error-input")) {
        // Récupère les valeurs du champ d'e-mail et du champ de mot de passe
        const email = emailInput.value;
        const password = passwordInput.value;

        // Vérifie le format de l'e-mail
        if (!validateEmail(email)) {
            // Affiche un message d'erreur si le format de l'e-mail est incorrect
            showValidationError(emailInput, false, 'Format incorrect');
            return;
        }

        // Crée un objet avec les informations d'identification de l'utilisateur
        const data = {
            email: email,
            password: password
        };

        try {
            // Effectue une requête asynchrone vers le serveur pour l'authentification
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Si l'authentification est réussie, traite la réponse
                const responseData = await response.json();
                const token = responseData.token;

                // Stocke le token dans le stockage local
                localStorage.setItem("token", token);

                // Redirige vers la page d'accueil
                window.location.href = "index.html";
            } else if (response.status === 401) {
                // Si l'authentification échoue, affiche un message d'erreur
                throw new Error("Adresse mail ou mot de passe invalide");
            } else {
                // En cas d'erreur de connexion, affiche un message d'erreur générique
                throw new Error("Erreur lors de la connexion");
            }
        } catch (error) {
            // En cas d'erreur, affiche l'erreur dans le champ de mot de passe
            showValidationError(passwordInput, false, error.message);
            passwordInput.value = '';
        }
    }
});
