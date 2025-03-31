const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("escapegame", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: true,  
  dialectOptions: {
    connectTimeout: process.env.DB_TIMEOUT || 3000, 
},
});

sequelize.authenticate()
    .then(() => console.log('✅ Connexion à la base de données réussie !'))
    .catch(err => console.error('❌  Erreur de connexion :', err));


module.exports = sequelize;