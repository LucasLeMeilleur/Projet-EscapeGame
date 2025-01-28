const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableReservation = sequelize.define('reservation', {
  idmission: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idreservation",
  },
  date: {
    type: DataTypes.TIME,
    allowNull: false,
    field:"date"
  },
  utilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "utilisateur",
  },
  salle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "salle",
  },
  equipe: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: "equipe",
  }
}, {
  tableName: 'reservation',      
  timestamps: false,       
});


module.exports = TableReservation;
