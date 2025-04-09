import RPi.GPIO as GPIO
import time
import os
import numpy
import Keypad
import paho.mqtt.client as mqtt
import threading
import signal
import sys


def on_message(client, userdata, message):
    print("Received message on topic:", message.topic)
    print("Message payload:", message.payload.decode())
    if message.topic == "mission4" and message.payload.decode()=="start":

        print("start de la mission "+message.topic[-1])
        mission4_thread = threading.Thread(target=mission4)
        mission4_thread.start()
    if message.topic == "mission4" and message.payload.decode()=="stop":
      client.publish("mission4", "fin")

client = mqtt.Client(client_id="clientmission3",callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
client.on_message = on_message
client.connect("172.18.110.112", 1883)
client.loop_start()
client.subscribe("mission4")
client.publish("mission4", "on")
# Definition des pins.

def mission4():
    global R1, R2, R3, R4, LedV, A, B, C, D, Reponse, Bonne_Reponse, C_1, C_2, C_3, C_4
    A = B = C = D = 0
    Vrai = 38
    Faux= 40

    R1 = 31
    R2 = 33
    R3 = 35
    RV = 37

    Go = 36

    LA = 22
    LB = 24
    LC = 26
    LV = 18

    C1 = 8
    C2 = 23
    C3 = 12
    C4 = 16
    CV = 10

    FV = 32
    BF = 29

    # Definition des variables.
    Reponse = "N"
    Bonne_Reponse = ""
    BR=0
    Nbre_Rep=0
    M=(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66)

    ROWS = 4        # number of rows of the Keypad
    COLS = 4        #number of columns of the Keypad
    keys =  [   '1','2','3','A',    #key code
                '4','5','6','B',
                '7','8','9','C',
                '*','0','#','D'     ]
    colsPins = [11,7,5,3]        #connect to the row pinouts of the keypad
    rowsPins = [21,19,15,13]        #connect to the column pinouts of the keypad

    # Definition des pins en entree / sortie
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(Go, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    GPIO.setup(C1, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(C2, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(C3, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(C4, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(CV, GPIO.OUT)

    GPIO.setup(Vrai, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(Faux, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(R1, GPIO.OUT)
    GPIO.setup(R2, GPIO.OUT)
    GPIO.setup(R3, GPIO.OUT)
    GPIO.setup(RV, GPIO.OUT)

    GPIO.setup(LA, GPIO.OUT)
    GPIO.setup(LB, GPIO.OUT)
    GPIO.setup(LC, GPIO.OUT)
    GPIO.setup(LV, GPIO.OUT)

    GPIO.setup(FV, GPIO.OUT)
    GPIO.setup(BF, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)

    def selectQuest(M):
      return numpy.random.choice(M, 4, False)

    def Question():
        global Q
        Q = selectQuest(M)


    def Lire_Reponse(channel):
        global Reponse
        if Reponse == "N":
            if channel == 38:
                Reponse = "V"
            else:
                Reponse = "F"

    def Vrai_Reponse(self):
        global Bonne_Reponse
        if (Q[self]%2) == 0:
            Bonne_Reponse = "F"
        else:
            Bonne_Reponse = "V"



    def Allume_Led(self):
        if self>=1:
            GPIO.output(R1,1)
            if self>=2:
                GPIO.output(R2,1)
                if self>=3:
                    GPIO.output(R3,1)

        else:
            GPIO.output(R1,0)
            GPIO.output(R2,0)
            GPIO.output(R3,0)
            GPIO.output(RV,0)

    def Clignote_Led(s1,s2,s3,s4):
         Etat = ( [1,0,0,0],
                  [0,1,0,0],
                  [0,0,1,0],
                  [0,0,0,1],
                  [0,0,0,0],
                  [1,0,0,0],
                  [1,1,0,0],
                  [1,1,1,0],
                  [1,1,1,1],
                  [1,1,1,1],
                  [0,0,0,0],
                  [1,1,1,1],
                  [0,0,0,0])

         for J in range (0,13):
                GPIO.output(s1,Etat[J][0])
                GPIO.output(s2,Etat[J][1])
                GPIO.output(s3,Etat[J][2])
                GPIO.output(s4,Etat[J][3])
                time.sleep(0.5)


    def Defi_1():   # ANCRE
        try :

            os.system("omxplayer crane.mp3")
            time.sleep(4)
            while True:
                C_1= GPIO.input(C1)
                C_2= GPIO.input(C2)
                C_3= GPIO.input(C3)
                C_4= GPIO.input(C4)
                print("C1=",C_1)
                print("C2=",C_2)
                print("C3=",C_3)
                print("C4=",C_4)
                if C_1 and C_2 and C_3 and C_4 == 1:
                      GPIO.output(CV,1)
                      os.system("omxplayer Bravo_Def1.mp3")
                      time.sleep(5)
                      return()
                else :
                      time.sleep(2)
        except KeyboardInterrupt:  #When 'Ctrl+C' is pressed, exit the program.
            GPIO.cleanup()
            exit()


    def Defi_2():
        try:
            global Reponse
            #Clignote_Led(R1,R2,R3,R4,RV)
            os.system("omxplayer Defi2.mp3")
            Nbre_question = 0
            #Allume_Led(Nbre_question)
            Question()
            while True:
                     Q_A_P = str(Q[Nbre_question])+".mp3"
                     print("Question à poser:", Q_A_P)
                     Vrai_Reponse(Nbre_question)
                     print ("Bonne réponse", Bonne_Reponse)
                     os.system("omxplayer "+Q_A_P)
                     time.sleep(2)
                     if Reponse !="N":
                         if Reponse == Bonne_Reponse:
                            print ("Bravo")
                            Nbre_question += 1
                            Allume_Led(Nbre_question)
                            os.system("omxplayer Bonne_Rep.mp3")
                            #Nbre_question += 1
                            print(Nbre_question)
                            if Nbre_question ==4:
                                GPIO.output(RV,1)
                                os.system("omxplayer Bravo_Def2.mp3")
                                time.sleep(3)
                                return()
                            else:
                                Reponse = "N"

                         else:
                            Reponse = "N"
                            print ("Désolé! Mauvaise réponse")
                            os.system("omxplayer Desole.mp3")
                            Nbre_question = 0
                            Allume_Led(Nbre_question)
                            Question()
                     else:
                            print ("Désolé! Le temps est écoulé")
                            os.system("omxplayer Temps_ecoule.mp3")
                            i = 0
                            Reponse = "N"
                            Nbre_question = 0
                            Allume_Led(i)
                            Question()
        except KeyboardInterrupt:
            GPIO.cleanup()
            exit()




    def Defi_3():  #A=6, B=10, C=18, D=33
        try:
            global A, B, C, D
            #Clignote_Led(LA,LB,LC,LD,LV)
            os.system("omxplayer Defi3.mp3")
            keypad = Keypad.Keypad(keys,rowsPins,colsPins,ROWS,COLS)    #creat Keypad object
            keypad.setDebounceTime(50)      #set the debounce time
            seq = []
            while(True):
                key = keypad.getKey()
                if(key != keypad.NULL):
                    seq.append(key)
                    time.sleep(.4)
                    print (seq)
                    if key == "#":
                        print(seq)
                        if seq == ['A', '6', '#']:
                            print ("bravo tu as trouvé la valeur de A")
                            GPIO.output(LA,1)
                            A = 1
                        if seq == ['B', '1', '0','#']:
                            print ("bravo tu as trouvé la valeur de B")
                            GPIO.output(LB,1)
                            B = 1
                        if seq == ['C', '1', '8', '#']:
                            print ("bravo tu as trouvé la valeur de C")
                            GPIO.output(LC,1)
                            C = 1
                        if seq == ['D', '3', '3', '#']:
                            print ("bravo tu as trouvé la valeur de D")
                            D = 1
                        if A and B and C and D == 1:
                            print ("Excellent tu as trouvé toutes les valeurs")
                            GPIO.output(LV,1)
                            time.sleep(2)
                            return()
                            exit()
                        else:
                            seq = []



        except KeyboardInterrupt:
            GPIO.cleanup()
            exit()


    GPIO.add_event_detect(Vrai, GPIO.RISING, callback=Lire_Reponse)
    GPIO.add_event_detect(Faux, GPIO.RISING, callback=Lire_Reponse)

    try:
         while True:
             G = GPIO.input(Go)
             GPIO.output(R1,0)
             GPIO.output(R2,0)
             GPIO.output(R3,0)
             GPIO.output(RV,0)
             GPIO.output(LA,0)
             GPIO.output(LB,0)
             GPIO.output(LC,0)
             GPIO.output(LV,0)
             #GPIO.output(CR,0)
             GPIO.output(CV,0)
             if G == 1:
                os.system("omxplayer Intro1.mp3")
                time.sleep(2)
                os.system("omxplayer Intro.mp3")
                time.sleep(2)
                Defi_1() #ANCRE  
                Defi_2()
                Defi_3() #A=6, B=10, C=18, D=33
                os.system("omxplayer Desamorcer.mp3")
                print( " Pour désamorcer le brouilleur appuyez maintenant sur le bouton Vert")
                while True:
                    Bouton_Final = GPIO.input(BF)
                    if Bouton_Final == 1:
                        Clignote_Led(CV,RV,LV,FV)
                        Clignote_Led(CV,RV,LV,FV)
                        os.system("omxplayer BravoBrouilleur.mp3")
                        print( " Bravo le Brouilleur est maintenant neutralisé")
                        client.publish("mission4", "stop")
                        exit()
             else:
                time.sleep(2)
                print('programme en pause')

    except KeyboardInterrupt:  #Appuyer sur 'Ctrl+C' pour arreter le programme.

        GPIO.cleanup()