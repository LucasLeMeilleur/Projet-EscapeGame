const sequelize = require('../../../config/database');

const TableGame = require('../../../models/game');
const TableSalle = require('../../../models/salle');
const TableScenario = require('../../../models/scenario');
const TableMission = require('../../../models/mission');
const TableMissionEtat = require('../../../models/missionEtat');
const TableUtilisateur = require('../../../models/utilisateur');
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

exports.AjouterMissionEtat = async (req,res)=>{
    try{
        const ReqData = req.body;

        console.log(ReqData);
        const idgame = ReqData.game;
        const idmission = ReqData.mission;

        reqprime = await TableMission.findOne({ idmission: idmission });
        console.log(reqprime);
        if (!reqprime){
            res.status(407).send("Mission introuvable");
            return;
        }

        reqprime = await TableGame.findOne({ idgame: idgame });
        console.log(reqprime);
                

        if (!reqprime){
            res.status(407).send("Partie introuvable");
            return;
        }
               

        if(!idgame || !idmission){
            res.status(407).send("Erreur requete");
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

