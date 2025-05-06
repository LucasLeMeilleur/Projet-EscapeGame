function SecondeVersTemps(a) {

    if(a%60 < 10) return Math.trunc(a / 60) + " : 0" + a % 60;
    else return Math.trunc(a / 60) + " : " + a % 60;
}

async function loadScoreboard() {
    try {
        const response = await fetch('/api/game/partie/scoreboard');
        const data = await response.json();
        const tbody = document.querySelector("#scoreboard tbody");
        tbody.innerHTML = ""; 
        data.forEach((game,index) => {
            const row = document.createElement("tr");
            const dateDepart = game.dateDepart ? game.dateDepart.split("T")[0] : "N/A";

            row.innerHTML = `
                <td>${index + 1}e</td>
                <td>${game.scenario.nom}</td>
                <td>${game.equipe.nom}</td>
                <td>${SecondeVersTemps(game.duree)}</td>
                <td>${dateDepart}</td>
            `;

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Erreur lors du chargement du scoreboard :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadScoreboard);
