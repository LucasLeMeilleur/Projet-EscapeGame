  const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableGame = sequelize.define('game', {
  idgame: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idgame",
  },
  idmissionEtat: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field:"idmissionEtat"
  }, 
  idscenario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field:"idscenario"
  },
  dateCreation: {
    type: DataTypes.DATE,
    allowNull: false,
    field:"dateCreation"
  },
  dateDepart: {
    type: DataTypes.DATE,
    allowNull: false,
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


module.exports = TableGame;
