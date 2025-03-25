
function SecondeVersTemps(a) {
    return Math.trunc(a / 60) + " : " + a % 60; 
}

function DateToString(a){
    const dateObj = new Date(a);
    value = dateObj.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", "");

    return value;
}

document.getElementById("boutton_Gestion_partie_active").addEventListener("click", () => {
    window.location.href = "/admin/gestion-partie";
})

document.getElementById("boutton_pannel_admin").addEventListener("click", () => {
    window.location.href = "/admin/pannel"
})


async function remplirListePartie() {
    const tableau = document.getElementById("liste_partie");

    try {
        const response = await fetch('/api/game/partie/desc', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();

            // Vérifier si data est un tableau
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("Aucune partie trouvée !");
                tableau.innerText = "Aucune parties";
                return;
            }

            // Définir les colonnes à afficher (sans idmissionEtat)
            const colonnesAAfficher = ["idgame", "idscenario", "dateCreation", "idequipe", "duree"];

            // Vider le tableau avant d'ajouter du contenu
            tableau.innerHTML = "";

            // Créer l'en-tête du tableau (TH)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");

            const headersTraduit = {
                "idgame": "Partie",
                "idscenario": "Scénario",
                "dateCreation": "Date",
                "idequipe": "Équipe",
                "actif": "Actif",
                "terminee": "Terminée",
                "duree": "Durée"
            };

            colonnesAAfficher.forEach(key => {
                const th = document.createElement("th");
                th.textContent = headersTraduit[key] || key;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            tableau.appendChild(thead);

            // Ajouter les données (TD)
            const tbody = document.createElement("tbody");

            data.forEach(partie => {
                const dataRow = document.createElement("tr");

                colonnesAAfficher.forEach(key => {
                    const td = document.createElement("td");

                    let value = partie[key];

                    // Convertir la date au format JJ/MM/YYYY HH:MM
                    if (key === "dateCreation") {
                        value = DateToString(value)  // Supprime la virgule
                    }

                    if (key == "duree" && value == null) {
                        value = "Partie non terminée";
                    }
                    else if (key == "duree" && value == undefined) {
                        value = "Erreur";
                    }
                    else if (key == "duree" && value == -1) {
                        value = "+60min"
                    } else if (key == "duree") {
                        value = SecondeVersTemps(value);
                    }

                    // Convertir booléens en Oui / Non
                    if (typeof value === "boolean") {
                        value = value ? "Oui" : "Non";
                    }

                    td.textContent = value;
                    dataRow.appendChild(td);
                });

                tbody.appendChild(dataRow);
            });

            tableau.appendChild(tbody);

        } else {
            tableau.innerText = "Erreur de la récuperation des parties";
        }
    } catch (error) {
        tableau.innerText = "Erreur serveur";
    }
}

async function remplirListeReservation() {
    const tableau = document.getElementById("liste_reservation");

    try {
        const response = await fetch('/api/game/reservation/desc', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();

            // Vérifier si data est un tableau
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("Aucune partie trouvée !");
                tableau.innerText = "Aucune Réservations";
                return;
            }

            // Définir les colonnes à afficher (sans idmissionEtat)
            const colonnesAAfficher = ["idreservation", "date", "utilisateur", "salle", "equipe"];

            // Vider le tableau avant d'ajouter du contenu
            tableau.innerHTML = "";

            // Créer l'en-tête du tableau (TH)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");

            const headersTraduit = {
                "idreservation": "Reservation",
                "date": "Date",
                "equipe": "Équipe",
                "salle": "Salle",
                "utilisateur": "Utilisateur"
            };

            colonnesAAfficher.forEach(key => {
                const th = document.createElement("th");
                th.textContent = headersTraduit[key] || key;
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            tableau.appendChild(thead);

            // Ajouter les données (TD)
            const tbody = document.createElement("tbody");

            data.forEach(partie => {
                const dataRow = document.createElement("tr");

                colonnesAAfficher.forEach(key => {
                    const td = document.createElement("td");

                    let value = partie[key];

                    // Convertir la date au format JJ/MM/YYYY HH:MM
                    if (key === "date") {
                        value = DateToString(value); // Supprime la virgule
                    }

                    // Convertir booléens en Oui / Non
                    if (typeof value === "boolean") {
                        value = value ? "Oui" : "Non";
                    }

                    td.textContent = value;
                    dataRow.appendChild(td);
                });

                tbody.appendChild(dataRow);
            });

            tableau.appendChild(tbody);

        } else {
            tableau.innerText = "Erreur de la récuperation des parties";
        }
    } catch (error) {
        tableau.innerText = "Erreur serveur";
    }
}

async function afficherDernierePartie() {
    try {
        const reponse = await fetch('/api/game/partie/finie', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (reponse.ok) {
            const data = (await reponse.json());

            console.log(data);


            if(data == undefined){
                document.getElementById("para_Etat_derniere_partie").innerHTML = "Aucunes parties";
                return;
            }

            

            dateDepart = DateToString(data.dateDepart);
            dateCreation = DateToString(data.dateCreation);

            valeurDuree = "";


            console.log(data.duree);

            if( data.duree == null){
                valeurDuree = "Partie non terminée";
            }
            else if (data.duree == undefined) {
                valeurDuree = "erreur";
            }
            else if (data.duree == -1) {
                valeurDuree = "+60min"
            } else {
                valeurDuree = SecondeVersTemps(data.duree);
            }

            console.log(valeurDuree)



            text = `
            <ul>
            <li><strong>ID Game:</strong> ${data.idgame}</li>
            <li><strong>ID Mission Etat:</strong> ${data.idmissionEtat}</li> 
            <li><strong>ID Scenario:</strong> ${data.idscenario}</li>
            <li><strong>Date Creation:</strong>  ${dateCreation}</li>
            <li><strong>Date Depart: </strong> ${dateDepart}</li>
            <li><strong>ID Equipe:</strong> ${data.idequipe} </li>
            <li><strong>Duree:&nbsp;</strong> ${valeurDuree}</li>
            </ul>
            `;

            document.getElementById("para_Etat_derniere_partie").innerHTML = text;
        } else {

            console.log("erreur");
        }
    }
    catch (error) {
        console.log("erreur");
    }
}


async function afficherPartieActive(){
    try {
        
        const reponse = await fetch('/api/game/partie/active', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (reponse.ok){

            data = (await reponse.json())[0];

            console.log(data)

            if(data == null || data.length == 0){
                document.getElementById("para_Etat_partie_active").innerHTML = "Aucune partie active";
                return;
            }


            if(data.dateDepart == null){
                dateDepart = "Pas de départ";
            }else dateDepart = DateToString(data.dateDepart);

            text = `
            <ul>
            <li><strong>ID Game:</strong> ${data.idgame}</li>
            <li><strong>ID Mission Etat:</strong> ${data.idmissionEtat}</li> 
            <li><strong>ID Scenario:</strong> ${data.idscenario}</li>
            <li><strong>Date Depart: </strong> ${dateDepart}</li>
            <li><strong>ID Equipe:</strong> ${data.idequipe} </li>
            </ul>
            `;


            document.getElementById("para_Etat_partie_active").innerHTML = text;
        }else{
            console.log("erreur");
        }

    } catch (error) {
        console.log(error)
    }
}




// Appel de la fonction
remplirListeReservation();
remplirListePartie();
afficherDernierePartie();
afficherPartieActive();
