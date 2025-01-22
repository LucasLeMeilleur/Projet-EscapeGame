require('dotenv').config();

console.log(process.env.DB_USER);

const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const routes = require('./routes/web/');
const APIroutes = require('./routes/api/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use('/', routes);
app.use('/api', APIroutes);
app.set('view engine', 'ejs');
app.set('views', './views');


app.use((req, res) => {
    res.status(404).render('error/404');
});

app.use((req, res) => {
    res.status(502).render('error/502');
});

app.listen(port, "127.0.0.1", () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});