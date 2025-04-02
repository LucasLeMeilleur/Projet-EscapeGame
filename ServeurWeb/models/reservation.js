const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableReservation = sequelize.define('reservation', {
  idreservation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idreservation",
  },
  date: {
    type: DataTypes.DATE,
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
  }
}, {
  tableName: 'reservation',      
  timestamps: false,       
});


module.exports = TableReservation;
