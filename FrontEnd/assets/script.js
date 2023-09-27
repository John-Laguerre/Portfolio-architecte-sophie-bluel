// Sélectionnez l'élément .gallery dans lequel vous souhaitez afficher les projets
const galleryElement = document.querySelector(".gallery");

// Effectuez une requête GET pour récupérer les données de l'API
fetch('http://localhost:5678/api/works')
  .then(response => {
    return response.json();
  }) 
  .then((projects) => {
    // Parcourez les données récupérées et affichez-les dans la galerie
    for (const project of projects) {
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

      // Ajoutez la figure à la galerie
      galleryElement.appendChild(figureElement);
    }
    console.log(projects)
  })
  .catch(error => {
    console.error('Une erreur s\'est produite :', error);
  });
