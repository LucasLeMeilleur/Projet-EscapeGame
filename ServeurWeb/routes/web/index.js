const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.status(200).render('index');
})

router.get('/index', (req,res)=>{
    res.status(200).render('index');
})

router.get('/lien', (req,res)=>{
    res.status(200).render('lien');
})




router.get('/login', (req,res)=>{
    res.status(200).render('login');
})




module.exports = router;