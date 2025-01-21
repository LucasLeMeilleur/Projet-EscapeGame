const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableEquipe = sequelize.define('equipe', {
  idetat: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idetat",
  },
  heuredebut: {
    type: DataTypes.TIME,
    allowNull: false,
    field:"heuredebut"
  }, 
  heurefin: {
    type: DataTypes.TIME,
    allowNull: false,
    field:"heurefin"
  },
  idgame: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field:"idgame"
  },
  idmission: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field:"idmission"
  }
}, {
  tableName: 'equipe',      
  timestamps: false,       
});


module.exports = TableEquipe;
