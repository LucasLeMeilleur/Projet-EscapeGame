const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const TableUtilisateur = sequelize.define('utilisateur', {
  idUser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field:"idUser",
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field:"username"
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field:"password"
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field:"email"
  }
}, {
  tableName: 'utilisateur',      
  timestamps: false,       
});

module.exports = TableUtilisateur;
