const sequelize = require('../../../config/database');

const TableGame = require('../../../models/game');



exports.listeAllGame = async (req, res)=> {
    try {
        const cpus = await TableGame.findAll();

        res.status(200).json(cpus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}