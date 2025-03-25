const sequelize = require('../../../config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');  
const TableUtilisateur = require('../../../models/utilisateur');
const { format } = require('path');
const { json } = require('sequelize');

// Fonction utile



function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}




// GET

exports.listeUser = async (req, res) => {

  try {
    const rep = await TableUtilisateur.findAll({
      attributes: ['idUser', 'username', 'email', 'permission']
    });

    return res.status(200).json(rep);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// POST

exports.regiserUser = async (req, res) => {
  try {
    const ReqData = req.body;

    const Username = ReqData.username;
    const Password = ReqData.password;
    const Email = ReqData.email;

    if (!Password || !Username || !Email) return res.status(400).json({message: "Formulaire incomplet"});
      
    if (!isValidEmail(Email)) return res.status(400).json({message: "Mail invalide"});
      
    const repDejaPresent = await TableUtilisateur.findOne({
      where: {
        email: Email,
      }
    }) 


    if (repDejaPresent) return res.status(400).json({message: "Un compte est deja associé a cette adresse mail"});
    
    const hashedPassword = await bcrypt.hash(Password, 15);

    const rep = await TableUtilisateur.create({
      username: Username,
      password: hashedPassword,
      email: Email,
      permission: 0
    })

    const user = await TableUtilisateur.findOne({ where: { email: Email } });
    if (!user) return res.status(400).json({message: "Identifiants introuvable"});

    const token = jwt.sign(
      { id: user.idUser, permission: user.permission },
      global.JWTToken,
      { expiresIn: '8h' }
    );


    res.cookie('token', token, { httpOnly: true, secure: false });
    return res.status(200).json(rep);
    
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const ReqData = req.body;
    
      
    const Email = ReqData.email;
    const Password = ReqData.password;

    if (!Email || !Password) return res.status(400).json({message: "Formulaire invalide"});
      
    const user = await TableUtilisateur.findOne({ where: { email: Email } });
    if (!user) return res.status(400).json({message: "Identifiants introuvable"});    

    const isValidPassword = await bcrypt.compare(Password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user.idUser, permission: user.permission },
      global.JWTToken,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false });
    return res.status(200).json({ message: "Connexion réussie !" });
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}

exports.nomUser = async (req, res) => {
  try {
    const userId = req.query.idUser;
    const type = req.query.type;    

    if (!userId || !type) return res.status(400).send("No or type");

    var TabAttribute;
    if (type == "all") TabAttribute = ["username", "email", "permission"];
    else TabAttribute = [type];

    const rep = await TableUtilisateur.findOne({
      attributes: TabAttribute,
      where: { idUser: userId }
    });

    return res.status(200).json( rep )
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

