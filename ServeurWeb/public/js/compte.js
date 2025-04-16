function formatDateFr(isoString) {
    const date = new Date(isoString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Paris'
    };

    return date.toLocaleString('fr-FR', options);
}


// Récupération des données utilisateur
fetch('/api/user/perso')
    .then(res => res.json())
    .then(data => {
        document.getElementById('email').textContent = data.email;
        document.getElementById('pseudo').textContent = data.username;
    })
    .catch(() => {
        document.getElementById('user-info').innerHTML = "<p>Impossible de charger les infos utilisateur.</p>";
    });

// Récupération des réservations
fetch('/api/game/reservation/perso')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('reservation-list');
        container.innerHTML = '';

        if (data.length === 0) {
            container.textContent = 'Aucune réservation.';
            return;
        }

        data.forEach(reservation => {
            const div = document.createElement('div');
            div.className = 'reservation-item';
            div.innerHTML = `
            <strong>Réservation :</strong> ${reservation.titre || 'Sans titre'}<br>
            <strong>Date :</strong> ${formatDateFr(reservation.date) || 'Non précisée'}
        `;
            container.appendChild(div);
        });
    })
    .catch(() => {
        document.getElementById('reservation-list').textContent = "Erreur lors du chargement des réservations.";
    });

// Gestion du changement de mot de passe
document.getElementById('submit-password').addEventListener('click', function () {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const messageDiv = document.getElementById('password-message');

    console.log('Requête envoyée :', {
        oldPassword,
        newPassword
    });

    fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erreur');
        return res.json();
    })
    .then(data => {
        messageDiv.textContent = "Mot de passe modifié avec succès.";
        messageDiv.style.color = "#66ffb3";
        document.getElementById('change-password-form').reset();
    })
    .catch(() => {
        messageDiv.textContent = "Erreur lors de la modification.";
        messageDiv.style.color = "#ff6666";
    });
});
