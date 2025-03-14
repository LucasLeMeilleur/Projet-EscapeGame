const sequelize = require('../../../config/database');
const { Op } = require('sequelize');

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
exports.listePartie = async (req, res) => {
    try {
        const rep = await TableGame.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombrePartie = async (req, res) => {
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
exports.listeSalle = async (req, res) => {
    try {
        const rep = await TableSalle.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreSalle = async (req, res) => {
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
exports.listeScenario = async (req, res) => {
    try {
        const rep = await TableScenario.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreScenario = async (req, res) => {
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
exports.listeMission = async (req, res) => {
    try {
        const rep = await TableMission.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreMission = async (req, res) => {
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
exports.listeMissionEtat = async (req, res) => {
    try {
        const rep = await TableMissionEtat.findAll();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.nombreMissionEtat = async (req, res) => {
    try {
        const rep = await TableMissionEtat.count();

        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

//Equipe

exports.listeEquipe = async (req, res) => {
    try {
        const rep = await TableEquipe.findAll();
        res.status(200).json(rep);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}

exports.listeNomEquipe = async (req, res) => {
    try {

        const rep = await TableEquipe.findAll({
            attributes: ['nom']
        });


        res.status(200).json(rep);
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}


// Get avec body

exports.listeMissionEtatid = async (req, res) => {
    const ReqData = req.body;
    const IdMission = ReqData.missionid;

    if (!IdMission) {
        return res.status(407).json({message: "Requete invalide"});
    }    
    try {
        const rep = await TableMissionEtat.findOne({ where: { idetat: IdMission } });
        
        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.listeMissionEtatGameid = async (req, res) => {
    const ReqData = req.body;
        const IdGame = ReqData.gameid;
        try {
            const rep = await TableMissionEtat.findOne({ where: { idgame: IdGame } });
        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.listeEquipeId = async (req, res) => {

    const ReqData = req.body;
    const IdEquipe = ReqData.id;

    try {
        const rep = await TableEquipe.findOne({ where: { idequipe: IdEquipe } });
        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// POST

exports.AjouterPartie = async (req, res) => {
    try {
        const ReqData = req.body;
        const ScenarioId = ReqData.idscenario;
        const EquipeId = ReqData.idequipe;

        if (!ScenarioId || !EquipeId) return res.status(407).send({message: "Requete invalide"});

        reqprime = await TableScenario.findOne({ where: { idscenario: ScenarioId } });
        if (!reqprime) return res.status(407).json({message: "Scenario non existant"});

        const rep = await TableGame.create({
            idscenario: ScenarioId,
            idequipe: EquipeId,
            date: getCurrentTime(),
        });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });    
    }
}

exports.AjouterSalle = async (req, res) => {
    try {
        const rep = await TableSalle.create({
            nom: "Test",
            ville: "Test"
        });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.AjouterScenar = async (req, res) => {
    try {
        const ReqData = req.body;
        const scenarioName = ReqData.nomScenario;
        const ordre = ReqData.ordre;

        if (!scenarioName || !ordre) return res.status(407).json({message: "Requete invalide"});  

        reqprime = await TableScenario.findOne({ where: { nom: scenarioName } });
        if (reqprime) return res.status(407).json({message: "Nom de scenario deja existant"});

        const rep = await TableScenario.create({
            nom: scenarioName,
            ordre: ordre,
        });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.AjouterMission = async (req, res) => {
    try {
        const ReqData = req.body;
        const missionName = ReqData.nomMission;

        if (!missionName) return res.status(407).send("Aucun nom de mission donnée");

        reqprime = await TableMission.findOne({ where: { nom: missionName } });
        if (reqprime) return res.status(407).send("Nom de mission deja existante");

        const rep = await TableMission.create({
            nom: "test",
        });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.AjouterMissionEtat = async (req, res) => {
    try {
        const ReqData = req.body;
        const idgame = ReqData.game;
        const idmission = ReqData.mission;

        if (!idgame || !idmission) return res.status(400).json({message: "Erreur requete"});

        reqprime = await TableMission.findOne({ where: { idmission: idmission } });
        if (!reqprime) return res.status(400).json({message: "Mission introuvable"});

        reqprime = await TableGame.findOne({ where: { idgame: idgame } });
        if (!reqprime) return res.status(400).json({message: "Partie introuvable"});

        const rep = await TableMissionEtat.create({
            heuredebut: getCurrentTime(),
            idgame: idgame,
            idmission: idmission
        });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.DemarrerPartie = async (req, res) => {
    try {
        const ReqData = req.body;
        const PartieId = ReqData.partie;
        const EquipeId = ReqData.equipe;

        reqprime = await TableGame.findOne({ where: { idgame: PartieId } });
        if (!reqprime) return res.status(400).json({message: "Partie introuvable"});
        

        reqprime = await TableEquipe.findOne({ where: { idequipe: EquipeId } });
        if (!reqprime) return res.status(400).json({message: "Equipe non existante"});

        const updatePrime = await TableGame.update(
            { actif: '1', idequipe: EquipeId },
            { where: { idgame: PartieId } }
        );

        return res.status(200).json(updatePrime);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

exports.FinirPartie = async (req, res) => {
    try {
        const ReqData = req.body;
        const PartieId = ReqData.partie;

        if (!PartieId) return res.status(400).json({message: "Id de partie introuvable"});
        
        reqprime = await TableGame.findOne({ where: { idgame: PartieId } });
        if (!reqprime) return res.status(400).json({message: "Partie introuvable"});
        if (reqprime.actif == 0) return res.status(400).json({message: "Partie non lancée"});
        if (reqprime.terminee == 1) return res.status(400).json({message: "Partie deja finit"});

        const updatePrime = await TableGame.update(
            { actif: '0', terminee: '1' },
            { where: { idgame: PartieId } }
        );

        return res.status(200).json(updatePrime);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}


exports.listePartieReserve = async (req, res) => {
    try {
        const rep = await TableReservation.findAll({
            attributes: ['date'],
            where: {
                date: { [Op.gte]: new Date().setHours(0, 0, 0, 0) }
            }
        });

        const rep2 = await TableReservation.count({
            where: {
                date: { [Op.gte]: new Date().setHours(0, 0, 0, 0) }
            }
        });

        return res.status(200).json({ reservation: rep, nombre: rep2 });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}