const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableMission = sequelize.define('mission', {
  idmission: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idmission",
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field:"nom"
  },
  tempsRequis: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: "tempsRequis"
  },
  description:{
    type: DataTypes.TEXT,
    allowNull: true,
    field: "description"
  }
}, {
  tableName: 'mission',      
  timestamps: false,       
});


module.exports = TableMission;
