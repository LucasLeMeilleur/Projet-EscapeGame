const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');


// Fonctions utile

function verifyAccess(levelRequired) {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).render('error/401', { erreur: "Vous n'etes pas connecté" });
        jwt.verify(token, global.JWTToken, (err, decoded) => {
            if (err) return res.status(403).render('error/404', { erreur: "Session invalide, veuillez vous reconnecter." });
            req.user = decoded;
            console.log(decoded);
            if (req.user.permission < levelRequired) {
                return res.status(403).render('error/403', { erreur: "Acces interdit" });
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

function noAuth(req, res, next) {
    const token = req.headers['token'];

    if (token) {
        // Si un token est présent, on empêche l'accès
        jwt.verify(token, global.JWTToken, (err) => {
            if (!err) {
                return res.status(403).json({ message: "Vous êtes déjà connecté." });
            }
        });
    }
    // Si pas de token ou token invalide, on passe à la suite
    next();
}



router.get('/', optionalAuthenticateToken, (req, res) => {

    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('index', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('index', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(200).render('index');
            })
    }
    else {
        console.log("déconnecté");
        res.status(200).render('index');
    }
});

router.get('/index', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('index', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('index', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(200).render('index');
            })
    }
    else {
        console.log("déconnecté");
        res.status(200).render('index');
    }
});

// router.get('/lien', optionalAuthenticateToken, (req, res) => {
//     res.status(200).render('lien');
// });

router.get('/register', noAuth, (req, res) => {
    res.status(200).render('inscription');
});

router.get('/reservation', optionalAuthenticateToken, (req, res) => {
    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('reservation', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('reservation', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(200).render('reservation');
            })
    }
    else {
        console.log("déconnecté");
        res.status(200).render('index');
    }
});

router.get('/login', noAuth, (req, res) => {
    res.status(200).render('login');
});


router.get('/logout', verifyAccess(0), (req, res) => {
    const host = req.headers.host;
    res.clearCookie('token').redirect(`https://${host}/`);

});


router.get('/admin', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('admin', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('admin', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(200).render('admin');
            })
    }
});


router.get('/compte-gestion', optionalAuthenticateToken, verifyAccess(0), (req, res) => {
    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('gestionCompte', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('gestionCompte', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(500).send("Erreur compte");
            })
    }
});

router.get('/admin/gestion-partie', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('admin/gestion', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('admin/gestion', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(200).render('admin/gestion');
            })
    }
});

router.get('/admin/pannel', optionalAuthenticateToken, verifyAccess(1), (req, res) => {
    if (req.userId) {
        console.log("Iduser de la req : " + req.userId);
        axios.get('http://127.0.0.1:3000/api/user', {
            params: { idUser: req.userId, type: "all" }
        })
            .then(response => {
                rep = response.data;
                console.log(rep);

                if (rep.permission) {
                    console.log("permission")
                    res.status(200).render('gestion/pannel', { pseudo: rep.username, email: rep.email, permission: rep.permission });
                } else {
                    console.log("pas de perm");
                    res.status(200).render('gestion/pannel', { pseudo: rep.username, email: rep.email });
                }
            })
            .catch(error => {
                console.log("erreur");
                res.status(200).render('gestion/pannel');
            })
    }
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