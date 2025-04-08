const mqtt = require('mqtt');
const https = require('https');
const axios = require('axios');
const cookie = require('cookie');

const MQTT_BROKER = "mqtt://127.0.0.1";  // Adresse du broker
const API_URL = "http://127.0.0.1:3000/api"; // Adresse de l'API

// Connexion au broker MQTT
const client = mqtt.connect(MQTT_BROKER, {
    rejectUnauthorized: false,
});


client.on("connect", () => {
    console.log("✅ Connecté au broker MQTT(s) !");

    client.subscribe('terminer', function (err) {
        if (err) {
            console.log('Erreur de souscription:', err);
        } else {
            console.log('Souscription réussie');
        }
    });
});


client.on("message", async (topic, message) => {

    if (topic === "terminer") {

        try {

            const messageRecu = JSON.parse(message.toString());
            const idpartie = messageRecu.idpartie;
            const idmission = messageRecu.mission;


            if (!idpartie || !idmission) return;


            // 1️⃣ Faire une requête POST à /login
            const loginResponse = await axios.post(`${API_URL}/user/login`, {
                email: "ss",
                password: "aa"
            }, { withCredentials: true });

            const setCookie = loginResponse.headers["set-cookie"];
            const tokenMatch = setCookie[0].match(/token=([^;]+)/);


            // 2️⃣ Faire une requête POST à /game/missionsuivante

            const missionResponse = await axios.post(`${API_URL}/game/missionetat/suivante`, {
                idpartie: idpartie,
                mission: idmission // Corrige la variable 'mission'
            }, {
                headers: { Cookie: `token=${tokenMatch[1]}` }
            });

            const detailPartie = await axios.get(`${API_URL}/game/partie/all/${idpartie}`);
            const numeroMission = detailPartie.data.missionEtat.idmission;
            if (!detailPartie.data.terminee) EnvoyerMessage(`{ "mission":${numeroMission}, "idpartie": ${idpartie} }`);

            console.log("🚀 Mission suivante exécutée");
        } catch (error) {
            console.log(error)
        }

    }
});



function EnvoyerMessage(message) {

    client.publish('activer', message, { retain: false, qos: 2 }, function (err) {
        if (err) {
            console.log('Erreur de publication:', err);
        } else {
            console.log('Message publié avec succès');
        }
    });
}

function demarrerPartie(mission, idpartie) {

    console.log("lancé");


    const message = `{ "mission": ${mission}, "idpartie":${idpartie}  }`;

    client.publish("activer", message, () => {
        console.log(`Partie demarré, message sur activer: ${message}`);
    });
}

function resetCanaux() {

    console.log("Reset")
    const message = `0`;

    client.publish("activer", message, { retain: true }, () => {
        console.log(`Partie demarré, message sur activer: ${message}`);
    });

    client.publish("terminer", message, { retain: true }, () => {
        console.log(`Partie demarré, message sur activer: ${message}`);
    });
}




module.exports = {
    demarrerPartie,
    resetCanaux
};


