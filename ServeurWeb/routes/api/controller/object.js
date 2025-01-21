const sequelize = require('../../../config/database');

const TableGame = require('../../../models/game');
const TableSalle = require('../../../models/salle');




exports.listeAllGame = async (req, res)=> {
    try {
        const cpus = await TableGame.findAll();

        res.status(200).json(cpus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.listeSalle = async (req, res)=> {
    try {
        const cpus = await TableSalle.findAll();

        res.status(200).json(cpus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}