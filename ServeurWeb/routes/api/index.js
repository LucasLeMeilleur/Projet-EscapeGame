const express = require('express');
const router = express.Router();
// const user = require('./controller/user');
// const object = require('./controller/object');


router.get('/dzzdz', (req,res)=>{
    res.send('eib');
})

// Gestion api game
// router.get('/game/jeux/liste', object.listeAllGame);
// router.get('/game/salle/liste', object.listeSalle);

// router.post('/game/jeux/ajout', object.AjouterPartie);
// router.post('/game/salle/ajout', object.AjouterSalle);
// router.post('/game/scenario/ajout', object.AjouterScenar);

// Gestion api user

module.exports = router;
