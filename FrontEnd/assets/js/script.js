// Vérifiez si vous êtes sur la page "index.html" en vérifiant si l'élément .gallery existe
const galleryElement = document.querySelector(".gallery");
if (galleryElement) {
  // Si .gallery existe, vous êtes sur "index.html"
  let projects = []; // Déclarez une variable pour stocker les projets

    // Partie 1 : Fonctions pour créer la structure HTML d'un projet
    function createProjectElement(project) {
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");

      // Définissez l'attribut src de l'image en utilisant l'URL de l'image du projet
      imgElement.src = project.imageUrl;

      // Définissez le texte du figcaption en utilisant le titre du projet
      figcaptionElement.textContent = project.title;

      // Ajoutez l'image et le figcaption à la figure
      figureElement.appendChild(imgElement);
      figureElement.appendChild(figcaptionElement);

      return figureElement;
    }

    // Partie 2 : Fonction pour créer la galerie de projets
    function createGallery(projects, galleryElement) {
        // Effacez le contenu existant de la galerie
        galleryElement.innerHTML = "";
  
        // Parcourez les données récupérées et affichez-les dans la galerie
        for (const project of projects) {
          const projectElement = createProjectElement(project);
          // Ajoutez le projet à la galerie
          galleryElement.appendChild(projectElement);
        }
      }

    // Partie 3 : Requête GET pour récupérer les données des projets depuis l'API
    fetch('http://localhost:5678/api/works')
      .then(response => {
        return response.json();
      }) 
      .then((data) => {
        projects = data; // Stockez les projets dans la variable projects
        // Affichez tous les projets par défaut en utilisant createGallery
        createGallery(projects, galleryElement); // Utilisez galleryElement
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des projets :', error);
      });
}
