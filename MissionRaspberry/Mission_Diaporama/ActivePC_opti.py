import time
import os
import RPi.GPIO as GPIO
import MFRC522
import pyautogui
import subprocess
import threading
import atexit
import paho.mqtt.client as mqtt
import json



mission_numero = 2
idpartie = None

# Initialisation des GPIO
GPIO.setmode(GPIO.BOARD)
LED1, LED2, LED3, LEDV = 16, 18, 37, 32
BOUTON, BOUTON2 = 15, 7
GPIO.setup([LED1, LED2, LED3, LEDV], GPIO.OUT)
GPIO.setup([BOUTON, BOUTON2], GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# bypass le if
bypass = True

# réglée le fail safe de pyautogui
pyautogui.FAILSAFE = True
pyautogui.FAILSAFE_POINTS = [(1000, 1030)]

# Definition des Badges Valides
BADGES = {
    'Badge1': [73, 97, 3, 227],
    'Badge2': [35, 206, 160, 2],
    'Badge3': [9, 171, 2, 229]
}

# Creation des objets de lecture RFID
lecteurs = [MFRC522.MFRC522(1,0), MFRC522.MFRC522(1,1), MFRC522.MFRC522(1,2)]


def read_rfid(lecteur):
    """ Lit un badge RFID et retourne l'UID s'il est detecte """
    status, TagType = lecteur.MFRC522_Request(lecteur.PICC_REQIDL)
    if status != lecteur.MI_OK:
        return None
    status, uid = lecteur.MFRC522_Anticoll()
    if status != lecteur.MI_OK:
        return None
    return uid

def check_badge(uid):
    """ Verifie si l'UID correspond a un badge valide """
    for badge, valid_uid in BADGES.items():
        if uid[:4] == valid_uid:
            return badge
    return None

def mission1():
    print("start mission 1")
    
    """ Fonction principale de la mission 1 """
    
    # Lancer la presentation
    subprocess.Popen(['okular',  '--presentation',  '--page',  '1',  '/home/pi/Desktop/Fichier/presentation.pdf'])

    # Demarrage de la boucle de lecture des badges
    button_pressed = 0
    fin_diapo = False
    while True:
        
        badges_detectes = [None, None, None]
        for i, lecteur in enumerate(lecteurs):
            uid = read_rfid(lecteur)
            if uid:
                badge = check_badge(uid)
                if badge:
                    print(f"Badge {badge} detecte sur la carte {i+1}")
                    GPIO.output([LED1, LED2, LED3][i], 1)
                    badges_detectes[i] = badge
                else:
                    print(f"Badge non reconnu sur la carte {i+1}")
                    GPIO.output([LED1, LED2, LED3][i], 0)
        
        # if all(badges_detectes):

        if bypass:
            print("PC Activé")
            GPIO.output(LEDV, 0)
            pyautogui.click(1000, 1030)  # Cliquer pour activer la presentation
            print("Diapo affiché")
            print(idpartie)
            envoyer_terminaison(idpartie)
            print("Terminaison envoyé")
            while not fin_diapo:
                if button_pressed == 4:
                    fin_diapo = True
                    print("Lancement de la mission 2")
                if GPIO.input(BOUTON) == 1:
                    print("Bouton 1 appuyé")
                    pyautogui.press('right')
                    #button_pressed += 1
                    time.sleep(0.1)
                if GPIO.input(BOUTON2) == 1:
                    print("Bouton 2 appuyé")
                    pyautogui.press('left')
                    # button_pressed -= 1
                    time.sleep(0.1)
        else:
            print("PC Vérouillé")
            GPIO.output(LEDV, 1)

# if __name__ == '__main__':
#     try:
#         mission1()
#     except KeyboardInterrupt:
#         GPIO.cleanup()

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
    print(message)
    result = clientMQTT.publish(MQTT_Topic_Envoie, message, qos=2)
    print(f"Message envoyé sur {MQTT_Topic_Envoie} : {message}")



def on_message(client, userdata, msg):
    global idpartie
    try:
        data = json.loads(msg.payload.decode())
        print(data)

        # Vérification si 'data' est bien un dictionnaire
        if isinstance(data, dict) and "mission" in data and "idpartie" in data:
            mission = data["mission"]
            idp = data["idpartie"]

            if mission == mission_numero:
                print(f"Activation reçue pour mission {mission_numero}, lancement du programme...")
                idpartie = idp
                print("Lancé")
                thread = threading.Thread(target=mission1, daemon=True)
                thread.start()
        else:
            print("Le message reçu n'est pas un dictionnaire valide avec les clés attendues.")
    except json.JSONDecodeError:
        print("Erreur de décodage du message JSON")



def on_publish(client, userdata, mid):
    print(f"? MQTT: Message publié avec mid = {mid}")

clientMQTT = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
clientMQTT.on_connect = on_connect
clientMQTT.on_message = on_message
clientMQTT.on_publish = on_publish

clientMQTT.connect(MQTT_Broker, MQTT_Port, 120)
clientMQTT.loop_forever()