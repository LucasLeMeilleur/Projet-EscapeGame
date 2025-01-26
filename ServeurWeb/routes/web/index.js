const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');


// Fonctions utile

function verifyAccess(levelRequired) {
    return (req, res, next) => {
      const token = req.cookies.token;
      if (!token) return res.status(401).render('error/404', { erreur: "Acces refusé, non connecté" });
  
      jwt.verify(token, global.JWTToken, (err, decoded) => {
        if (err) return res.status(403).render('error/404', { erreur: "Tokken invalide" });
  
        req.user = decoded;
        if (req.user.autorisation < levelRequired) {
          return res.status(403).render('error/404', { erreur: "Acces interdit" });
        }
        next();
      });
    };
}



router.get('/', (req,res)=>{
    res.status(200).render('index');
});

router.get('/index', (req,res)=>{
    res.status(200).render('index');
});

router.get('/lien', (req,res)=>{
    res.status(200).render('lien');
});

router.get('/register', (req,res)=>{
    res.status(200).render('inscription');
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