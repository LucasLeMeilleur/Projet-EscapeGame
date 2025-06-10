const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Fonctions utile

// Verifie le niveau de permission de l'utilisateur
function verifyAccess(levelRequired) {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(403).render('error/403', { erreur: "Vous n'etes pas connecté" });
        jwt.verify(token, global.JWTToken, (err, decoded) => {
            if (err) return res.status(403).render('error/403', { erreur: "Session invalide, veuillez vous reconnecter." });
            req.user = decoded;
            if (req.user.permission < levelRequired) return res.status(403).render('error/403', { erreur: "Acces interdit" });

            next();
        });
    };
}

// Regarde si l'utilisateur est connecté 
function optionalAuthenticateToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return next();
    jwt.verify(token, global.JWTToken, (err, decoded) => {
        if (!err){
            // User contient le pseudo, l'email et la permission du user
            req.User = decoded;
            req.userId = decoded.id;
        } 
        next();
    });
}

// Verification si l'utilisateur est connecté ou non
function noAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return next();
    return res.redirect('/');
}


////////////////////////  Les routes ///////////////////////////

router.get('/', optionalAuthenticateToken, (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            console.log(rep);
            if (rep.permission >= 0) res.status(200).render('index', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else res.status(200).render('index');
        } catch (error) {
            res.status(200).render('index');
        }
    }
    else res.status(200).render('index');
});

router.get('/index', optionalAuthenticateToken, (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            console.log(rep);
            if (rep.permission >= 0) res.status(200).render('index', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else res.status(200).render('index');
        } catch (error) {
            res.status(200).render('index');
        }
    }
    else res.status(200).render('index');
});

router.get('/register', noAuth, (req, res) => {
    res.status(200).render('inscription');
});

router.get('/login', noAuth, (req, res) => {
    res.status(200).render('login');
});

router.get('/logout', (req, res) => {
    const host = req.headers.host;
    res.clearCookie('token').redirect(`http://${host}/`);
});

router.get('/reservation', optionalAuthenticateToken, verifyAccess(0), (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            if (rep.permission >= 0) return res.status(200).render('reservation', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(200).render('reservation');
        } catch (error) {
            return res.status(200).render('login'); 
        }
    }
    else return res.render('login');
});

router.get('/scoreboard', optionalAuthenticateToken, (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            if (rep.permission >= 0) return res.status(200).render('scoreboard', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(200).render('scoreboard');
        } catch (error) {
            return res.status(200).render('scoreboard'); 
        }
    }
    else return res.render('scoreboard');
});

router.get('/compte', optionalAuthenticateToken, verifyAccess(0), (req, res) => {
    if (req.User) {
        try{
            rep = req.User;
            if (rep.permission >= 0) return res.status(200).render('compte', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(403).render("error/403", { message: "Vous êtes déconnecté" });
        }
        catch(error){
            return res.redirect('error/500');
        }
    } else return res.status(200).redirect('/');
});

router.get('/admin', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.User) {
        try{
            rep = req.User;
            if (rep.permission >= 1) return res.status(200).render('admin', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(403).render("error/403", { permission: rep.permission });
        }
        catch(error){
            res.status(200).render('error/500');
        }
    } 
    else return res.redirect("error/403");
});

router.get('/admin/mission', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.User) {
        try{
            rep = req.User;
            if (rep.permission >= 1) return res.status(200).render('mission', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(403).render("error/403", { permission: rep.permission });
        }
        catch(error){
            res.status(200).render('error/500');
        }
    } 
    else return res.redirect("error/403");
});


router.get('/admin/gestion-partie', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.User) {
        axios.get('http://127.0.0.1:3000/api/game/partie/active') // Remplace par l'URL de ta 2ème requête
            .then(reponse => {
                rep = req.User
                rep2 = reponse.data;

                if (rep.permission >= 1 && rep2 != undefined && rep2.length > 0) res.status(200).render('admin/gestion', { pseudo: rep.username, email: rep.email, permission: rep.permission, partie: true });
                else if (rep.permission >= 1) res.status(200).render('admin/gestion', { pseudo: rep.username, email: rep.email, permission: rep.permission, partie: false });


                else return res.status(403).render("error/403", { permission: rep.permission });
            })
            .catch(error => {
                return res.status(500).redirect('error/500');
            })
    } else return res.redirect("error/403");
});

router.get('/admin/pannel', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            if (rep.permission >= 1) return res.status(200).render('admin/pannel', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(403).render("error/403", { permission: rep.permission });
        } catch (error) {
            res.status(403).render('error/403');
        }
    } else return res.render("error/403");
});

router.use(optionalAuthenticateToken, (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            if (rep.permission >= 0) return res.status(404).render('error/404', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(404).render("error/404");
        } catch (error) {
            return res.render('error/404');
        }
    } else return res.status(404).render('error/404');
});

router.use(optionalAuthenticateToken, (req, res) => {
    if (req.User) {
        try {
            rep = req.User;
            if (rep.permission >= 0) return res.status(200).render('error/502', { pseudo: rep.username, email: rep.email, permission: rep.permission });
            else return res.status(502).render('error/502');
        } catch (error) {
            return res.status(502).render('error/502');
        }
    } else return res.status(502).render('error/502');
});


module.exports = router;