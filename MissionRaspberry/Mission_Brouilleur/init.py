import RPi.GPIO as GPIO
import time
import os
import numpy
import Keypad 
# Definition des pins.
global R1, R2, R3, R4, LedV, A, B, C, D, Reponse, Bonne_Reponse
A = B = C = D = 0
Vrai = 38
Faux= 40
R1 = 31
R2 = 33
R3 = 35
R4 = 37
RV = 29
Go = 36
LA = 22
LB = 24
LC = 26
LD = 18
LV = 32

# Definition des variables.
Reponse = "N"
Bonne_Reponse = ""
BR=0
Nbre_Rep=0
M=(1,2,3,4,5,6,7,8,9,10,11,13)

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
GPIO.setup(Vrai, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(Faux, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(Go, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(R1, GPIO.OUT)
GPIO.setup(R2, GPIO.OUT)
GPIO.setup(R3, GPIO.OUT)
GPIO.setup(R4, GPIO.OUT)
GPIO.setup(RV, GPIO.OUT)
GPIO.setup(LA, GPIO.OUT)
GPIO.setup(LB, GPIO.OUT)
GPIO.setup(LC, GPIO.OUT)
GPIO.setup(LD, GPIO.OUT)
GPIO.setup(LV, GPIO.OUT)

GPIO.cleanup()     