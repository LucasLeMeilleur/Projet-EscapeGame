const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableScenario = sequelize.define('scenario', {
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
  tableName: 'scenario',      
  timestamps: false,       
});


module.exports = TableScenario;
