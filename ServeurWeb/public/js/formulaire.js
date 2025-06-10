// Gestion de l'envoi du formulaire d'inscription
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        document.getElementById("spinner").style.display = "block";
        const formDataConfig = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData,
        });

        if (response.ok) {
            document.getElementById("spinner").style.display = "none";
            window.location.href = '/';
        } else {
            const errorDetails = JSON.parse(await response.text()).message;
            document.getElementById("montrer_erreur").innerText = errorDetails;
            document.getElementById("spinner").style.display = "none";
        }
    });
}


// Gestion de l'envoi du formulaire de connexion
if (document.getElementById('loginForm')) {
    // Gestion de l'événement : "Appui sur le bouton submit Se Connecter"
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        
        event.preventDefault();
        // Spinner en mode block
        document.getElementById("spinner").style.display = "block";
        // On récupère les données du formulaire sous forme de tablea
        const formDataConfig = new FormData(this);
        // On convertit les données au format json
        const jsonData = JSON.stringify(Object.fromEntries(formDataConfig.entries()));
        
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonData,
        });
        // Si les données existent dans la BDD -> STATUS 200 OK
        if (response.ok) {
            // On n'affiche plus le spinner
            document.getElementById("spinner").style.display = "none";
            // redirection vers la page index
            window.location.href = '/';
        } else {  //  STATUS 400 Bad Request
            document.getElementById("spinner").style.display = "none";
            const errorDetails = JSON.parse(await response.text()).message;
            // On affiche l'erreur dans le paragraphe dont l'id est "montrer_erreur"
            document.getElementById("montrer_erreur").innerText = errorDetails;
        }

    });
}

