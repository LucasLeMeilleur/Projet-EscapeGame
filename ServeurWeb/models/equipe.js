const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableEquipe = sequelize.define('equipe', {
  idequipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idequipe",
  },
  nom: {
    type: DataTypes.STRING(70),
    allowNull: false,
    field:"nom"
  }, 
  nombre_joueur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field:"nombre_joueur"
  },
  date: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: Date.now(),
    field:"date"
  },
}, {
  tableName: 'equipe',      
  timestamps: false,       
});


module.exports = TableEquipe;
