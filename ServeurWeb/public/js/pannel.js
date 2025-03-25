// Définition des champs pour chaque type d'élément avec des noms plus lisibles
const tableMission = { "Nom": "nom", "Temps requis (secondes)": "tempsRequis", "Description": "description" };
const tableScenario = { "Nom du scénario": "nomScenario", "Ordre": "ordre", "Description": "description" };
const tableSalle = { "Nom de la salle": "nom", "Ville": "ville" };
const tableEquipe = { "Nom de l'équipe": "nom", "Nombre de joueurs": "nombre_joueur" };

// Associer les types aux objets correspondants
const tableChamps = {
    mission: tableMission,
    scenario: tableScenario,
    salle: tableSalle,
    equipe: tableEquipe
};

// Définition des endpoints API
const apiEndpoints = {
    mission: "/api/game/mission/ajout",
    scenario: "/api/game/scenario/ajout",
    salle: "/api/game/salle/ajout",
    equipe: "/api/game/equipe/ajout"
};

// Récupération des éléments HTML
const selectTypeFormulaire = document.getElementById("select_type_formulaire");
const formFields = document.getElementById("form_fields");
const form = document.getElementById("dynamic_form");

// Fonction pour générer les champs du formulaire
function genererFormulaire(type) {
    formFields.innerHTML = ""; // Effacer les champs actuels

    if (!tableChamps[type]) return; // Si le type est invalide, on ne fait rien

    Object.entries(tableChamps[type]).forEach(([labelText, champ]) => {
        const div = document.createElement("div");
        div.style.marginBottom = "10px";

        const label = document.createElement("label");
        label.innerText = labelText;
        label.setAttribute("for", champ);

        let input;
        if (champ === "description") {
            input = document.createElement("textarea");
        } else {
            input = document.createElement("input");
            input.type = "text";
        }

        input.id = champ;
        input.name = champ;
        input.required = true;

        div.appendChild(label);
        div.appendChild(input);
        formFields.appendChild(div);
    });
}

// Écouteur pour détecter un changement de sélection
selectTypeFormulaire.addEventListener("change", function () {
    genererFormulaire(this.value);
});

// Gestion de l'envoi du formulaire
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const typeSelectionne = selectTypeFormulaire.value;
    if (!typeSelectionne || !apiEndpoints[typeSelectionne]) {
        alert("Veuillez sélectionner un type valide.");
        return;
    }

    // Récupérer les données du formulaire
    const formData = {};
    Object.values(tableChamps[typeSelectionne]).forEach(champ => {
        formData[champ] = document.getElementById(champ).value;
    });

    try {
        const response = await fetch(apiEndpoints[typeSelectionne], { // <-- Utilisation de l'URL dynamique
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById("resultat_envoie").innerText = "Données envoyées avec succès !";
        } else {

            document.getElementById("resultat_envoie").innerText = result.message;
        }
    } catch (error) {
        document.getElementById("resultat_envoie").innerText = error;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const selectFormulaire = document.getElementById("select_type_formulaire");
    selectFormulaire.selectedIndex = 0
});