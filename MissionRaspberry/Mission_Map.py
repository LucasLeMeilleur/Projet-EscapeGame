import time
import RPi.GPIO as GPIO
from mfrc522 import MFRC522
import paho.mqtt.client as mqtt
import threading
import signal
import sys
import ssl
import json

mission_numero = 1
idpartie = None



# Déclare les IUD des Badges Valides.
#Badge1 = [180, 81, 216, 36]
#Badge2 = [68, 171, 221, 36]

Badge1 = [68, 171, 221, 36] # Xi-han
Badge2 = [180, 81, 216, 36] # Brazilia
Badge3 = [171, 3, 98, 44] # Otawa

# Déclare les Pins des LED de chaque Carte.
LED1 = 16
LED2 = 18
LED3 = 37
LEDV = 32
GPIO.setmode(GPIO.BOARD)

# Crée un objet pour chaque carte 
Lecteurs = [MFRC522(1, 0), MFRC522(1, 1), MFRC522(1, 2)]
Badges = [Badge1, Badge2, Badge3]
LEDs = [LED1, LED2, LED3]
L = [0, 0, 0]

# Welcome message
print("Recherche de Badges")
print("Appuyer sur Ctrl-C pour arrêter le programme.")

def check_badge(Lecteur, Badge, LED, index):
    # Scan de la carte
    (status, TagType) = Lecteur.MFRC522_Request(Lecteur.PICC_REQIDL)

    # Filtre les données pour récupérer son IUD 
    (status, uid) = Lecteur.MFRC522_Anticoll()

    # Si un IUD a été récupéré
    if status == Lecteur.MI_OK:
        print(f"Badge détecté sur la carte {index + 1}")
        print("UID: " + ",".join(str(x) for x in uid))
        
        # Teste si le badge est autorisé
        if uid[:4] == Badge:
            print(f"Badge Autorisé en position {index + 1}")
            GPIO.output(LED, 1)
            L[index] = 1
        else:
            print(f"Badge non reconnu par le lecteur {index + 1}")
            GPIO.output(LED, 0)
            L[index] = 0

# Cette boucle vérifie les badges sur chaque lecteur

def DebutPartie():
    try:
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(LED1, GPIO.OUT)
        GPIO.setup(LED2, GPIO.OUT)
        GPIO.setup(LED3, GPIO.OUT)
        GPIO.setup(LEDV, GPIO.OUT)

        global L
        L = [0, 0, 0]

        while True:
            # Parcours des lecteurs
            for i, Lecteur in enumerate(Lecteurs):
                check_badge(Lecteur, Badges[i], LEDs[i], i)
            
            # Vérifie si tous les badges sont validés
            if all(L):
                print("Porte ouverte")
                GPIO.output(LEDV, 1)
                time.sleep(0.1)
                GPIO.output(LEDV, 0)
                GPIO.cleanup()
                print("Porte ouverte")
                envoyer_terminaison(idpartie)
                break
                #L = [0, 0, 0]
                #time.sleep(15)
            else:
                GPIO.output(LEDV, 0)

    except KeyboardInterrupt:
        GPIO.cleanup()



########################################################
############# PARTIE MQTT ##############################
########################################################




#CLIENT MQTT

MQTT_Broker = "172.18.110.112"
MQTT_Port = 1883
MQTT_Topic_Reception = "activer"
MQTT_Topic_Envoie = "terminer"

def on_connect(client, userdata, flags, rc, properties):
    print(f"Connecté avec le code {rc}")
    client.subscribe(MQTT_Topic_Reception)


def envoyer_terminaison(idpartie):
    message = json.dumps({ "mission": mission_numero,"idpartie": idpartie})
    clientMQTT.publish(MQTT_Topic_Envoie, message, qos=2)
    print(f"Message envoyé sur {MQTT_Topic_Envoie} : {message}")

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
                DebutPartie()
            else:
                print("Le message reçu n'est pas un dictionnaire valide avec les clés attendues.")
    except json.JSONDecodeError:
        print("Erreur de décodage du message JSON")

clientMQTT = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
clientMQTT.on_connect = on_connect
clientMQTT.on_message = on_message

clientMQTT.connect(MQTT_Broker, MQTT_Port, 120)
clientMQTT.loop_forever()

