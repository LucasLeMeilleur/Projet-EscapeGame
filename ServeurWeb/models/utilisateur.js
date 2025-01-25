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
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field:"email"
  },
  permission: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "permission"
  }
}, {
  tableName: 'utilisateur',      
  timestamps: false,       
});

module.exports = TableUtilisateur;
