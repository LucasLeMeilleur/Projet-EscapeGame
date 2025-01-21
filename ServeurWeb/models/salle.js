const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableSalle = sequelize.define('salle', {
  idsalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idsalle",
  },
  nom: {
    type: DataTypes.STRING(75),
    allowNull: false,
    field:"nom"
  },
  ville: {
    type: DataTypes.STRING(80),
    allowNull: false,
    field:"ville"
  }
}, {
  tableName: 'salle',      
  timestamps: false,       
});


module.exports = TableSalle;
