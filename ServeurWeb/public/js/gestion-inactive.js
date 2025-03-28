compteur = 0;

function SelectionnerPartie() {
    let selectPartie = document.getElementById("select_partie_cree");
    let infoPartie = document.getElementById("info_partie_selectionnee");

    // Effectuer la requête Fetch
    fetch("/api/game/partie/nonlancee")
        .then(response => response.json())  // Convertir la réponse en JSON
        .then(data => {
            // Vider le select avant d'ajouter les nouvelles options
            selectPartie.innerHTML = '<option value="">Sélectionnez une partie</option>';

            // Vérifier si des données ont été reçues
            if (data.length === 0) {
                infoPartie.textContent = "Aucune partie disponible.";
                return;
            }

            // Ajouter les options au select
            data.forEach(partie => {
                let option = document.createElement("option");
                option.value = partie.idgame;
                option.textContent = `Partie ${partie.idgame}`;
                selectPartie.appendChild(option);
            });

            // Gérer l'affichage des détails lors de la sélection
            selectPartie.addEventListener("change", function () {
                let selectedId = this.value;
                let selectedPartie = data.find(p => p.idgame == selectedId);

                if (selectedPartie) {
                    infoPartie.innerHTML = `
                        <strong>ID Partie :</strong> ${selectedPartie.idgame}<br>
                        <strong>Scénario :</strong> ${selectedPartie.idscenario}<br>
                        <strong>Équipe :</strong> ${selectedPartie.equipe.idequipe}-${selectedPartie.equipe.nom}<br>
                        <strong>Créée le :</strong> ${new Date(selectedPartie.dateCreation).toLocaleString()}<br>
                        <strong>Terminée :</strong> ${selectedPartie.terminee ? "Oui" : "Non"}
                    `;
                } else {
                    infoPartie.textContent = "Aucune partie sélectionnée.";
                }
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des parties :", error);
            infoPartie.textContent = "Erreur lors du chargement des parties.";
        });
}

function DemarrerPartie() {
    let selectPartie = document.getElementById("select_partie_cree");
    let selectedId = selectPartie.value;

    if (!selectedId) {
        alert("Veuillez sélectionner une partie !");
        return;
    }

    fetch(`/api/game/partie/demarrer`, {
        method: "POST",  // Change en "GET" si l'API attend une requête GET
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ partie: selectedId }) // Supprime `body` si c'est un GET
    })
    .then(response => response.json())
    .then(data => {
        console.log("Réponse du serveur :", data);
        alert("Partie envoyée avec succès !");
       
        window.location.href = "/admin/gestion-partie"; 
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi :", error);
        alert("Erreur lors de l'envoi de la partie.");
    });
}


async function chargerFormulaire() {
    try {
        let [responseScenario, responseEquipe] = await Promise.all([
            fetch('/api/game/scenario/liste'),
            fetch('/api/game/equipe/liste')
        ]);

            

        if (!responseScenario.ok || !responseEquipe.ok) 
            throw new Error("Erreur lors du chargement des données");

        let [scenarios, equipes] = await Promise.all([
            responseScenario.json(),
            responseEquipe.json()
        ]);

        
        console.log(scenarios);

        let selectScenario = document.getElementById("select_scenario");
        let selectEquipe = document.getElementById("select_equipe");

        selectScenario.innerHTML = selectEquipe.innerHTML = '<option value="">Sélectionnez...</option>';

        scenarios.forEach(item => {
            let option = document.createElement("option");
            option.value = item.idscenario;
            option.textContent = item.nom;
            selectScenario.appendChild(option);
        });
        

        equipes.forEach(item => {
            let option = document.createElement("option");
            option.value = item.idequipe;
            option.textContent = item.nom;
            selectEquipe.appendChild(option);
        });

    } catch (error) {
        console.error("Erreur :", error);
    }
}

async function envoyerFormulaire(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    let scenarioId = document.getElementById("select_scenario").value;
    let equipeId = document.getElementById("select_equipe").value;

    if (!scenarioId || !equipeId) {
        alert("Veuillez sélectionner un scénario et une équipe.");
        return;
    }

    let data = { idscenario: scenarioId, idequipe: equipeId };

    try {
        let response = await fetch('/api/game/partie/ajout', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (response.ok) {
            alert("Partie ajoutée avec succès !");
            console.log("Réponse serveur :", result);
        } else {
            alert("Erreur : " + result.message);
        }
    } catch (error) {
        console.error("Erreur d'envoi :", error);
        alert("Une erreur est survenue.");
    }
}

function changerMode(){

    compteur += 1;

    if(compteur%2 == 0){
        document.getElementById("titre_partie").innerText = "Lancer une partie";
        document.getElementById("div_form_partie_selection").style.display = "block";
        document.getElementById("div_from_creer_partie").style.display = "none";
        SelectionnerPartie();
    }else{
        document.getElementById("titre_partie").innerText = "Créer une partie";

        document.getElementById("div_form_partie_selection").style.display = "none";
        document.getElementById("div_from_creer_partie").style.display = "block";
    }

}



chargerFormulaire();
SelectionnerPartie();

document.getElementById("boutton_lancer_partie").addEventListener("click", DemarrerPartie);
document.getElementById("form_creer_partie").addEventListener("submit", envoyerFormulaire);
document.getElementById("boutton_skip").addEventListener("click", changerMode);

