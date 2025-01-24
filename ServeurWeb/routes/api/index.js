const express = require('express');
const router = express.Router();
const user = require('./controller/user');
const object = require('./controller/object');

// Gestion api game


    // GET 

router.get('/game/jeux/liste', object.listeAllGame);
router.get('/game/salle/liste', object.listeSalle);
router.get('/game/scenario/liste', object.listeScenario);
router.get('/game/mission/liste', object.listeMission);
router.get('/game/missionEtat/liste', object.listeMissionEtat);

router.get('/key/publickey', (req, res) => {
    res.send({key:global.keyRSA.getPublicKey()});
});



    // GET avec body

router.get('/game/missionEtat/id', object.listeMissionEtatid);
router.get('/game/missionEtat/gameid', object.listeMissionEtatGameid);


    // POST

router.post('/game/jeux/ajout', object.AjouterPartie);
router.post('/game/salle/ajout', object.AjouterSalle);
router.post('/game/scenario/ajout', object.AjouterScenar);
router.post('/game/mission/ajout', object.AjouterMission);
router.post('/game/missionetat/ajout', object.AjouterMissionEtat);

// Gestion api user


    //GET 

router.get('/user/liste', user.listeUser);

    //POST

router.post('/user/register', user.addUser);



module.exports = router;
