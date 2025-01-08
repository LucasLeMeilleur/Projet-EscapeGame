// Ajouter un écouteur d'événement pour "load" sur la fenêtre
window.addEventListener('load', function() {
    // Masquer le loader et afficher le contenu une fois la page complètement chargée
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    // Cacher le loader
    loader.style.display = 'none';
    // Afficher le contenu
    content.classList.remove('hide');
});