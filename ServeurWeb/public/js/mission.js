async function chargerMissions() {
    try {
        const response = await fetch('/api/game/mission/liste');
        const missions = await response.json();

        const select = document.getElementById('missionSelect');
        select.innerHTML = ''; 
    
        missions.forEach(mission => {
            const option = document.createElement('option');
            option.value = mission.idmission;
            option.textContent = mission.nom || `Mission ${mission.id}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur de chargement des missions :', error);
        const select = document.getElementById('missionSelect');
        select.innerHTML = '<option disabled>Erreur lors du chargement</option>';
    }
}

document.getElementById('startMissionBtn').addEventListener('click', async () => {
    const select = document.getElementById('missionSelect');
    const missionId = select.value;

    if (!missionId) {
        alert('Veuillez sélectionner une mission.');
        return;
    }

    try {
        const response = await fetch('/api/game/mission/demarrer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mission: missionId })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Mission démarrée avec succès !');
        } else {
            alert('Erreur : ' + result.message);
        }
    } catch (error) {
        console.error('Erreur lors du démarrage de la mission :', error);
        alert('Une erreur est survenue lors du démarrage.');
    }
});

async function afficherToutesLesMissions() {
    const container = document.getElementById('missions-container');
    container.innerHTML = ''; // Nettoyer l'affichage

    // 🟡 Déclaré ici pour être accessible même dans le catch
    const etatsMissions = {};

    try {
        // 1. On récupère toutes les missions
        const response = await fetch('/api/game/mission/liste');
        const missions = await response.json();

        missions.forEach(mission => {
            const missionDiv = document.createElement('div');
            missionDiv.style.marginBottom = '8px';
            missionDiv.style.display = 'flex';
            missionDiv.style.alignItems = 'center';

            const etatSpan = document.createElement('span');
            etatSpan.textContent = '⏳'; // En attente
            etatSpan.style.marginRight = '8px';

            const missionLabel = document.createElement('span');
            missionLabel.textContent = mission.nom || `Mission ${mission.idmission}`;
            missionLabel.style.marginRight = '10px';

            const boutonRestart = document.createElement('button');
            boutonRestart.textContent = '🔄';
            boutonRestart.title = 'Redémarrer la mission';

            boutonRestart.addEventListener('click', () => {
                fetch(`/api/game/mission/redemarrer/${mission.idmission}`, {
                    method: 'POST',
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Redémarrage échoué');
                        return response.json();
                    })
                    .then(data => {
                        console.log(`Mission ${mission.idmission} redémarrée`, data);
                    })
                    .catch(err => console.error('Erreur redémarrage :', err));
            });

            missionDiv.appendChild(etatSpan);
            missionDiv.appendChild(missionLabel);
            missionDiv.appendChild(boutonRestart);
            container.appendChild(missionDiv);

            // Stocker le span pour mise à jour plus tard
            etatsMissions[mission.idmission] = etatSpan;
        });

        // 3. Récupérer les statuts de connexion et les appliquer
        const activiteResponse = await fetch('/api/game/mission/activite');
        const activiteData = await activiteResponse.json();

        activiteData.message.forEach(m => {
            const span = etatsMissions[m.idmission || m.mission];
            if (span) {
                span.textContent = m.connecte ? '✅' : '❌';
            }
        });

    } catch (error) {
        console.error('Erreur lors du chargement ou de la mise à jour des missions :', error);
        // Si une erreur survient, afficher ❌ pour tous ceux déjà affichés
        for (const id in etatsMissions) {
            etatsMissions[id].textContent = '❌';
        }
    }
}

document.addEventListener('DOMContentLoaded', afficherToutesLesMissions);
document.addEventListener('DOMContentLoaded', chargerMissions);