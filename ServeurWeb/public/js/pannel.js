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

// TABLEAU

const toggleBtn = document.getElementById("toggle_view");
const tableauView = document.getElementById("tableau_view");
const formulaireView = document.getElementById("div_fomulaire_insertion");

toggleBtn.addEventListener("click", () => {
    const isTableVisible = tableauView.style.display === "block";
    tableauView.style.display = isTableVisible ? "none" : "block";
    formulaireView.style.display = isTableVisible ? "flex" : "none";
    toggleBtn.textContent = isTableVisible ? "🪄 Basculer vers le tableau" : "🪄 Revenir au formulaire";
});


document.addEventListener("DOMContentLoaded", function () {
    const selectFormulaire = document.getElementById("select_type_formulaire");
    selectFormulaire.selectedIndex = 0
});

document.addEventListener("DOMContentLoaded", () => {
    const selectEntity = document.getElementById("select_entity");
    const table = document.getElementById("data_table");
    const searchInput = document.getElementById("search_input");
    const saveResult = document.getElementById("save_result");
    let fullData = [];

    selectEntity.addEventListener("change", async () => {
        const type = selectEntity.value;
        const res = await fetch(`/api/game/${type}/liste`);
        fullData = await res.json();
        renderTable(fullData);
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = fullData.filter(row => {
            return Object.values(row).some(val =>
                String(val).toLowerCase().includes(query)
            );
        });
        renderTable(filtered);
    });

    function renderTable(data) {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");
        thead.innerHTML = "";
        tbody.innerHTML = "";
      
        if (data.length === 0) return;
      
        const headers = Object.keys(data[0]);
      
        // En-tête des colonnes
        const trHead = document.createElement("tr");
        headers.forEach(h => {
          const th = document.createElement("th");
          th.textContent = h;
          trHead.appendChild(th);
        });
        const saveTh = document.createElement("th");
        saveTh.textContent = "Action";
        trHead.appendChild(saveTh);
        thead.appendChild(trHead);
      
        // Ligne de recherche
        const trSearch = document.createElement("tr");
        headers.forEach(h => {
          const th = document.createElement("th");
          if (h === "id") {
            th.textContent = ""; // pas de recherche sur l'id
          } else {
            const input = document.createElement("input");
            input.classList.add("column-filter");
            input.dataset.key = h;
            input.placeholder = `🔎 ${h}`;
            input.addEventListener("input", filterTableRows);
            th.appendChild(input);
          }
          trSearch.appendChild(th);
        });
        trSearch.appendChild(document.createElement("th")); // pour la colonne Action
        thead.appendChild(trSearch);
      
        // Corps du tableau
        data.forEach(row => {
          const tr = document.createElement("tr");
          tr.dataset.original = JSON.stringify(row); // pour garder les données originales
      
          headers.forEach(key => {
            const td = document.createElement("td");
            if (key === "id") {
              td.textContent = row[key];
              td.dataset.key = key;
            } else {
              const input = document.createElement("input");
              input.value = row[key];
              input.dataset.key = key;
              td.appendChild(input);
            }
            tr.appendChild(td);
          });
      
          const saveTd = document.createElement("td");
          const btn = document.createElement("button");
          btn.textContent = "💾";
          btn.addEventListener("click", () => saveRow(row.id, tr));
          saveTd.appendChild(btn);
          tr.appendChild(saveTd);
      
          tbody.appendChild(tr);
        });
      }

    async function saveRow(id, trElement) {
        const inputs = trElement.querySelectorAll("input");
        const type = selectEntity.value;
        const updatedData = { id };
        inputs.forEach(input => {
            updatedData[input.dataset.key] = input.value;
        });

        const res = await fetch(`/api/game/${type}/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const resultText = await res.text();
        saveResult.textContent = resultText;
        setTimeout(() => saveResult.textContent = "", 3000);
    }

    function filterTableRows() {
        const filters = Array.from(document.querySelectorAll(".column-filter"))
          .filter(input => input.value.trim() !== "");
      
        const rows = table.querySelectorAll("tbody tr");
      
        rows.forEach(row => {
          const original = JSON.parse(row.dataset.original);
          let visible = true;
      
          filters.forEach(filter => {
            const key = filter.dataset.key;
            const val = filter.value.trim().toLowerCase();
            const field = String(original[key]).toLowerCase();
            if (!field.includes(val)) {
              visible = false;
            }
          });
      
          row.style.display = visible ? "" : "none";
        });
      }
      
});
