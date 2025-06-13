const mqtt = require('mqtt');
const https = require('https');
const axios = require('axios');
const cookie = require('cookie');

const MQTT_BROKER = "mqtt://127.0.0.1";  
const API_URL = "http://127.0.0.1:3000/api";

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

    client.subscribe("activite/reponse", (err) => {
        if (err) {
            console.error("Erreur lors de l'abonnement :", err);
        } else {
            console.log("📡 Abonné à activite/reponse");
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

            const loginResponse = await axios.post(`${API_URL}/user/login`, {
                email: "ss",
                password: "aa"
            }, { withCredentials: true });

            const setCookie = loginResponse.headers["set-cookie"];
            const tokenMatch = setCookie[0].match(/token=([^;]+)/);

            const missionResponse = await axios.post(`${API_URL}/game/missionetat/suivante`, {
                idpartie: idpartie,
                mission: idmission
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
    const message = `{ "mission": ${mission}, "idpartie":${idpartie}  }`;

    client.publish("activer", message, () => {
        console.log(`Partie demarré, message sur activer: ${message}`);
    });
}

function redemarrerMission(idMission) {
    client.publish("redemarrer", JSON.stringify({ mission: idMission }), { retain: true }, () => {
        console.log(`Partie demarré, message sur activer: ${message}`);
    });
}

function voirActivite() {
    return new Promise((resolve, reject) => {
        const responses = [];
        const TIMEOUT_MS = 2000;

        const handleMessage = (topic, message) => {
            if (topic === "activite/reponse") {
                try {
                    const data = JSON.parse(message.toString());
                    responses.push(data);
                    console.log(`📩 Réponse ${responses.length}/3 reçue:`, data);
                } catch (err) {
                    console.error("Erreur de parsing:", err);
                }
            }
        };

        const cleanup = () => {
            clearTimeout(timeout);
            client.removeListener("message", handleMessage);
        };

        const timeout = setTimeout(() => {
            console.warn("⏱️ Timeout après 5 secondes");
            cleanup();
            resolve(responses); 
        }, TIMEOUT_MS);

        client.subscribe("activite/reponse", (err) => {
            if (err) return reject("Erreur d'abonnement à activite/reponse");
            
            client.on("message", handleMessage);

            client.publish("activite/demande", JSON.stringify({ activite: true }), () => {
                console.log("📤 Demande d'activité envoyée");
            });
        });
    });
}

function resetCanaux() {
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
    resetCanaux,
    voirActivite,
    redemarrerMission
};