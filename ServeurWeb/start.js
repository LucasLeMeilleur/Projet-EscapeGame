require('dotenv').config();

const ip = "127.0.0.1";
const port = 3000;
const express = require('express');
const app = express();  
const path = require('path')
const routes = require('./routes/web/');
const APIroutes = require('./routes/api/');
const keyRSA = require('./keyRSA');
const cookieParser = require('cookie-parser');

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

if(global.keyRSA.getPublicKey() && global.keyRSA.getPrivateKey()){
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Clé RSA activé');

}else{
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Clé RSA non active');
}
