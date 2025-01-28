const sequelize = require('../../../config/database');

const TableGame = require('../../../models/game');
const TableSalle = require('../../../models/salle');
const TableScenario = require('../../../models/scenario');
const TableMission = require('../../../models/mission');
const TableMissionEtat = require('../../../models/missionEtat');
const TableEquipe = require('../../../models/equipe');
const TableReservation = require('../../../models/reservation');



// Fonction utiles


function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}


// GET

        //Partie
exports.listePartie = async (req, res)=> {
    try {
        const rep = await TableGame.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombrePartie = async (req,res)=>{
    try {
        const rep = await TableGame.count();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

        //Salle
exports.listeSalle = async (req, res)=> {
    try {
        const rep = await TableSalle.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreSalle = async (req,res)=>{
    try {
        const rep = await TableSalle.count();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

        //Scenario
exports.listeScenario = async (req, res)=> {
    try {
        const rep = await TableScenario.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreScenario = async (req,res)=>{
    try {
        const rep = await TableScenario.count();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

        //Mission
exports.listeMission = async (req, res)=> {
    try {
        const rep = await TableMission.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreMission = async (req,res)=>{
    try {
        const rep = await TableMission.count();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

        // MissionEtat
exports.listeMissionEtat = async (req, res)=> {
    try {
        const rep = await TableMissionEtat.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreMissionEtat = async (req,res)=>{
    try {
        const rep = await TableMissionEtat.count();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}


// Get avec body

exports.listeMissionEtatid = async (req, res)=> {

    const ReqData = req.body;
    const IdMission = ReqData.missionid;

    if(!IdMission){
        res.status(407).send("Requete invalide");
        return;
    }

    try {
        const rep = await TableMissionEtat.findOne({where: { idetat: IdMission}});
        console.log(rep);
        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.listeMissionEtatGameid = async (req, res)=> {

    const ReqData = req.body;
    const IdGame = ReqData.gameid;

    try {
        const rep = await TableMissionEtat.findOne({where:{ idgame: IdGame }});

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}


// POST

exports.AjouterPartie = async (req, res)=> {
    try {

        const ReqData = req.body;

        const ScenarioId = ReqData.idscenario;
        const EquipeId = ReqData.idequipe;
        

        if(!ScenarioId || !EquipeId){
            res.status(407).send("Requete invalide");
            return;
        }

        reqprime = await TableScenario.findOne({where:{ idscenario: ScenarioId }});
        if (!reqprime){ 
            res.status(407).send("Scenario non existant");
            return;
        }


        const rep = await TableGame.create({
            idscenario: ScenarioId,
            idequipe: EquipeId,
            date: getCurrentTime(),
        });

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.AjouterSalle = async (req, res)=> {
    try {
        const rep = await TableSalle.create({

            nom: "Test",
            ville: "Test"

        });

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.AjouterScenar = async (req, res)=> {
    try {

        const ReqData = req.body;
        const scenarioName = ReqData.nomScenario;
        const ordre = ReqData.ordre;

        if(!scenarioName || !ordre){
            res.status(407).send("Requete invalide");
            return;
        }


        reqprime = await TableScenario.findOne({where:{ nom: scenarioName }});
        console.log(reqprime);
        if (reqprime){
            res.status(407).send("Nom de scenario deja existant");
            return;
        }

        const rep = await TableScenario.create({

            nom: scenarioName,
            ordre: ordre,

        });

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.AjouterMission = async (req,res)=>{
    try{
        const ReqData = req.body;
        const missionName = ReqData.nomMission;

        if(!missionName){
            res.status(407).send("Aucun nom de mission donnée");
            return;
        }
        reqprime = await TableMission.findOne({where:{ nom: missionName }});
        if(reqprime){
            res.status(407).send("Nom de mission deja existante");
            return;
        }
        const rep = await TableMission.create({
            nom: "test",
        });

        res.status(200).json(rep);
        return;
    } catch(error){
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.AjouterMissionEtat = async (req,res)=>{
    try{
        const ReqData = req.body;
        const idgame = ReqData.game;
        const idmission = ReqData.mission;

        if(!idgame || !idmission){
            res.status(400).send("Erreur requete");
            return;
        }

        reqprime = await TableMission.findOne({where:{ idmission: idmission }});
        if (!reqprime){
            res.status(400).send("Mission introuvable");
            return;
        }

        reqprime = await TableGame.findOne({where:{ idgame: idgame }});       
        if (!reqprime){
            res.status(400).send("Partie introuvable");
            return;
        }
        
        const rep = await TableMissionEtat.create({
            heuredebut: getCurrentTime(),
            idgame: idgame,
            idmission: idmission
        });

        res.status(200).json(rep);
        return;
    } catch(error){
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.DemarrerPartie = async (req, res)=>{
    try {
        const ReqData = req.body;
        const PartieId = ReqData.partie;
        const EquipeId = ReqData.equipe;

        reqprime = await TableGame.findOne({where:{ idgame: PartieId }});
        if (!reqprime){
            res.status(400).send("Partie introuvable");
            return;
        }

        reqprime = await TableEquipe.findOne({where:{ idequipe: EquipeId }});
        if (!reqprime){
            res.status(400).send("Equipe non existante");
            return;
        }
        
        const updatePrime = await TableGame.update(
            { actif: '1', idequipe: EquipeId }, 
            { where: { idgame: PartieId } } 
        );

        res.status(200).json(updatePrime);
        return;
    } catch (error) {
        res.status(500).send(error.message);
        return;
    }
}

exports.FinirPartie = async (req,res)=>{
    try {
        const ReqData = req.body;
        const PartieId = ReqData.partie;        

        if(!PartieId){
            res.status(400).send("Id de partie introuvable");
            return;
        }

        reqprime = await TableGame.findOne({where:{ idgame: PartieId }});
        if (!reqprime){
            res.status(400).send("Partie introuvable");
            return;
        }

        if(reqprime.actif == 0){
            res.status(400).send("Partie non lancée");
            return;
        }

        if(reqprime.terminee == 1){
            res.status(400).send("Partie deja finit");
            return;
        }
     
        const updatePrime = await TableGame.update(
            { actif: '0', terminee: '1' }, 
            { where: { idgame: PartieId } } 
        );

        res.status(200).send(updatePrime);
        return;
    } catch (error) {        
        res.status(500).send(error.message);
        return;
    }
}