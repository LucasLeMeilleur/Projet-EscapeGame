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
    const { username, password, email } = req.body;

    if (!password || !username || !email) return res.status(400).json({ message: "Formulaire incomplet" });

    if (!isValidEmail(email)) return res.status(400).json({ message: "Mail invalide" });

    const repDejaPresent = await TableUtilisateur.findOne({
      where: { email }
    })

    if (repDejaPresent) return res.status(400).json({ message: "Un compte est deja associé a cette adresse mail" });

    const hashedPassword = await bcrypt.hash(password, 15);

    const nouveauUtilisateur = await TableUtilisateur.create({
      username,
      password: hashedPassword,
      email,
      permission: 0
    })

    const token = jwt.sign(
      { id: nouveauUtilisateur.idUser, permission: nouveauUtilisateur.permission },
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
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Formulaire invalide" });

    const user = await TableUtilisateur.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Identifiants introuvable" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Mot de passe incorrect." });

    console.log(user)

    const token = jwt.sign(
      { id: user.idUser, permission: user.permission, pseudo: user.username, email: user.email },
      global.JWTToken,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false });
    return res.status(200).json({ message: "Connexion réussie !" });
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.nomUser = async (req, res) => {
  try {

    const { idUser: userId, type } = req.query;

    if (!userId || !type) return res.status(400).send("No or type");

    var TabAttribute;
    if (type == "all") TabAttribute = ["username", "email", "permission"];
    else TabAttribute = [type];

    const rep = await TableUtilisateur.findOne({
      attributes: TabAttribute,
      where: { idUser: userId }
    });

    return res.status(200).json(rep)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.MajUtilisateur = async (req, res) => {
  try {
    const { idUser, username, email, permission } = req.body;

    if (!idUser || !username || !email || typeof permission === "undefined") return res.status(401).json({ message: "Formulaire incomplet" });

    const utilisateur = await TableUtilisateur.findOne({
      where: { idUser }
    });

    if (!utilisateur) return res.status(404).json({ message: "Utilisateur inexistant" });

    const [nbUpdated] = await TableUtilisateur.update(
      {
        username,
        email,
        permission
      },
      {
        where: { idUser }
      }
    );

    if (nbUpdated === 0) return res.status(418).json({ message: "Aucune modification détectée ou utilisateur inexistant" });

    return res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur MajUtilisateur:", error);
    return res.status(500).json({ message: error.message });
  }
};


exports.SupprimerUtilisateur = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) return res.status(400).json({ message: "ID manquant" });

    const utilisateur = await TableUtilisateur.findByPk(id);
    if (!utilisateur) return res.status(404).json({ message: "Utilisateur non trouvée" });

    await utilisateur.destroy();

    return res.json({ message: "Utilisateur supprimée avec succès" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

exports.RecupInfoPerso = async (req, res) => {
  try {
    const id = req.user.id;

    if (!id) return res.status(400).json({ message: "Non connecté" });

    const rep = await TableUtilisateur.findOne({
      where: { idUser: id },
      attributes: ["email", "username"]
    })

    return res.status(200).json(rep);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}

exports.ChangerPassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { oldPassword: nouveauMdp, newPassword: ancientMdp } = req.body;

    if (!ancientMdp || !nouveauMdp) return res.status(400).json({ message: "Formulaire invalide" });
    if (!id) return res.status(400).json({ message: "Non connecté" });

    const user = await TableUtilisateur.findOne({ where: { idUser: id } });

    const isValidPassword = await bcrypt.compare(ancientMdp, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Mot de passe incorrect." });

    const hashedPassword = await bcrypt.hash(nouveauMdp, 15);

    const rep = await TableUtilisateur.update(
      { password: hashedPassword },
      { where: { idUser: id } }
    );

    return res.status(200).json(rep);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}