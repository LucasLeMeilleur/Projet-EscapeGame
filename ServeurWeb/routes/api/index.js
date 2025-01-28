const express = require('express');
const router = express.Router();
const user = require('./controller/user');
const object = require('./controller/object');

// Fonctions utile

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Accès non autorisé.' });

    try {
        const decoded = jwt.verify(token, process.env.TokenJWT);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide ou expiré.' });
    }
};

// Middleware de vérification des permissions
const checkPermission = (requiredPermission) => (req, res, next) => {
    if (!req.user || !req.user.permissions.includes(requiredPermission)) {
        return res.status(403).json({ error: 'Permission refusée.' });
    }
    next();
};


// Gestion api game


// GET 

    //Liste
router.get('/game/partie/liste', object.listePartie);
router.get('/game/salle/liste', object.listeSalle);
router.get('/game/scenario/liste', object.listeScenario);
router.get('/game/mission/liste', object.listeMission);
router.get('/game/missionEtat/liste', object.listeMissionEtat);

    //Nombre element
router.get('/game/partie/nombre', object.nombrePartie);
router.get('/game/salle/nombre', object.nombreSalle);
router.get('/game/scenario/nombre', object.nombreScenario);
router.get('/game/mission/nombre', object.nombreMission);
router.get('/game/missionEtat/nombre', object.nombreMissionEtat);


    // Clé RSA
router.get('/key/publickey', (req, res) => {
    res.send({ key: global.keyRSA.getPublicKey() });
});

// GET avec body

router.get('/game/missionEtat/id', object.listeMissionEtatid);
router.get('/game/missionEtat/gameid', object.listeMissionEtatGameid);

// POST

    //Ajouter Element dans table
router.post('/game/partie/ajout', object.AjouterPartie);
router.post('/game/salle/ajout', object.AjouterSalle);
router.post('/game/scenario/ajout', object.AjouterScenar);
router.post('/game/mission/ajout', object.AjouterMission);
router.post('/game/missionetat/ajout', object.AjouterMissionEtat);

router.post('/game/partie/demarrer', object.DemarrerPartie);
router.post('/game/partie/finir', object.FinirPartie);


// Gestion api user


//GET 

router.get('/user/liste', user.listeUser);

//POST

router.post('/user/register', user.regiserUser);
router.post('/user/login', user.loginUser);



module.exports = router;
