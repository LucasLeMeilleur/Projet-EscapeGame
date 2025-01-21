const { Sequelize } = require('sequelize');


const sequelize = new Sequelize("escapegame", process.env.DB_USER || "root", process.env.DB_PASSWORD || "root", {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: true,  
  dialectOptions: {
    connectTimeout: 3500, 
},
});

module.exports = sequelize;
  