const sequelize = require('../../../config/database');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const TableUtilisateur = require('../../../models/utilisateur');
const { format } = require('path');

// Fonction utile

function decryptWithPrivateKey(encryptedMessage) {
  try {

    const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');

    console.log("test");


    const decryptedBuffer = crypto.privateDecrypt(
      {
        key: global.keyRSA.getPrivateKey(),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // OAEP Padding pour plus de sécurité
        oaepHash: 'sha256', // Algorithme de hachage utilisé
      },
      encryptedBuffer
    );

    return decryptedBuffer.toString('utf-8');
  } catch (error) {
    console.error('Erreur lors du déchiffrement :', error.message);
    return false;
  }
}

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

    res.status(200).json(rep);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
}

// POST

exports.regiserUser = async (req, res) => {
  try {
    const ReqData = req.body;
    const DecryptedForm = decryptWithPrivateKey((ReqData.encryptedForm));
    if (!DecryptedForm) {
      res.status(407).send("Formulaire non chiffré");
      return;
    }

    const JSONDecryptedForm = JSON.parse(DecryptedForm)
    const Username = JSONDecryptedForm.username;
    const Password = JSONDecryptedForm.password;
    const Email = JSONDecryptedForm.email;

    if (!Password || !Username || !Email) {
      res.status(400).send("Formulaire incomplet");
      return;
    }

    if (!isValidEmail(Email)) {
      res.status(400).send("Mail invalide");
      return;
    }

    const repDejaPresent = await TableUtilisateur.findOne({
      where: {
        email: Email,
      }
    }) 

    if (repDejaPresent){
      return res.status(400).send("Un compte est deja associé a cette adresse mail");
    }

    const hashedPassword = await bcrypt.hash(Password, 15);

    const rep = await TableUtilisateur.create({
      username: Username,
      password: hashedPassword,
      email: Email,
      permission: 0
    })

    const user = await TableUtilisateur.findOne({ where: { email: Email } });
    if (!user) {
      return res.status(400).send("Identifiants introuvable");
      
    }



    const token = jwt.sign(
      { id: user.idUser, permission: user.permission },
      global.JWTToken,
      { expiresIn: '8h' }
    );


    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json(rep);
    
  } catch (error) {
    res.status(500).json({ message: error.message })
    return;
  }
}

exports.loginUser = async (req, res) => {

  try {
    const ReqData = req.body
    const DecryptedForm = decryptWithPrivateKey((ReqData.encryptedForm));
    
    if (!DecryptedForm) {
      res.status(400).send("Formulaire non chiffré");
      return;
    }
    
    

    const JSONDecryptedForm = JSON.parse(DecryptedForm);
    const Email = JSONDecryptedForm.email;
    const Password = JSONDecryptedForm.password;



    if (!Email || !Password) {
      res.status(400).send("Formulaire invalide");
      return;
    }

    const user = await TableUtilisateur.findOne({ where: { email: Email } });
    if (!user) {
      res.status(400).send("Identifiants introuvable");
      return;
    }

    console.log(user.permission);
    

    const isValidPassword = await bcrypt.compare(Password, user.password);
    if (!isValidPassword) return res.status(400).json({ error: 'Mot de passe incorrect.' });




    const token = jwt.sign(
      { id: user.idUser, permission: user.permission },
      global.JWTToken,
      { expiresIn: '8h' }
    );


    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'Connexion réussie !' });
    
  } catch (error) {
    res.status(500).json({ message: error.message })
    return;
  }
}

exports.nomUser = async (req, res) => {
  try {
    const userId = req.query.idUser;
    const type = req.query.type;    

    if (!userId || !type) {
      res.status(400).send("No or type");
      return;
    }

    var TabAttribute;
    if (type == "all") {
      TabAttribute = ["username", "email", "permission"];
    } else {
      TabAttribute = [type];
    }

    const rep = await TableUtilisateur.findOne({
      attributes: TabAttribute,
      where: { idUser: userId }
    });

    res.status(200).json( rep )
    return;
  } catch (error) {
    res.status(500).json({ message: error.message })
    return;
  }
}