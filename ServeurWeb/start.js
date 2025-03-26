require('dotenv').config();

const ip = "127.0.0.1";
const port = 3000;
const express = require('express');
const app = express();  
const path = require('path')
const routes = require('./routes/web/');
const APIroutes = require('./routes/api/');
const cookieParser = require('cookie-parser');

const mqttHandler = require('./mqttGestion');

global.JWTToken = process.env.TokenJWT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', APIroutes);
app.use('/', routes);
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, ip, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});



