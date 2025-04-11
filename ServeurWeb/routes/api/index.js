const express = require('express');
const router = express.Router();
const user = require('./controller/user');
const object = require('./controller/object');
const jwt = require('jsonwebtoken');

/////////////////////////   Fonctions utile   ///////////////////////// 



// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ error: 'Accès non autorisé.' });

    try {
        const decoded = jwt.verify(token, process.env.TokenJWT);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide ou expiré.' });
    }
};

// 🏗️ Fonction pour générer un token JWT
function generateToken(userId) {
    return jwt.sign(
        { id: userId }, // Payload (infos dans le token)
        secretKey,      // Clé secrète
        { expiresIn: "8h" } // Expiration (8h)
    );
}


function checkPermission(levelRequired) {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(403).render('error/403', { erreur: "Vous n'etes pas connecté" });
        jwt.verify(token, global.JWTToken, (err, decoded) => {
            if (err) return res.status(403).render('error/403', { erreur: "Session invalide, veuillez vous reconnecter." });
            req.user = decoded;
            if (req.user.permission < levelRequired) return res.status(403).render('error/403', { erreur: "Acces interdit" });

            next();
        });
    };
}


// Clé Publique RSA
router.get('/key/publickey', (req, res) => {
    return res.send({ key: global.keyRSA.getPublicKey() });
});
    

/////////////////////////   Gestion api game   ///////////////////////// 


// GET 

    //Liste
router.get('/game/partie/liste', object.listePartie);
router.get('/game/partie/finie', object.dernierePartieFinie);
router.get('/game/partie/active', object.partieActive);
router.get('/game/partie/desc', object.derniereParties);

router.get('/game/salle/liste', object.listeSalle);
router.get('/game/scenario/liste', object.listeScenario);
router.get('/game/mission/liste', object.listeMission);
router.get('/game/missionEtat/liste', object.listeMissionEtat);
router.get('/game/equipe/liste', object.listeEquipe);
router.get('/game/reservation/liste', object.listeReservation);
router.get('/game/reservation/desc', object.dernieresReservation);
router.get('/game/reservation/asc', object.reservationAVenir);

router.get('/game/partie/scoreboard', object.scoreBoard);

    //Nombre element
router.get('/game/partie/nombre', object.nombrePartie);
router.get('/game/salle/nombre', object.nombreSalle);
router.get('/game/scenario/nombre', object.nombreScenario);
router.get('/game/mission/nombre', object.nombreMission);
router.get('/game/missionEtat/nombre', object.nombreMissionEtat);
router.get('/game/equipe/listeNom', object.listeNomEquipe);
router.get('/game/partie/listeReserv', object.listePartieReserve);

router.get('/game/partie/nonlancee', object.obtenirPartieNonlancee);
router.get('/game/partie/all/:id', object.ObtenirTouteInfoPartie);



// GET avec requeteUrl

    // router.get('/game/scenario/numero/:id', object.obtenirScenario);
router.get('/game/missionEtat/historique/:id', object.obtenirHistoriqueMission);
    // router.get('/game/missionEtat/actuel', object.obtenirMissionActuelle);
/// -> a corriger
router.get('/game/missionEtat/:id', object.listeMissionEtatid);
router.get('/game/missionEtat/:gameid', object.listeMissionEtatGameid);
router.get('/game/equipe/:id', object.listeEquipeId)

// POST

    //Ajouter Element dans table
router.post('/game/partie/ajout', checkPermission(1), object.AjouterPartie);
router.post('/game/salle/ajout', checkPermission(1), object.AjouterSalle);
router.post('/game/scenario/ajout', checkPermission(1), object.AjouterScenar);
router.post('/game/mission/ajout', checkPermission(1), object.AjouterMission);
router.post('/game/missionetat/ajout', checkPermission(1), object.AjouterMissionEtat);
router.post('/game/equipe/ajout', checkPermission(1), object.AjouterEquipe);

router.post('/game/partie/demarrer', checkPermission(1), object.DemarrerPartie);
router.post('/game/partie/finir', checkPermission(1), object.FinirPartie);

router.post('/game/missionetat/suivante', checkPermission(1), object.MissionSuivante);
router.post('/game/reservation/ajout', checkPermission(1), authMiddleware, object.AjoutReservation);

// Update

router.patch('/game/mission/update', checkPermission(1), object.MajMission);
router.patch('/game/equipe/update', checkPermission(1), object.MajEquipe);
router.patch('/game/scenario/update', checkPermission(1), object.MajScenario);
router.patch('/game/salle/update', checkPermission(1), object.MajSalle);



/////////////////////////   Gestion api user   ///////////////////////// 


// GET 

router.get('/user/liste', checkPermission(1), user.listeUser);
router.get('/user', user.nomUser);

// POST

router.post('/user/register', user.regiserUser);
router.post('/user/login', user.loginUser);



// Modification 

// Modification coté admin

router.patch('/user/update-admin', checkPermission(1), user.MajUtilisateur);
router.delete('/user/delete', checkPermission(1), user.SupprimerUtilisateur);


///////////////////////// Gestion api erreur ///////////////////////////

router.use((req, res) => {
    return res.status(404).json({erreur: "Requete introuvable"});
});

router.use((req, res) => {
    return res.status(401).json({erreur: "Requete mauvaise"});
});

router.use((req, res) => {
    return res.status(500).json({erreur: "Erreur serveur"});
});




module.exports = router;
