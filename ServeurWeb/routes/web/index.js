const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const app = express();

// Fonctions utile

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

function optionalAuthenticateToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return next();
    jwt.verify(token, global.JWTToken, (err, decoded) => {
        if (!err) req.userId = decoded.id;
        next();
    });
}

function noAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return next(); // Pas de token, on passe à la suite

    jwt.verify(token, global.JWTToken, async (err, decoded) => {
        if (err) return next(); // Token invalide, on passe à la suite

        req.userId = decoded.id;

        try {
            const response = await axios.get('http://127.0.0.1:3000/api/user', {
                params: { idUser: req.userId, type: "all" }
            });

            const rep = response.data;
            if (rep.permission >= 0) {
                return res.status(403).render("error/403", { pseudo: rep.username, email: rep.email, permission: rep.permission });
            }
        } catch (error) {
            console.error("Erreur Axios:", error);
        }

        // Si on arrive ici, c'est que l'utilisateur n'a pas de permission ou que la requête a échoué
        next();
    });
}

module.exports = noAuth;




////////////////////////  Les routes ///////////////////////////

router.get('/', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) res.status(200).render('index', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else res.status(200).render('index');
            })
            .catch(error => {
                res.status(200).render('index');
            })
    }
    else res.status(200).render('index');
});

router.get('/index', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(200).render('index', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(200).render('index');
            })
            .catch(error => {
                return res.status(200).render('index');
            })
    }
    else return res.status(200).render('index');
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
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(200).render('reservation', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(200).render('reservation');
            })
            .catch(error => {
                return res.status(200).render('reservation');
            })
    }
    else return res.render('login');
});

router.get('/salle', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(200).render('salle', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(200).render('salle');
            })
            .catch(error => {
                return res.status(200).render('salle');
            })
    }
    else return res.status(200).render('salle');
});


router.get('/scoreboard', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(200).render('scoreboard', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(200).render('scoreboard');
            })
            .catch(error => {
                return res.status(200).render('scoreboard');
            })
    }
    else return res.status(200).render('scoreboard');
});

router.get('/contact', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;

                if (rep.permission >= 0) return res.status(200).render('contact', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(200).render('contact');
            })
            .catch(error => {
                return res.status(200).render('contact');
            })
    }
    else return res.status(200).redirect('contact');
});

router.get('/compte-gestion', optionalAuthenticateToken, verifyAccess(0), (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(200).render('gestionCompte', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(403).render("error/403", { message: "Vous êtes déconnecté" });
            })
            .catch(error => {
                return res.redirect('error/500');
            })
    } else return res.status(200).redirect('/');
});

router.get('/admin', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 1) return res.status(200).render('admin', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(403).render("error/403", { permission: rep.permission });
            })
            .catch(error => {
                res.status(200).render('error/500');
            })
    } else return res.redirect("error/403");
});


router.get('/admin/gestion-partie', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 1) res.status(200).render('admin/gestion', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(403).render("error/403", { permission: rep.permission });
            })
            .catch(error => {
                return res.redirect('error/500');
            })
    } else return res.redirect("error/403");
});

router.get('/admin/pannel', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 1) return res.status(200).render('gestion/pannel', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(403).render("error/403", { permission: rep.permission });
            })
            .catch(error => {
                res.status(403).render('error/403');
            })
    } else return res.render("error/403");
});

router.use(optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(404).render('error/404', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(404).render("error/404");
            })
            .catch(error => {
                return res.render('error/404');
            })
    } else return res.status(404).render('error/404');
});

router.use(optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                if (rep.permission >= 0) return res.status(200).render('error/502', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                else return res.status(502).render('error/502');
            })
            .catch(error => {
                return res.status(502).render('error/502');
            })
    } else return res.status(502).render('error/502');
});

router.get('/php', (req, res) => {
    const host = req.headers.host;
    res.redirect(`https://${host}/phpmyadmin/`);
});

router.get('/p', (req, res) => {
    const host = req.headers.host;
    res.redirect(`https://${host}/phpmyadmin/`);
});



module.exports = router;