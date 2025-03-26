const mqtt = require('mqtt');
const axios = require('axios');
const cookie = require('cookie');

const MQTT_BROKER = "mqtt://localhost";  // Adresse du broker
const API_URL = "http://localhost:3000/api"; // Adresse de l'API

// Connexion au broker MQTT
const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
    console.log("✅ Connecté au broker MQTT !");
    client.subscribe("missionsuivante"); // Écoute du topic
});

// C'est un client

client.on("message", async (topic, message) => {

    // Exemple -- mission-suivant-idgame-1-mission-1

    if (topic === "missionsuivante") {
        console.log("📩 Message reçu : missionsuivante");

        try {
            // 1️⃣ Faire une requête POST à /login
            const loginResponse = await axios.post(`${API_URL}/user/login`, {
                username: "ss",
                password: "aa"
            }, { withCredentials: true });

            // Récupérer le cookie JWT
            const setCookie = loginResponse.headers["set-cookie"];
            if (!setCookie) throw new Error("Aucun cookie JWT reçu");

            const jwtCookie = cookie.parse(setCookie[0])['jwt']; // Adapter au nom du cookie JWT
            console.log("🔑 JWT récupéré :", jwtCookie);

            // 2️⃣ Faire une requête POST à /game/missionsuivante
            const missionResponse = await axios.post(`${API_URL}/game/missionsuivante`, {}, {
                headers: { Cookie: `jwt=${jwtCookie}` }
            });

            console.log("🚀 Mission suivante exécutée :", missionResponse.data);
        } catch (error) {
            console.error("❌ Erreur MQTT :", error.message);
        }
    }
});

module.exports = client;
