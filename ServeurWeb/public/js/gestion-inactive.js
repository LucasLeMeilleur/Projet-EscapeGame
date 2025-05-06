compteur = 0;

function SelectionnerPartie() {
    let selectPartie = document.getElementById("select_partie_cree");
    let infoPartie = document.getElementById("info_partie_selectionnee");

    fetch("/api/game/partie/nonlancee")
        .then(response => response.json())  
        .then(data => {
            selectPartie.innerHTML = '<option value="">Sélectionnez une partie</option>';

            if (data.length === 0) {
                infoPartie.textContent = "Aucune partie disponible.";
                return;
            }

            data.forEach(partie => {
                let option = document.createElement("option");
                option.value = partie.idgame;
                option.textContent = `Partie ${partie.idgame}`;
                selectPartie.appendChild(option);
            });

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
        method: "POST",  
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ partie: selectedId }) 
    })
        .then(response => response.json())
        .then(data => {
            alert("Partie demarrée avec succès !");
            window.location.href = "/admin/gestion-partie";
        })
        .catch(error => {
            alert("Erreur lors du démarrage de la partie.");
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

        let selectScenarioList = document.getElementById("select_scenario_list");
        let selectEquipeList = document.getElementById("select_equipe_list");

        selectScenarioList.innerHTML = '';
        selectEquipeList.innerHTML = '';

        scenarios.forEach(item => {
            let li = document.createElement("li");
            li.textContent = item.nom;
            li.setAttribute("data-value", item.idscenario);
            li.onclick = () => selectItem('select_scenario_container', item.nom);
            selectScenarioList.appendChild(li);
        });

        equipes.forEach(item => {
            let li = document.createElement("li");
            li.textContent = item.nom;
            li.setAttribute("data-value", item.idequipe);
            li.onclick = () => selectItem('select_equipe_container', item.nom);
            selectEquipeList.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function selectItem(containerId, value) {
    document.querySelector(`#${containerId} .select-display`).textContent = value;
    document.querySelector(`#${containerId} .select-dropdown`).style.maxHeight = '0';

    let container = document.getElementById(containerId);
    container.style.marginBottom = '0';
}

function filterList(containerId) {
    const input = document.querySelector(`#${containerId} .select-dropdown input`);
    const filter = input.value.toLowerCase();
    const items = document.querySelectorAll(`#${containerId} .select-dropdown ul li`);
    items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
}

function toggleDropdown(containerId) {
    let dropdown = document.querySelector(`#${containerId} .select-dropdown`);
    let container = document.getElementById(containerId);

    if (dropdown.style.maxHeight === '150px') {
        dropdown.style.maxHeight = '0';
        container.style.marginBottom = '0';
    } else {
        dropdown.style.maxHeight = '150px';
        container.style.marginBottom = '160px'; 
    }

}

document.addEventListener('click', (event) => {
    document.querySelectorAll('.select-container').forEach(container => {
        if (!container.contains(event.target)) {
            container.querySelector('.select-dropdown').style.maxHeight = '0';
            container.style.marginBottom = '0';  
        }
    });
});

document.addEventListener('click', (event) => {
    document.querySelectorAll('.select-container').forEach(container => {
        if (!container.contains(event.target)) {
            container.querySelector('.select-dropdown').style.maxHeight = '0';
        }
    });
});

async function envoyerFormulaire(event) {
    event.preventDefault(); 
    let scenario = document.getElementById("scenario_value_div").innerText;
    let equipe = document.getElementById("equipe_value_div").innerText;

    if (!scenario || !equipe) return alert("Veuillez sélectionner un scénario et une équipe.");

    let data = { scenario: scenario, equipe: equipe };

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
        } else {
            alert("Erreur : " + result.message);
        }
    } catch (error) {
        console.error("Erreur d'envoi :", error);
        alert("Une erreur est survenue.");
    }
}

function changerMode() {

    compteur += 1;

    if (compteur % 2 == 0) {
        document.getElementById("titre_partie").innerText = "Lancer une partie";
        document.getElementById("div_form_partie_selection").style.display = "block";
        document.getElementById("div_from_creer_partie").style.display = "none";
        SelectionnerPartie();
    } else {
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

