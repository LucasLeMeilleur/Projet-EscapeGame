import paho.mqtt.client as mqtt
import subprocess  # pour lancer un programme
import json

mission_numero = 3
idpartie = None



# Configuration
BROKER = "172.18.110.112"  # ou l'adresse IP de ton broker MQTT
PORT = 1883
MQTT_Topic_Envoie = "terminer"
MQTT_Topic_Reception = "activer"
MESSAGE_SPECIAL = "lancer_programme"
Programme_URL = "Defis-test.py"


def on_message(client, userdata, msg):
    global idpartie
    try:
        data = json.loads(msg.payload.decode())
        print(data)
        if isinstance(data, dict) and "mission" in data and "idpartie" in data:
            mission = data["mission"]
            idp = data["idpartie"]

            if mission == mission_numero:
                print(f"Activation reçue pour mission {mission_numero}, lancement du programme...")
                idpartie = idp
                print("Message spécial reçu, lancement du programme...")
                
                process = subprocess.run(["python3", Programme_URL])

                if process.returncode == 0:
                    print("Programme terminé avec succès. Envoi du message MQTT de fin.")
                    envoyer_terminaison(idpartie)
                else:
                    print("Erreur lors de l'exécution du programme.")
                    envoyer_terminaison(idpartie)

            else:
                print("Le message reçu n'est pas un dictionnaire valide avec les clés attendues.")

    except json.JSONDecodeError:
        print("Erreur de décodage du message JSON")




# Callback connexion
def on_connect(client, userdata, flags, rc, properties):
    print(f"Connecté avec le code {rc}")
    client.subscribe(MQTT_Topic_Reception)



def envoyer_terminaison(idpartie):
    message = json.dumps({ "mission": mission_numero,"idpartie": idpartie})
    client.publish(MQTT_Topic_Envoie, message, qos=2)
    print(f"Message envoyé sur {MQTT_Topic_Envoie} : {message}")


# Initialisation du client MQTT
client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
client.on_connect = on_connect
client.on_message = on_message

# Connexion et boucle
client.connect(BROKER, PORT, 60)
client.loop_forever()
