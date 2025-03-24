const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const TableMission = require('./mission');

const TableMissionEtat = sequelize.define('missionEtat', {
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
    allowNull: true,
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
  tableName: 'missionEtat',      
  timestamps: false,       
});


TableMissionEtat.hasMany(TableMission, {foreignKey: 'idmission'});

module.exports = TableMissionEtat;
