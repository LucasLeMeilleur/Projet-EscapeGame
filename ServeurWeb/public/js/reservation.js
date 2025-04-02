async function fetchSalles() {
    const response = await fetch('/api/game/salle/liste');
    const salles = await response.json();
    const selectSalle = document.getElementById('salle');
    salles.forEach(salle => {
        const option = document.createElement('option');
        option.value = salle.idsalle;
        option.textContent = salle.nom;
        selectSalle.appendChild(option);
    });
}

async function fetchReservations() {
    const response = await fetch('/api/game/reservation/liste');
    const reservations = await response.json();
    return reservations.map(res => {
        const dateObj = new Date(res.date);
        return {
            date: dateObj.toISOString().split('T')[0],
            heure: dateObj.toTimeString().slice(0, 5) 
        };
    });
}

async function updateDisponibilites() {
    const reservations = await fetchReservations();
    const inputDate = document.getElementById('date');
    const selectHeure = document.getElementById('heure');
    
    inputDate.addEventListener('change', () => {
        selectHeure.innerHTML = '';
        let heuresRes = reservations.filter(res => res.date === inputDate.value).map(res => res.heure);
        
        for (let h = 8; h <= 18; h++) {
            for (let m = 0; m < 60; m += 60) {
                let heureStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                let option = document.createElement('option');
                option.value = heureStr;
                option.textContent = heureStr;
                if (heuresRes.includes(heureStr)) option.disabled = true;
                selectHeure.appendChild(option);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchSalles();
    await updateDisponibilites();
});

document.getElementById('reservationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    const response = await fetch('/api/game/reservation/ajout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        alert('Réservation réussie !');
    } else {
        alert('Erreur lors de la réservation.');
    }
});



document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("salle").selectedIndex = 0;
    document.getElementById('date').value = '';
});
