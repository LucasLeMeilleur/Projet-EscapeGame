const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableSalle = sequelize.define('salle', {
  idscenario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idscenario",
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field:"nom"
  },
  ordre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field:"ordre"
  }
}, {
  tableName: 'salle',      
  timestamps: false,       
});


module.exports = TableSalle;
