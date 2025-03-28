const sequelize = require('../../../config/database');
const { Op, where } = require('sequelize');

const TableGame = require('../../../models/game');
const TableSalle = require('../../../models/salle');
const TableScenario = require('../../../models/scenario');
const TableMission = require('../../../models/mission');
const TableMissionEtat = require('../../../models/missionEtat');
const TableEquipe = require('../../../models/equipe');
const TableReservation = require('../../../models/reservation');
const { logger } = require('sequelize/lib/utils/logger');
const jwt = require('jsonwebtoken');


// Fonction utiles


function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}


function DecortiquerMission(a) {
    b = a.split(',')
    return b
}

function verifierChaineNumerique(str) {
    // Vérifier si la chaîne est vide
    if (!str.trim()) return false;

    // Vérifier que la chaîne ne contient que des chiffres et des virgules (sans espace)
    if (!/^\d+(,\d+)*$/.test(str)) return false;

    // Convertir la chaîne en tableau de nombres
    const nombres = str.split(",").map(Number);

    // Vérifier les doublons en comparant la taille du Set avec le tableau
    return new Set(nombres).size === nombres.length;
}

/////////////////////////////////////////////////////
/////////////////////// GET /////////////////////////
/////////////////////////////////////////////////////

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

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.partieActive = async (req, res) => {
    try {
        const rep = await TableGame.findAll({ where: { actif: true } });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

exports.derniereParties = async (req, res) => {
    try {
        const rep = await await TableGame.findAll({
            order: [['dateCreation', 'DESC']],
            limit: 5
        });
        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.dernierePartieFinie = async (req, res) => {
    try {
        const rep = await TableGame.findOne({ where: { terminee: 1 }, limit: 1 });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



exports.ObtenirTouteInfoPartie = async (req, res) => {
    try {

        const id = req.params.id;

        const reponse = await TableGame.findOne({
            where: { idgame: id },
            limit: 1,
            include: [{
                model: TableSalle, // Modèle de la salle
                attributes: ['idsalle', 'nom', 'ville'] // On ne récupère que le nom de la salle
            }, {
                model: TableScenario,
                attributes: ['idscenario', 'nom', 'ordre']
            }, {
                model: TableMissionEtat,
                attributes: ['heuredebut', 'heurefin', 'idgame', 'idmission'],
                include: [
                    {
                        model: TableMission,
                        attributes: ['idmission', 'nom', 'tempsRequis']
                    }
                ]
            }, {
                model: TableEquipe,
                attributes: ['idequipe', 'nom', 'nombre_joueur', 'date']
            }]
        });

        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.obtenirPartieNonlancee = async (req, res) => {
    try {
        const reponse = await TableGame.findAll({
            where: { actif: 0, terminee: 0, dateDepart: null },
            include: [{
                model: TableEquipe,
                attributes: ['idequipe', 'nom', 'nombre_joueur']
            }]
        });

        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.obtenirHistoriqueMission = async (req, res) => {
    try {

        const id = req.params.id; // Récupération de l'ID depuis l'URL
        console.log("ID récupéré :", id);

        const reponse = await TableMissionEtat.findAll({
            where: { idgame: id },
            order: [['heurefin', 'DESC']],
            attributes: ['idetat', 'heuredebut', 'heurefin', 'idgame', 'idmission'],
            include: [{
                model: TableMission,
                attributes: ['idmission', 'nom', 'tempsRequis']
            }]
        })

        console.log(reponse)

        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Salle
exports.listeSalle = async (req, res) => {
    try {
        const rep = await TableSalle.findAll();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.nombreSalle = async (req, res) => {
    try {
        const rep = await TableSalle.count();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Scenario
exports.listeScenario = async (req, res) => {
    try {
        const rep = await TableScenario.findAll();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.nombreScenario = async (req, res) => {
    try {
        const rep = await TableScenario.count();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Mission
exports.listeMission = async (req, res) => {
    try {
        const rep = await TableMission.findAll();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.nombreMission = async (req, res) => {
    try {
        const rep = await TableMission.count();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// MissionEtat
exports.listeMissionEtat = async (req, res) => {
    try {
        const rep = await TableMissionEtat.findAll();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.nombreMissionEtat = async (req, res) => {
    try {
        const rep = await TableMissionEtat.count();

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Equipe

exports.listeEquipe = async (req, res) => {
    try {
        const rep = await TableEquipe.findAll();
        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.listeNomEquipe = async (req, res) => {
    try {

        const rep = await TableEquipe.findAll({
            attributes: ['nom']
        });


        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Get avec body  ->>>> a modifier

exports.listeMissionEtatid = async (req, res) => {
    const ReqData = req.body;
    const IdMission = ReqData.missionid;

    if (!IdMission) {
        return res.status(407).json({ message: "Requete invalide" });
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

exports.dernieresPartiesFinies = async (req, res) => {
    try {
        const derniersEnregistrements = await TableGame.findAll({
            where: { terminee: true },
            order: [['dateCreation', 'DESC']],
            limit: 5
        });

        return res.status(200).json(derniersEnregistrements);
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.listeReservation = async (req, res) => {
    try {
        const reservations = await TableReservation.findAll();

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.dernieresReservation = async (req, res) => {
    try {
        const derniersEnregistrements = await TableReservation.findAll({
            order: [['date', 'DESC']],
            limit: 5
        });

        return res.status(200).json(derniersEnregistrements);
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

/////////////////////////////////////////////////////
/////////////////////// POST ////////////////////////
/////////////////////////////////////////////////////


exports.AjouterPartie = async (req, res) => {
    try {
        const ReqData = req.body;
        const ScenarioId = ReqData.idscenario;
        const EquipeId = ReqData.idequipe;

        if (!ScenarioId || !EquipeId) return res.status(407).send({ message: "Requete invalide" });

        reqprime = await TableScenario.findOne({ where: { idscenario: ScenarioId } });
        if (!reqprime) return res.status(407).json({ message: "Scenario non existant" });

        reqprime = await TableEquipe.findOne({ where: { idequipe: EquipeId } });
        if (!reqprime) return res.status(407).json({ message: "Equipe non existante" });

        const repScenar = await TableScenario.findOne({
            where: { idscenario: ScenarioId },
            attributes: ['ordre']
        });
        const mission1 = DecortiquerMission(repScenar.ordre)[0];

        const rep = await TableGame.create({
            idscenario: ScenarioId,
            idequipe: EquipeId,
            idsalle: 1,
        });

        const rep2 = await TableMissionEtat.create({
            heuredebut: getCurrentTime(),
            idgame: rep.idgame,
            idmission: mission1
        })

        const repfinale = await TableGame.update(
            { idmissionEtat: rep2.idetat },
            { where: { idgame: rep.idgame } },
        );
        return res.status(200).json({ message: "Partie crée avec succès" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.AjouterSalle = async (req, res) => {
    try {
        const ReqData = req.body;
        const nom = ReqData.nom;
        const ville = ReqData.ville;

        const rep = await TableSalle.create({
            nom: nom,
            ville: ville
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
        const description = ReqData.description;

        if (!scenarioName || !ordre || !description) return res.status(407).json({ message: "Requete invalide" });

        if (!verifierChaineNumerique(ordre)) return res.status(407).json({ message: "Ordre invalide" });

        reqprime = await TableScenario.findOne({ where: { nom: scenarioName } });
        if (reqprime) return res.status(407).json({ message: "Nom de scenario deja existant" });

        const rep = await TableScenario.create({
            nom: scenarioName,
            ordre: ordre,
            description: description
        });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.AjouterMission = async (req, res) => {
    try {
        const ReqData = req.body;
        const missionName = ReqData.nom;
        const tempsRequis = ReqData.tempsRequis;
        const description = ReqData.description;

        if (!missionName || !description) return res.status(407).send("Aucun nom de mission donnée");

        reqprime = await TableMission.findOne({ where: { nom: missionName } });
        if (reqprime) return res.status(407).send("Nom de mission deja existante");

        const rep = await TableMission.create({
            nom: missionName,
            description: description,
            tempsRequis: tempsRequis
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

        if (!idgame || !idmission) return res.status(400).json({ message: "Erreur requete" });

        reqprime = await TableMission.findOne({ where: { idmission: idmission } });
        if (!reqprime) return res.status(400).json({ message: "Mission introuvable" });

        reqprime = await TableGame.findOne({ where: { idgame: idgame } });
        if (!reqprime) return res.status(400).json({ message: "Partie introuvable" });

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

exports.AjouterEquipe = async (req, res) => {
    try {
        const ReqData = req.body;
        const nomEquipe = ReqData.nom;
        const nombrejoueur = ReqData.nombre_joueur;



        if (!nomEquipe || !nombrejoueur) return res.status(407).json({ message: "Requete invalide" });

        if (!(!isNaN(nombrejoueur) && isFinite(nombrejoueur))) return res.status(407).json({ message: "Nombre joueur invalide" });

        const now = new Date();
        const mysqlTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        reponse = await TableEquipe.create({
            nom: nomEquipe,
            nombre_joueur: nombrejoueur,
            date: mysqlTimestamp
        });

        return res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.DemarrerPartie = async (req, res) => {
    try {
        const ReqData = req.body;
        const PartieId = ReqData.partie;

        reqprime = await TableGame.findOne({ where: { idgame: PartieId } });
        if (!reqprime) return res.status(400).json({ message: "Partie introuvable" });

        const updatePrime = await TableGame.update(
            { actif: '1', dateDepart: Date.now() },
            { where: { idgame: PartieId } }
        );

        return res.status(200).json({ message: "Partie lancée avec succès" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

exports.FinirPartie = async (req, res) => {
    try {
        const ReqData = req.body;
        const PartieId = ReqData.partie;

        const Date_maintenant = Date.now();


        if (!PartieId) return res.status(400).json({ message: "Id de partie introuvable" });

        reqprime = await TableGame.findOne({ where: { idgame: PartieId } });
        if (!reqprime) return res.status(400).json({ message: "Partie introuvable" });
        if (reqprime.actif == 0) return res.status(400).json({ message: "Partie non lancée" });
        if (reqprime.terminee == 1) return res.status(400).json({ message: "Partie deja finit" });



        const duree_partie = (Date_maintenant - reqprime.dateDepart) / 1000;

        if (3600 >= duree <= 0) {
            const updatePrime = await TableGame.update(
                { actif: '0', terminee: '1', duree: '-1' },
                { where: { idgame: PartieId } }
            );

            return res.status(200).json({ message: "Partie a durée incorrect ou dépassé" });
        }

        const updatePrime = await TableGame.update(
            { actif: '0', terminee: '1', duree: duree_partie },
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


exports.MissionSuivante = async (req, res) => {
    try {
        const ReqData = req.body;
        const idpartie = ReqData.idpartie;


        const now = new Date();
        const mysqlTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        const mysqlTime = now.toTimeString().split(' ')[0]; // Récupère uniquement HH:mm:ss


        const reponse = await TableGame.findOne({
            where: { idgame: idpartie },
            include: [{
                model: TableMissionEtat,
            },
            {
                model: TableScenario
            }]
        })

        console.log(JSON.stringify(reponse))

        const repprime = await TableMissionEtat.update(
            { heurefin: mysqlTime },
            { where: { idetat: reponse.idmissionEtat } },
        );

        const ordreMission = (reponse.scenario.ordre).split(',');
        const missionActuel = reponse.missionEtat.idmission;

        console.log("Ordre :", ordreMission);
        console.log("Mission en cours :", missionActuel, "Type:", typeof missionActuel);
        console.log("Index trouvé :", ordreMission.indexOf(String(missionActuel)));



        console.log(ordreMission.indexOf(String(missionActuel)) +1 >= ordreMission.length);
        console.log(ordreMission.indexOf(String(missionActuel)));
        console.log(ordreMission.length);

        if (ordreMission.indexOf(String(missionActuel)) + 1 >= ordreMission.length) {

            bodyData = {
                partie: idpartie
            }

            console.log(idpartie);

            url = "http://127.0.0.1:3000/api/game/partie/finir";

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'token='+ jwt.sign({ permission: 1}, global.JWTToken, { expiresIn: '8h' })  // Ajoute le token JWT dans l'en-tête Authorization
                },
                body: JSON.stringify(bodyData)  // Sérialise les données du corps en JSON
            })
                .then(response => response.text())  // <-- Afficher le texte brut avant JSON.parse()
                .then(text => {
                    console.log("Réponse brute:", text);
                    return JSON.parse(text);  // Convertir en JSON après vérification
                })
                .then(data => {
                    console.log("Réponse JSON:", data);
                })
                .catch(error => {
                    console.error("Erreur:", error);
                });

            return res.status(200).json({ message: "Derniere mission finit" });

        }

        const missionAMettre = ordreMission[ordreMission.indexOf(String(missionActuel)) + 1];

        console.log(missionAMettre);

        const reponse2 = await TableMissionEtat.create({
            idgame: reponse.idgame,
            heuredebut: mysqlTimestamp,
            idmission: missionAMettre,
        });

        const repFinal = await TableGame.update(
            { idmissionEtat: reponse2.idetat },
            { where: { idgame: reponse.idgame } }
        )

        return res.status(200).json(reponse2);
    } catch (error) {
        return res.status(200).json({ "Erreur": error.message });
    }
}