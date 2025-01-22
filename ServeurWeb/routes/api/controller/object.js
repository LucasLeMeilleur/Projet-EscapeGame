const sequelize = require('../../../config/database');

const TableGame = require('../../../models/game');
const TableSalle = require('../../../models/salle');
const TableScenario = require('../../../models/scenario');
const TableMission = require('../../../models/mission');
const TableMissionEtat = require('../../../models/missionEtat');
const TableUtilisateur = require('../../../models/utilisateur');
const TableEquipe = require('../../../models/equipe');
const TableReservation = require('../../../models/reservation');



// GET

exports.listeAllGame = async (req, res)=> {
    try {
        const rep = await TableGame.findAll();

        res.status(200).json(rep);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.listeSalle = async (req, res)=> {
    try {
        const rep = await TableSalle.findAll();

        res.status(200).json(rep);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// POST

exports.AjouterPartie = async (req, res)=> {
    try {
        const rep = await TableGame.create({

            idmissionEtat: 1,
            idscenario: 1,
            idequipe: 1,
            date: Date.now(),

        });

        res.status(200).json(rep);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.AjouterSalle = async (req, res)=> {
    try {
        const rep = await TableSalle.create({

            nom: "Test",
            ville: "Test"

        });

        res.status(200).json(rep);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.AjouterScenar = async (req, res)=> {
    try {
        const rep = await TableScenario.create({

            nom:"Test",
            ordre:"Test",

        });

        res.status(200).json(rep);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.AjouterMission = async (req,res)=>{
    try{
        const rep = await TableMission.create({
            nom: "test",
        });

        res.status(200).json(rep);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.AjouterEtatMission = async (req,res)=>{
    try{
        const rep = await TableMissionEtat.create({
            heuredebut: Date.now(),
            idgame: 1,
            idmission: 1
        });

        res.status(200).json(rep);
    } catch(error){

        res.status(500).json({ message: error.message });
    }
}

