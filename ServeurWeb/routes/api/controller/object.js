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
const { demarrerPartie, resetCanaux } = require('../../../mqttGestion');

// Fonction utiles

function formatDateTime(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}:00.000Z`);
    return date.toISOString().replace('T', ' ').replace('.000Z', '');
}

function estDateHeurePile(str) {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:00:00$/;

    if (!regex.test(str)) return false;

    const date = new Date(str.replace(" ", "T"));

    // Vérifie que la date est valide et bien "à l'heure pile"
    return !isNaN(date.getTime()) && date.getMinutes() === 0 && date.getSeconds() === 0;
}

function estDateFuture(str) {
    const date = new Date(str.replace(" ", "T"));
    if (isNaN(date.getTime())) return false;

    const maintenant = new Date();
    return date > maintenant;
}

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

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        const id = req.params.id;

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
    try {
        const IdMission = req.params.missionid;

        if (!IdMission) return res.status(407).json({ message: "Requete invalide" });

        const rep = await TableMissionEtat.findOne({ where: { idetat: IdMission } });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.listeMissionEtatGameid = async (req, res) => {
    try {
        const { gameid } = req.params;

        if (!gameid) return res.status(400).json({ message: "L'ID de la partie est requis" });


        const rep = await TableMissionEtat.findOne({
            where: { idgame: gameid }
        });

        if (!rep) return res.status(404).json({ message: "Aucun état de mission trouvé pour cette partie" });

        return res.status(200).json(rep);
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};


exports.listeEquipeId = async (req, res) => {

    const IdEquipe = req.params.id;

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
        const { scenario: nomScenario, equipe: nomEquipe } = req.body;

        if (!nomScenario || !nomEquipe) return res.status(407).send({ message: "Requete invalide" });

        reqprime = await TableScenario.findOne({ where: { nom: nomScenario } });
        if (!reqprime) return res.status(407).json({ message: "Scenario non existant" });

        const ScenarioId = reqprime.idscenario;

        reqprime = await TableEquipe.findOne({ where: { nom: nomEquipe } });
        if (!reqprime) return res.status(407).json({ message: "Equipe non existante" });

        const EquipeId = reqprime.idequipe;

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
        const { nom, ville } = req.body;

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

        const { nomScenario, ordre, description } = req.body;

        if (!nomScenario || !ordre || !description) return res.status(407).json({ message: "Requete invalide" });
        if (!verifierChaineNumerique(ordre)) return res.status(407).json({ message: "Ordre invalide" });

        reqprime = await TableScenario.findOne({ where: { nom: nomScenario } });
        if (reqprime) return res.status(407).json({ message: "Nom de scenario deja existant" });

        const rep = await TableScenario.create({
            nom: nomScenario,
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

        const { nom: missionName, tempsRequis, description } = req.body;

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

        const { game: idgame, mission: idmission } = req.body;

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
        const { nom: nomEquipe, nombre_joueur: nombrejoueur } = req.body;

        if (!nomEquipe || !nombrejoueur) return res.status(407).json({ message: "Requete invalide" });

        if (!(!isNaN(nombrejoueur) && isFinite(nombrejoueur))) return res.status(407).json({ message: "Nombre joueur invalide" });

        reqprime = await TableEquipe.findOne({ where: { nom: nomEquipe } });
        if (reqprime) return res.status(407).json({ message: "Equipe déjà existante" })

        const now = new Date();
        const mysqlTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        reponse = await TableEquipe.create({
            nom: nomEquipe,
            nombre_joueur: nombrejoueur,
            date: mysqlTimestamp
        });

        return res.status(200).send({ message: "Equipe crée" });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.DemarrerPartie = async (req, res) => {
    try {
        const PartieId = req.body.partie;

        reqprime = await TableGame.findOne({ where: { idgame: PartieId }, include: { model: TableMissionEtat } });
        if (!reqprime) return res.status(400).json({ message: "Partie introuvable" });

        console.log(reqprime)


        const updatePrime = await TableGame.update(
            { actif: '1', dateDepart: Date.now() },
            { where: { idgame: PartieId } }
        );

        demarrerPartie(reqprime.missionEtat.idmission, PartieId);

        return res.status(200).json({ message: "Partie lancée avec succès" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

exports.FinirPartie = async (req, res) => {
    try {
        const PartieId = req.body.partie;

        const Date_maintenant = Date.now();
        if (!PartieId) return res.status(400).json({ message: "Id de partie introuvable" });

        reqprime = await TableGame.findOne({ where: { idgame: PartieId } });
        if (!reqprime) return res.status(400).json({ message: "Partie introuvable" });
        if (reqprime.actif == 0) return res.status(400).json({ message: "Partie non lancée" });
        if (reqprime.terminee == 1) return res.status(400).json({ message: "Partie deja finit" });


        const DteDepart = new Date(reqprime.dateDepart).getTime();
        const duree_partie = Math.floor((Date_maintenant - DteDepart) / 1000);

        if (3600 >= duree_partie <= 0) {
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

        resetCanaux();

        return res.status(200).json(updatePrime);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}


exports.listePartieReserve = async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [reservation, nombre] = await Promise.all([
            TableReservation.findAll({
                attributes: ['date'],
                where: {
                    date: { [Op.gte]: todayStart }
                }
            }),
            TableReservation.count({
                where: {
                    date: { [Op.gte]: todayStart }
                }
            })
        ]);

        return res.status(200).json({ reservation, nombre });
    } catch (error) {
        return res.status(500).json(error.message);
    }
}


exports.MissionSuivante = async (req, res) => {
    try {
        const { mission, idpartie } = req.body;

        const now = new Date();
        const mysqlTimestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        const mysqlTime = now.toTimeString().split(' ')[0];

        const game = await TableGame.findOne({
            where: { idgame: idpartie },
            include: [
                { model: TableMissionEtat },
                { model: TableScenario }
            ]
        });

        if (!game) {
            return res.status(404).json({ message: "Partie non trouvée" });
        }

        const ordreMission = game.scenario.ordre.split(',');
        const missionActuelle = game.missionEtat.idmission;

        if (missionActuelle != mission) {
            return res.status(400).json({ message: "Mauvaise mission en cours" });
        }

        await TableMissionEtat.update(
            { heurefin: mysqlTime },
            { where: { idetat: game.idmissionEtat } }
        );

        const indexActuel = ordreMission.indexOf(String(missionActuelle));
        const missionSuivante = ordreMission[indexActuel + 1];

        if (!missionSuivante) {
            const token = jwt.sign({ permission: 1 }, global.JWTToken, { expiresIn: '8h' });

            await fetch("http://127.0.0.1:3000/api/game/partie/finir", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${token}`
                },
                body: JSON.stringify({ partie: idpartie })
            }).then(res => res.text())
                .then(text => console.log("Réponse brute:", text))
                .catch(error => console.error("Erreur:", error));

            return res.status(200).json({ message: "Dernière mission finie" });
        }

        const nouvelleMission = await TableMissionEtat.create({
            idgame: game.idgame,
            heuredebut: mysqlTimestamp,
            idmission: missionSuivante,
        });

        await TableGame.update(
            { idmissionEtat: nouvelleMission.idetat },
            { where: { idgame: game.idgame } }
        );

        return res.status(200).json(nouvelleMission);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.scoreBoard = async (req, res) => {
    try {
        const reponse = await TableGame.findAll({
            where: { terminee: 1, duree: { [Op.gt]: 0 } },
            order: [['duree', 'ASC']],
            limit: 20,
            include: [{
                model: TableScenario, // Modèle de la salle
                attributes: ['nom'] // On ne récupère que le nom de la salle
            },
            {
                model: TableEquipe,
                attributes: ['nom', 'nombre_joueur']
            }]
        });

        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


exports.AjoutReservation = async (req, res) => {
    try {
        const idUtilisateur = req.user.id;
        const { heure, date, salle } = req.body;

        if (!salle || !date || !heure) {
            return res.status(400).json({ message: "Formulaire incomplet" });
        }

        const dateHeure = formatDateTime(date, heure);

        if (!estDateHeurePile(dateHeure)) {
            return res.status(400).json({ message: "Heure incorrecte (doit être pile)." });
        }

        if (!estDateFuture(dateHeure)) {
            return res.status(400).json({ message: "Heure déjà passée." });
        }

        const salleExistante = await TableSalle.findOne({ where: { idsalle: salle } });
        if (!salleExistante) {
            return res.status(404).json({ message: "Salle introuvable." });
        }

        const dejaReservee = await TableReservation.findOne({
            where: { date: dateHeure, salle: salle }
        });

        if (dejaReservee) {
            return res.status(409).json({ message: "Horaire déjà réservé." });
        }

        await TableReservation.create({
            utilisateur: idUtilisateur,
            salle: salle,
            date: dateHeure
        });

        return res.status(201).json({ message: "Réservation effectuée avec succès." });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.reservationAVenir = async (req, res) => {
    try {
        const derniersEnregistrements = await TableReservation.findAll({
            where: {
                date: {
                    [Op.gt]: new Date() // Prend uniquement les réservations dont la date est après la date actuelle
                }
            },
            order: [['date', 'ASC']],
            limit: 5
        });

        return res.status(200).json(derniersEnregistrements);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.MajEquipe = async (req, res) => {
    try {
        const { idequipe: IdEquipe, nom: Nom, nombre_joueur: nombreJoueur, date: Date } = req.body;

        // Vérification des champs obligatoires
        if (!IdEquipe || !Nom || !nombreJoueur || !Date) {
            return res.status(400).json({ message: "Formulaire incomplet" });
        }

        // Vérification de l'existence de l'équipe
        const equipe = await TableEquipe.findOne({
            where: { idequipe: IdEquipe }
        });

        if (!equipe) {
            return res.status(404).json({ message: "Equipe inexistante" });
        }

        // Mise à jour de l'équipe
        const [nbUpdated] = await TableEquipe.update(
            {
                nombre_joueur: nombreJoueur,
                nom: Nom,
                date: Date
            },
            {
                where: { idequipe: IdEquipe }
            }
        );

        // Vérification si des modifications ont été effectuées
        if (nbUpdated === 0) {
            return res.status(418).json({ message: "Aucun changement détecté" });
        }

        return res.status(200).json({ message: "Equipe mise à jour avec succès" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.MajScenario = async (req, res) => {
    try {
        const { idscenario, nom, ordre, description } = req.body;

        if (!idscenario || !nom || !ordre) {
            return res.status(400).json({ message: "Formulaire incomplet" });
        }

        const scenario = await TableScenario.findOne({
            where: { idscenario }
        });

        if (!scenario) return res.status(404).json({ message: "Scénario inexistant" });

        const [nbUpdated] = await TableScenario.update(
            {
                nom,
                ordre,
                description
            },
            {
                where: { idscenario }
            }
        );

        if (nbUpdated === 0) return res.status(418).json({ message: "Aucun changement détecté" });

        return res.status(200).json({ message: "Scénario mis à jour avec succès" });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.MajMission = async (req, res) => {
    try {
        const { idmission, nom, tempsRequis, description } = req.body;

        if (!idmission || !nom || typeof tempsRequis === "undefined") return res.status(401).json({ message: "Formulaire incomplet" });

        const mission = await TableMission.findOne({
            where: { idmission }
        });

        if (!mission) return res.status(404).json({ message: "Mission inexistante" });

        const [nbUpdated] = await TableMission.update(
            { nom, tempsRequis, description },
            { where: { idmission } }
        );

        if (nbUpdated === 0) return res.status(418).json({ message: "Aucun changement détecté" });

        return res.status(200).json({ message: "Mission mise à jour avec succès" });
    } catch (error) {
        console.error("Erreur MajMission:", error);
        return res.status(500).json({ message: error.message });
    }
};



exports.MajSalle = async (req, res) => {
    try {
        const { idsalle, nom, ville } = req.body;

        if (!idsalle || !nom || !ville) return res.status(401).json({ message: "Formulaire incomplet" });

        const salle = await TableSalle.findOne({
            where: { idsalle }
        });

        if (!salle) return res.status(401).json({ message: "Salle inexistante" });

        const [nbUpdated] = await TableSalle.update(
            { nom, ville },
            { where: { idsalle } }
        );

        if (nbUpdated === 0) return res.status(418).json({ message: "Aucun changement détecté" });

        return res.status(200).json({ message: "Salle mise à jour avec succès" });
    } catch (error) {
        console.error("Erreur MajSalle:", error);
        return res.status(500).json({ message: error.message });
    }
};


exports.DelMission = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TableMission.destroy({ where: { idmission: id } });

        if (!deleted) return res.status(404).json({ message: 'Mission non trouvée' });
        res.json({ success: true, message: 'Mission supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur suppression mission :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};


exports.DelEquipe = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TableEquipe.destroy({ where: { idequipe: id } });

        if (!deleted) return res.status(404).json({ message: 'Équipe non trouvée' });
        res.json({ success: true, message: 'Équipe supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur suppression équipe :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.DelScenario = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TableScenario.destroy({ where: { idscenario: id } });

        if (!deleted) return res.status(404).json({ message: 'Scénario non trouvé' });
        res.json({ success: true, message: 'Scénario supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur suppression scénario :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.DelSalle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TableSalle.destroy({ where: { idsalle: id } });

        if (!deleted) return res.status(404).json({ message: 'Salle non trouvée' });
        res.json({ success: true, message: 'Salle supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur suppression salle :', error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.RecupReservPerso = async (req, res) => {
    try {
        const id = req.user.id;

        if (!id) {
            return res.status(400).json({ message: "Session invalide" });
        }

        const reservations = await TableReservation.findAll({
            order: [['date', 'DESC']],
            where: { utilisateur: id }
        });

        if (reservations.length === 0) {
            return res.status(404).json({ message: "Aucune réservation trouvée" });
        }

        return res.status(200).json(reservations);
    } catch (error) {
        console.error('Erreur récupération réservation perso :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};

exports.obtenirScenario = async (req, res) => {
    try {
        const { id } = req.params;  // Récupère l'ID du scénario dans les paramètres de l'URL

        // Validation de l'ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "ID de scénario invalide" });
        }

        // Recherche du scénario dans la base de données
        const scenario = await TableScenario.findOne({
            where: { idscenario: id }
        });

        // Si aucun scénario n'est trouvé, retourne une erreur 404
        if (!scenario) {
            return res.status(404).json({ message: "Scénario non trouvé" });
        }

        // Retourne les détails du scénario trouvé
        return res.status(200).json(scenario);
    } catch (error) {
        // Gestion des erreurs générales
        console.error('Erreur récupération scénario :', error);
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
