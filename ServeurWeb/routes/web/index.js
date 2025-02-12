const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');


// Fonctions utile

function verifyAccess(levelRequired) {
    return (req, res, next) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).render('error/404', { erreur: "Acces refusé, non connecté" });
  
      jwt.verify(token, global.JWTToken, (err, decoded) => {
        if (err) return res.status(403).render('error/404', { erreur: "Tokken invalide" });
  
        req.user = decoded;
        console.log(decoded);
        
        if (req.user.permission < levelRequired) {
          return res.status(403).render('error/404', { erreur: "Acces interdit" });
        }
        next();
      });
    };
}

function optionalAuthenticateToken(req, res, next) {
    const token = req.cookies?.token;
    
    if (!token) {
        return next(); 
    }
    jwt.verify(token, global.JWTToken, (err, decoded) => {
        if (!err) {
            req.userId = decoded.id;
        }       
        next(); 
    });
}

router.get('/', optionalAuthenticateToken, (req,res)=>{
    console.log(req.userId);
    
    if(req.userId){
        console.log("connecté");
        axios.get('http://localhost:3000/api/user', {
            params: { idUser: req.userId , type: "all"} 
        })
        .then(response=>{
            rep = response.data;
            console.log(rep);

            if(rep.permission){
                res.status(200).render('index', {pseudo: rep.username, email: rep.email, permission: rep.permission});
            }else{
                res.status(200).render('index', {pseudo: rep.username, email: rep.email});
            }
        })
        .catch(error=>{
            console.log(error);
            res.status(200).render('index');
        })
    }
    else {
        console.log("déconnecté");
        res.status(200).render('index');
    }
});

router.get('/index', optionalAuthenticateToken, (req,res)=>{
    res.status(200).render('index');
});

router.get('/lien', (req,res)=>{
    res.status(200).render('lien');
});

router.get('/register', (req,res)=>{
    res.status(200).render('inscription');
});

router.get('/reservation', (req,res)=>{
    res.status(200).render('reservation');
});

router.get('/login', (req,res)=>{
    res.status(200).render('login');
});

router.get('/admin', verifyAccess(1), (req,res)=>{
    res.status(200).render('admin');
});

router.get('/admin/gestion-partie', verifyAccess(1), (req,res)=>{
    res.status(200).render('admin/gestion');
});

router.get('/admin/pannel', verifyAccess(1), (req,res)=>{
    res.status(200).render('admin/pannel');
});


module.exports = router;