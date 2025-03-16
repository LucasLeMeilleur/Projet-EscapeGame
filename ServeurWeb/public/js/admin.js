async function remplirListePartie() {
    const tableau = document.getElementById("liste_partie");

    try {
        const response = await fetch('/api/game/partie/desc', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Vérifier si data est un tableau
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("Aucune partie trouvée !");
                return;
            }

            // Définir les colonnes à afficher (sans idmissionEtat)
            const colonnesAAfficher = ["idgame", "idscenario", "date", "idequipe", "actif", "terminee"];

            // Vider le tableau avant d'ajouter du contenu
            tableau.innerHTML = "";

            // Créer l'en-tête du tableau (TH)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");

            const headersTraduit = {
                "idgame": "Partie",
                "idscenario": "Scénario",
                "date": "Date",
                "idequipe": "Équipe",
                "actif": "Actif",
                "terminee": "Terminée"
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
                        const dateObj = new Date(value);
                        value = dateObj.toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }).replace(",", ""); // Supprime la virgule
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
            console.log(data);

            // Vérifier si data est un tableau
            if (!Array.isArray(data) || data.length === 0) {
                console.warn("Aucune partie trouvée !");
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
                        const dateObj = new Date(value);
                        value = dateObj.toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        }).replace(",", ""); // Supprime la virgule
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

// Appel de la fonction
remplirListeReservation();
remplirListePartie();
