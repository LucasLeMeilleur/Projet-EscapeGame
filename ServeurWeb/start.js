require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const routes = require('./routes/web/');
const APIroutes = require('./routes/api/');
const keyRSA = require('./keyRSA');
const cookieParser = require('cookie-parser');




app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use('/', routes);
app.use('/api', APIroutes);
app.set('view engine', 'ejs');
app.set('views', './views');


global.JWTToken = process.env.TokenJWT;


app.use((req, res) => {
    res.status(404).render('error/404');
});

app.use((req, res) => {
    res.status(502).render('error/502');
});

app.listen(port, "127.0.0.1", () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});

if(global.keyRSA.getPublicKey() && global.keyRSA.getPrivateKey()){
    console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Clé RSA activé');

}else{
    console.log('\x1b[1m\x1b[31m%s\x1b[0m', 'Clé RSA non active');
}
