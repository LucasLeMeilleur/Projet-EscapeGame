const sequelize = require('../../../config/database');
const bcrypt = require('bcrypt');
const NodeRSA = require('node-rsa');
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

exports.addUser = async (req, res) => {
  try {
    const ReqData = req.body;
    const DecryptedForm = decryptWithPrivateKey((ReqData.encryptedForm));

    if(!DecryptedForm){
      res.status(407).send("Formulaire non chiffré");
      return;
    }

    const JSONDecryptedForm = JSON.parse(DecryptedForm)
    const Username = JSONDecryptedForm.username;
    const Password = JSONDecryptedForm.password;
    const Email = JSONDecryptedForm.email;

    if(!Password || !Username || !Email){
      res.status(407).send("Formulaire incomplet");      
      return;
    }

    if(!isValidEmail(Email)){
      res.status(407).send("Mail invalide");
      return;
    }

    const hashedPassword = await bcrypt.hash(Password, 15);

    const rep = await TableUtilisateur.create({
      username: Username,
      password: hashedPassword,
      email: Email,
      permission: 0
    })

    res.status(200).json(rep);
  } catch (error) {
    res.status(500).json({ message: error.message })
    return;
  }
}