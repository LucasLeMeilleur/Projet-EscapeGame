function differenceEnSecondes(heure1, heure2) {
    const [h1, m1, s1] = heure1.split(":").map(Number);
    const [h2, m2, s2] = heure2.split(":").map(Number);

    const secondes1 = h1 * 3600 + m1 * 60 + s1;
    const secondes2 = h2 * 3600 + m2 * 60 + s2;

    return Math.abs(secondes2 - secondes1);
}

function getSecondsDifference(fixedTime) {
    const now = new Date();
    const [hours, minutes, seconds] = fixedTime.split(":").map(Number);
    
    const fixedDate = new Date();
    fixedDate.setHours(hours, minutes, seconds, 0);

    let difference = Math.floor((now - fixedDate) / 1000);

    if (difference < 0) {
        difference += 24 * 3600; 
    }
    return difference;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function SecondeVersTemps(a) {

    if(a%60 < 10) return Math.trunc(a / 60) + " : 0" + a % 60;
    else return Math.trunc(a / 60) + " : " + a % 60;
}

function DateToString(a) {
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

async function creerSelectParties() {
    const reponse = await fetch(`/api/game/partie/active`);
    if (!reponse.ok) return;
    const data = await reponse.json();
    let selectPartie = document.getElementById("select_partie_lancee");
    if (!Array.isArray(data) || data.length === 1 || typeof data[0] !== "object") {
        recupererDetailJeu(data[0].idgame);
        return;
    }
    selectPartie.style.display = "block";

    selectPartie.innerHTML = '<option value="">Sélectionnez une partie</option>';

    data.forEach(partie => {
        let option = document.createElement("option");
        option.value = partie.idgame;
        option.textContent = `Partie : ${partie.idgame}`;
        selectPartie.appendChild(option);
    });

    selectPartie.addEventListener("change", function () {
        let selectedId = this.value;
        if (selectedId) {
            recupererDetailJeu(selectedId);
        }
    });
}

async function recupererDetailJeu(a) {

    const reponse1 = await fetch(`/api/game/partie/all/${a}`);

    if (!reponse1.ok) return;


    if (reponse1.headers.get("content-length") <= 25) return;
    
    const data1 = await reponse1.json();
    const dateCreation = DateToString(data1.dateCreation);

    dateDepart = "invalide";
    if (data1.dateDepart != null) dateDepart = DateToString(data1.dateDepart);
   
    textInfoPartie = `
                <ul>
                <li><strong>Salle:</strong> ${data1.salle.nom} - ${data1.salle.ville}</li>
                <li><strong>Date creation et depart:</strong> ${dateCreation} - ${dateDepart}</li> 
                <li><strong>Equipe:</strong> ${data1.equipe.nom} - ${data1.equipe.nombre_joueur} joueurs</li>
                <li><strong>Temps écoulé: </strong> <d id="para_temps_ecoule"> Chargement... </d> </li>
                </ul>`;
    document.getElementById("para_info_partie").innerHTML = textInfoPartie;

    const nombre_mission = data1.scenario.ordre.split(",").length
    textInfoScenario = `
                <ul>
                <li><strong>Nom du scénario:</strong> ${data1.scenario.nom}</li> 
                <li><strong>Nombre mission:</strong> ${nombre_mission}</li>
                <li><strong>Description:</strong> aucune description pour le moment</li>
                </ul>`
    document.getElementById("para_info_scenario").innerHTML = textInfoScenario;


    textInfoMissionActu = `
                <ul>
                <li><strong>Heure debut:</strong> ${data1.missionEtat.heuredebut}</li> 
                <li><strong>Mission:</strong> n°${data1.missionEtat.mission.idmission} - ${data1.missionEtat.mission.nom}</li>
                <li><strong>Temps passé: </strong> <temp id="temp_ecoule_mission">  <temp> </li>
                <li><strong>Temps requis: </strong> ${SecondeVersTemps(data1.missionEtat.mission.tempsRequis)}</li>
                </ul>`;
    document.getElementById("para_info_missionactive").innerHTML = textInfoMissionActu;

    TempEcoule(data1.dateDepart, data1.missionEtat.heuredebut);

    const reponse2 = await fetch('/api/game/missionEtat/historique/' + data1.idgame);
    if (!reponse2.ok) return;

    const data2 = await reponse2.json();
    
    const NombreEtatEnHistorique = data2.length;

    if (NombreEtatEnHistorique <= 1) return document.getElementById("para_info_historique").innerHTML = "Aucune mission en historique";
        
    textHistorique = ""

    for (let i = 0; i < NombreEtatEnHistorique-1; i++) {
        textClasse = "";
        if (i < NombreEtatEnHistorique - 1) textClasse = "liste_historique_mission_separation";
        textHistorique += `
                <h3 class="titre_mission_historique"> Mission N<sup>-${i+1}</sup> </h3>
                <ul class="liste_historique_mission ${textClasse}">
                <li><strong>Heure de début:</strong> ${data2[i].heuredebut}</li> 
                <li><strong>Heure de fin:</strong> ${data2[i].heurefin}</li>
                <li><strong>Mission: </strong> Numéro °${data2[i].mission.idmission} - ${data2[i].mission.nom} <li>
                <li><strong>Temps passé: </strong> ${SecondeVersTemps(differenceEnSecondes(data2[i].heurefin, data2[i].heuredebut))} </li>
                </ul>`;
    }

    document.getElementById("para_info_historique").innerHTML = textHistorique;   
    RefraichissementAutomatique();
}


async function TempEcoule(a, b) {
    a = DateToString(a);
    
    while (true) {
        const maintenant = new Date(); 

        const [jour, mois, annee, heure, minute] = a.split(/[/\s:]/).map(Number);
        const dateAComparer = new Date(annee, mois - 1, jour, heure, minute);
        const diffSeconde = Math.floor((maintenant - dateAComparer) / 1000);

        document.getElementById("temp_ecoule_mission").innerText = SecondeVersTemps(getSecondsDifference(b)) + " secondes"
        if (diffSeconde > 3600) {
            document.getElementById("para_temps_ecoule").innerText = "+60 min";
            break;
        } else {
            document.getElementById("para_temps_ecoule").innerText = SecondeVersTemps(diffSeconde);
        }
        await sleep(500);
    }
}

setInterval(()=>{
    window.location.href = "/admin/gestion-partie"; 
},40000)

creerSelectParties();