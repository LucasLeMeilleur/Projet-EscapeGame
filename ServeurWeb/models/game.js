  const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const TableSalle = require('./salle');
const TableScenario = require('./scenario');
const TableMissionEtat = require('./missionEtat');
const TableEquipe = require('./equipe');

const TableGame = sequelize.define('game', {
  idgame: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idgame",
  },
  idmissionEtat: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field:"idmissionEtat"
  }, 
  idscenario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field:"idscenario"
  },
  dateCreation: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
    allowNull: false,
    field:"dateCreation"
  },
  dateDepart: {
    type: DataTypes.DATE,
    allowNull: true,
    field:"dateDepart"
  },
  idequipe: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field:"idequipe"
  },
  actif: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
    field:"actif"
  },
  terminee: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
    field:"terminee"
  },
  duree: {
    type: DataTypes.TINYINT,
    allowNull: true,
    field:"duree"
  }
}, {
  tableName: 'game',      
  timestamps: false,       
});

TableGame.belongsTo(TableSalle, { foreignKey: 'idsalle' });
TableGame.belongsTo(TableScenario, { foreignKey: 'idscenario' });
TableGame.belongsTo(TableMissionEtat, { foreignKey: 'idmissionEtat'});
TableGame.belongsTo(TableEquipe, {foreignKey: 'idequipe'});

module.exports = TableGame;
