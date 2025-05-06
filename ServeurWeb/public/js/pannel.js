// Définition des champs pour chaque type d'élément avec des noms plus lisibles
const tableMission = { "Nom": "nom", "Temps requis (secondes)": "tempsRequis", "Description": "description" };
const tableScenario = { "Nom du scénario": "nomScenario", "Ordre": "ordre", "Description": "description" };
const tableSalle = { "Nom de la salle": "nom", "Ville": "ville" };
const tableEquipe = { "Nom de l'équipe": "nom", "Nombre de joueurs": "nombre_joueur" };

const tableChamps = {
  mission: tableMission,
  scenario: tableScenario,
  salle: tableSalle,
  equipe: tableEquipe
};

const apiEndpoints = {
  mission: "/api/game/mission/ajout",
  scenario: "/api/game/scenario/ajout",
  salle: "/api/game/salle/ajout",
  equipe: "/api/game/equipe/ajout"
};

const selectTypeFormulaire = document.getElementById("select_type_formulaire");
const formFields = document.getElementById("form_fields");
const form = document.getElementById("dynamic_form");

function genererFormulaire(type) {
  formFields.innerHTML = "";
  if (!tableChamps[type]) return;
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

selectTypeFormulaire.addEventListener("change", function () {
  genererFormulaire(this.value);
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const typeSelectionne = selectTypeFormulaire.value;
  if (!typeSelectionne || !apiEndpoints[typeSelectionne]) {
    alert("Veuillez sélectionner un type valide.");
    return;
  }

  const formData = {};
  Object.values(tableChamps[typeSelectionne]).forEach(champ => {
    formData[champ] = document.getElementById(champ).value;
  });

  try {
    const response = await fetch(apiEndpoints[typeSelectionne], {
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
  document.getElementById("select_entity").selectedIndex = 0;
});

document.addEventListener("DOMContentLoaded", () => {
  const selectEntity = document.getElementById("select_entity");
  const table = document.getElementById("data_table");
  const searchInput = document.getElementById("search_input");
  let fullData = [];

  selectEntity.addEventListener("change", async () => {
    const type = selectEntity.value;
    res = null;
    if (type == "utilisateur") res = await fetch(`/api/user/liste`);
    else res = await fetch(`/api/game/${type}/liste`);
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
    const trHead = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      trHead.appendChild(th);
    });
    const saveTh = document.createElement("th");
    saveTh.textContent = "Actions";
    trHead.appendChild(saveTh);
    thead.appendChild(trHead);

    const trSearch = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      if (h === "id") {
        th.textContent = "";
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
    trSearch.appendChild(document.createElement("th"));
    thead.appendChild(trSearch);

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.dataset.original = JSON.stringify(row);

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

      const btnDelete = document.createElement("button");
      btnDelete.className = "Boutton_suppression";
      btnDelete.textContent = "🗑️";
      btnDelete.addEventListener("click", () => deleteRow(row.id, tr));
      saveTd.appendChild(btnDelete);

      saveTd.className = "Action-Items"

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
    url = "";
    if (type == "utilisateur") url = `/api/user/update-admin`
    else url = `/api/game/${type}/update`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    const resultText = JSON.parse(await res.text()).message;
    let saveResult = resultText;
    document.getElementById("Resultat_requete").innerText = saveResult;
    setTimeout(() => saveResult = "", 3000);
    document.getElementById("Resultat_requete").innerText = "";
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

  async function deleteRow(id, trElement) {
    const inputs = trElement.querySelectorAll("input");
    updatedData = { id };
    inputs.forEach(input => {
      updatedData[input.dataset.key] = input.value;
    });
    const type = selectEntity.value;
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
    if (!confirmation) return;
    url = null

    if (type == "utilisateur") url = `/api/user/delete/${encodeURIComponent(Object.values(updatedData)[1])}`;
    else url = `/api/game/${type}/delete/${encodeURIComponent(Object.values(updatedData)[1])}`;

    try {
      const res = await fetch(url, {
        method: "DELETE"
      });
      const result = await res.json();
      document.getElementById("Resultat_requete").innerText = result.message;

      selectEntity.dispatchEvent(new Event("change"));
    } catch (err) {
      document.getElementById("Resultat_requete").innerText = "Erreur lors de la suppression.";
    }
  }

});
