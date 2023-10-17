// Sélectionner l'élément gallery dans le DOM
const galleryElement = document.querySelector('.gallery');

// 
const urlWorks = "http://localhost:5678/api/works";
const urlCategorie = "http://localhost:5678/api/categories";
const urlDeleteWork = "http://localhost:5678/api/works/";

// Fonction récupérant l'API works
async function appelApiWorks() {
  const response = await fetch(urlWorks);
  return await response.json();
}

// Fonction récupérant l'API catégories
async function appelApiCategorie() {
  const response = await fetch(urlCategorie);
  return await response.json();
}

// Fonction récupérant l'API de suppression d'un travail
async function appelApiDeleteWork() {
  const response = await fetch(urlDeleteWork);
  return await response.json();
}





