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

    client.subscribe('missionsuivante', function (err) {
        if (err) {
            console.log('Erreur de souscription:', err);
        } else {
            console.log('Souscription réussie');
        }
    });
});


client.on("message", async (topic, message) => {

    if (topic === "missionsuivante") {
        const messageRecu = JSON.parse(message.toString());
        const idpartie = messageRecu.idpartie;
        const idmission = messageRecu.mission;

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

        console.log("🚀 Mission suivante exécutée");
    }
});


client.publish('missionsuivante', 'Client initialisé', { qos: 2 }, function (err) {
    if (err) {
        console.log('Erreur de publication:', err);
    } else {
        console.log('Message publié avec succès');
    }
});


module.exports = client;
