-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mar. 10 juin 2025 à 08:17
-- Version du serveur : 8.0.42-0ubuntu0.24.04.1
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `escapegame`
--

-- --------------------------------------------------------

--
-- Structure de la table `equipe`
--

CREATE TABLE `equipe` (
  `idequipe` int NOT NULL,
  `nom` varchar(70) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nombre_joueur` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `equipe`
--

INSERT INTO `equipe` (`idequipe`, `nom`, `date`, `nombre_joueur`) VALUES
(1, 'Freres Jacques', '2025-01-22 15:08:55', 2),
(2, 'Tueur2Fourmis', '2025-03-31 11:24:18', 4),
(5, 'Test', '2025-03-31 11:26:52', 45);

-- --------------------------------------------------------

--
-- Structure de la table `game`
--

CREATE TABLE `game` (
  `idgame` int NOT NULL,
  `idmissionEtat` int DEFAULT NULL,
  `idscenario` int NOT NULL,
  `dateCreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateDepart` timestamp NULL DEFAULT NULL,
  `idequipe` int NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '0',
  `terminee` tinyint(1) NOT NULL DEFAULT '0',
  `duree` smallint DEFAULT NULL,
  `idsalle` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `game`
--

INSERT INTO `game` (`idgame`, `idmissionEtat`, `idscenario`, `dateCreation`, `dateDepart`, `idequipe`, `actif`, `terminee`, `duree`, `idsalle`) VALUES
(4, 87, 1, '2025-01-27 16:59:37', '2025-03-21 07:16:25', 1, 0, 1, 200, 1),
(5, 1, 1, '2025-03-21 15:43:38', '2025-03-21 15:00:15', 1, 0, 0, NULL, 1),
(6, 1, 1, '2025-03-22 15:31:03', NULL, 1, 0, 1, NULL, 1),
(7, 1, 1, '2025-03-22 16:26:33', NULL, 1, 0, 2, NULL, 1),
(26, 21, 1, '2025-03-26 15:45:25', '2025-03-26 15:47:01', 1, 0, 0, NULL, 1),
(27, 44, 1, '2025-03-27 08:16:30', '2025-03-27 08:18:02', 1, 0, 1, -1, 1),
(28, 47, 2, '2025-03-28 13:01:40', '2025-03-28 13:11:32', 1, 0, 0, NULL, 1),
(29, 50, 2, '2025-03-28 13:18:05', '2025-03-28 13:18:27', 1, 0, 1, 1500, 1),
(30, 53, 2, '2025-03-28 13:36:19', '2025-03-28 13:37:32', 1, 0, 1, 3322, 1),
(31, 56, 2, '2025-03-28 13:43:05', '2025-03-31 09:03:03', 1, 0, 1, -1, 1),
(32, 61, 1, '2025-03-31 11:11:05', '2025-03-31 11:11:36', 1, 0, 1, 20, 1),
(33, 66, 1, '2025-04-02 12:54:51', '2025-04-02 12:55:12', 5, 0, 1, -1, 1),
(34, 71, 1, '2025-04-02 14:50:48', '2025-04-02 14:51:28', 2, 0, 1, 60, 1),
(35, 76, 1, '2025-04-02 14:55:15', '2025-04-02 14:55:39', 1, 0, 1, 30, 1),
(37, 82, 2, '2025-04-04 09:02:23', '2025-04-04 11:54:09', 1, 0, 0, NULL, 1),
(38, 83, 2, '2025-04-04 09:02:23', '2025-04-04 11:55:10', 2, 0, 0, NULL, 1),
(39, 84, 2, '2025-04-04 09:02:23', '2025-04-04 12:14:35', 2, 0, 0, NULL, 1),
(40, 85, 2, '2025-04-04 12:16:21', '2025-04-04 12:17:13', 2, 0, 0, NULL, 1),
(41, 90, 2, '2025-04-08 08:40:20', '2025-04-08 08:48:31', 1, 0, 1, 1530, 1),
(42, 94, 2, '2025-04-08 09:16:06', '2025-04-09 14:31:32', 2, 0, 0, NULL, 1),
(43, 97, 2, '2025-04-08 09:16:06', '2025-04-09 14:35:38', 2, 0, 1, 398, 1),
(44, 100, 2, '2025-04-10 06:35:08', '2025-04-10 06:36:31', 1, 0, 1, 288, 1),
(45, 101, 1, '2025-04-30 12:16:21', '2025-05-20 09:14:00', 5, 0, 1, NULL, 1),
(46, 102, 1, '2025-05-14 08:26:43', '2025-05-22 07:08:15', 2, 0, 1, NULL, 1),
(47, 105, 2, '2025-05-14 08:26:43', '2025-05-22 07:09:58', 2, 0, 1, -1, 1),
(48, 110, 1, '2025-06-04 12:18:44', '2025-06-04 12:19:26', 5, 0, 1, 859, 1),
(49, 113, 2, '2025-06-04 12:33:36', '2025-06-04 12:35:22', 1, 1, 1, 51, 1);

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

CREATE TABLE `mission` (
  `idmission` int NOT NULL,
  `nom` varchar(100) NOT NULL,
  `tempsRequis` smallint NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mission`
--

INSERT INTO `mission` (`idmission`, `nom`, `tempsRequis`, `description`) VALUES
(1, 'Mission 1', 200, 'asas'),
(2, 'Truc', 200, 'da'),
(3, 'bidule', 200, 'da'),
(4, 'zgoug', 200, 'da'),
(5, 'fzfz', 401, 'dada'),
(6, 'Zf', 401, 'dada'),
(7, 'Zfada', 401, 'dada');

-- --------------------------------------------------------

--
-- Structure de la table `missionEtat`
--

CREATE TABLE `missionEtat` (
  `idetat` int NOT NULL,
  `heuredebut` time NOT NULL,
  `heurefin` time DEFAULT NULL,
  `idgame` int NOT NULL,
  `idmission` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `missionEtat`
--

INSERT INTO `missionEtat` (`idetat`, `heuredebut`, `heurefin`, `idgame`, `idmission`) VALUES
(1, '18:31:33', '11:04:09', 5, 1),
(2, '08:38:35', NULL, 15, 1),
(3, '08:38:38', NULL, 16, 1),
(4, '08:38:54', NULL, 17, 1),
(5, '08:41:22', NULL, 18, 1),
(9, '08:49:19', NULL, 22, 1),
(21, '16:46:06', NULL, 26, 1),
(22, '09:17:56', '10:54:52', 27, 1),
(32, '09:54:52', '10:55:05', 27, 2),
(42, '10:04:04', '11:04:42', 27, 5),
(43, '10:04:42', '11:04:43', 27, 4),
(44, '10:04:43', '14:10:57', 27, 6),
(45, '14:11:25', '14:13:30', 28, 1),
(46, '13:13:30', '14:13:42', 28, 4),
(47, '13:13:42', NULL, 28, 5),
(48, '14:18:23', '14:18:38', 29, 1),
(49, '13:18:38', '14:19:19', 29, 4),
(50, '13:19:19', '14:37:39', 29, 5),
(51, '14:37:28', '14:37:45', 30, 1),
(52, '13:37:45', '14:37:50', 30, 4),
(53, '13:37:50', '14:42:09', 30, 5),
(54, '11:02:57', '11:14:33', 31, 1),
(55, '11:14:33', '11:15:04', 31, 4),
(56, '11:15:04', '13:07:38', 31, 5),
(57, '13:11:28', '13:11:51', 32, 1),
(58, '11:11:51', '13:11:52', 32, 2),
(59, '11:11:52', '13:11:53', 32, 5),
(60, '11:11:53', '13:11:54', 32, 4),
(61, '11:11:54', '08:39:52', 32, 6),
(62, '14:54:58', '16:29:00', 33, 1),
(63, '14:29:00', '16:29:17', 33, 2),
(64, '14:29:17', '16:29:25', 33, 5),
(65, '14:29:25', '16:29:37', 33, 4),
(66, '14:29:37', '16:51:00', 33, 6),
(67, '16:51:15', '16:51:51', 34, 1),
(68, '14:51:51', '16:52:01', 34, 2),
(69, '14:52:01', '16:52:12', 34, 5),
(70, '14:52:12', '16:52:20', 34, 4),
(71, '14:52:20', '16:53:23', 34, 6),
(72, '16:55:23', '16:55:37', 35, 1),
(73, '14:55:37', '16:55:48', 35, 2),
(74, '14:55:48', '16:55:56', 35, 5),
(75, '14:55:56', '16:56:01', 35, 4),
(76, '14:56:01', '11:13:47', 35, 6),
(77, '10:58:12', '11:03:20', 36, 1),
(78, '09:03:20', '11:06:13', 36, 1),
(79, '09:04:09', '13:46:23', 4, 2),
(80, '09:06:13', NULL, 36, 2),
(81, '11:46:23', '09:35:41', 4, 5),
(82, '13:48:59', NULL, 37, 2),
(83, '13:55:04', NULL, 38, 2),
(84, '14:14:30', NULL, 39, 2),
(85, '14:16:39', NULL, 40, 2),
(86, '07:35:41', '10:26:09', 4, 4),
(87, '08:26:09', NULL, 4, 6),
(88, '10:48:14', '10:48:35', 41, 2),
(89, '08:48:35', '10:52:03', 41, 1),
(90, '08:52:03', '15:32:34', 41, 4),
(91, '16:31:27', '16:31:36', 42, 2),
(92, '14:31:36', NULL, 42, 1),
(93, '14:31:36', '16:33:04', 42, 1),
(94, '14:33:04', NULL, 42, 3),
(95, '16:35:11', '16:35:42', 43, 2),
(96, '14:35:42', '16:39:10', 43, 1),
(97, '14:39:10', '08:40:09', 43, 3),
(98, '08:36:22', '08:40:31', 44, 2),
(99, '06:40:31', '08:41:10', 44, 1),
(100, '06:41:10', '08:41:18', 44, 3),
(101, '14:34:01', NULL, 45, 1),
(102, '09:08:11', NULL, 46, 1),
(103, '09:09:52', '09:10:02', 47, 2),
(104, '07:10:02', '09:21:44', 47, 1),
(105, '07:21:44', NULL, 47, 3),
(106, '14:19:20', '14:21:33', 48, 1),
(107, '12:21:33', '14:21:49', 48, 2),
(108, '12:21:49', '14:21:56', 48, 5),
(109, '12:21:56', '14:22:02', 48, 4),
(110, '12:22:02', '14:33:45', 48, 6),
(111, '14:35:17', '14:35:58', 49, 2),
(112, '12:35:58', '14:36:06', 49, 1),
(113, '12:36:06', '14:36:13', 49, 3);

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `idreservation` int NOT NULL,
  `date` timestamp NOT NULL,
  `utilisateur` int NOT NULL,
  `salle` int NOT NULL,
  `equipe` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`idreservation`, `date`, `utilisateur`, `salle`, `equipe`) VALUES
(4, '2025-01-22 15:08:55', 2, 1, 1),
(5, '2025-04-24 08:00:00', 2, 1, NULL),
(6, '2025-04-17 09:00:00', 2, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `salle`
--

CREATE TABLE `salle` (
  `idsalle` int NOT NULL,
  `nom` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ville` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `salle`
--

INSERT INTO `salle` (`idsalle`, `nom`, `ville`) VALUES
(1, 'Antares', 'Nogent');

-- --------------------------------------------------------

--
-- Structure de la table `scenario`
--

CREATE TABLE `scenario` (
  `idscenario` int NOT NULL,
  `nom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ordre` varchar(50) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `scenario`
--

INSERT INTO `scenario` (`idscenario`, `nom`, `ordre`, `description`) VALUES
(1, 'pirate', '1,2,5,4,6', 'fr'),
(2, 'Salut', '2,1,3', 'Test');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `idUser` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `permission` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`idUser`, `username`, `password`, `email`, `permission`) VALUES
(2, 'ss', '$2b$15$XECHAWWt.9b/MLeYcta3C.ntgUr6/2lje04Tkwl0u9veO0ICuHyb6', 'ss', 1),
(36, 'Zobay', '$2b$15$TaAakrwRS0Prck3dNKcyiug.XMMSdwd/LSfbdoquiTqaQmdo/lFCq', 'zizis', 0),
(40, '<h1>ZeroTwoi</h1>', '$2b$15$YtvmF7OIVaPEYUDUPPBH0.pi5p4tiNKcSXYbiWAFQdJslHo4Tjw82', 'ZeroTwo@gmail.fr', 0),
(41, 'klkkl', '$2b$15$3ziXVy2bY6ycLaARsYg/EOTiYyCxP7xEM3dsFWjmip2fV3ARj.ZpC', 'kmkmkmkk@zizi.com', 0),
(42, 'klkkl', '$2b$15$F8YGxqaXNVu.5qEPfJl3sOfAVYKGM9SG90W6xoCTRkc55xWNhp4YS', 'kmkmkmkk@zizi.com', 0),
(43, 'klkkl', '$2b$15$9qMddgEyH4Aerm7aSBDP7OBKOAaWHWwtXdTnwq27ck836jKSChmn.', 'kmkmkmkk@zizi.com', 0),
(44, 'klkkl', '$2b$15$ZsXYN3TlU908M6TbLV8EhOsshg9yoNtsQ.wcueqSrxq10jnHvd5gC', 'kmkmkmkk@zizi.com', 0),
(45, 'klkkl', '$2b$15$RrY8lSY0murAa5l4iK0.BuTZmWTh7JJPwN1CqMB3osongj51sCjsC', 'kmkmkmkk@zizi.com', 0),
(46, 'klkkl', '$2b$15$pQRxpr0oqFc9hMBkPpa5ueKUcW3HtWUoRu2rdVhc3ez/4AF.4dU5m', 'kmkmkmkk@zizi.com', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `equipe`
--
ALTER TABLE `equipe`
  ADD PRIMARY KEY (`idequipe`);

--
-- Index pour la table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`idgame`),
  ADD KEY `fk_game_scenario1_idx` (`idscenario`),
  ADD KEY `fk_game_missionEtat1_idx` (`idmissionEtat`),
  ADD KEY `fk_game_equipe1_idx` (`idequipe`),
  ADD KEY `fk_salle` (`idsalle`);

--
-- Index pour la table `mission`
--
ALTER TABLE `mission`
  ADD PRIMARY KEY (`idmission`);

--
-- Index pour la table `missionEtat`
--
ALTER TABLE `missionEtat`
  ADD PRIMARY KEY (`idetat`),
  ADD KEY `fk_missionEtat_mission1_idx` (`idmission`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`idreservation`),
  ADD KEY `fk_reservation_utilisateur1_idx` (`utilisateur`),
  ADD KEY `fk_reservation_salle1_idx` (`salle`),
  ADD KEY `fk_reservation_equipe1_idx` (`equipe`);

--
-- Index pour la table `salle`
--
ALTER TABLE `salle`
  ADD PRIMARY KEY (`idsalle`);

--
-- Index pour la table `scenario`
--
ALTER TABLE `scenario`
  ADD PRIMARY KEY (`idscenario`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `equipe`
--
ALTER TABLE `equipe`
  MODIFY `idequipe` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `game`
--
ALTER TABLE `game`
  MODIFY `idgame` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT pour la table `mission`
--
ALTER TABLE `mission`
  MODIFY `idmission` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `missionEtat`
--
ALTER TABLE `missionEtat`
  MODIFY `idetat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `idreservation` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `salle`
--
ALTER TABLE `salle`
  MODIFY `idsalle` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `scenario`
--
ALTER TABLE `scenario`
  MODIFY `idscenario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `idUser` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `game`
--
ALTER TABLE `game`
  ADD CONSTRAINT `fk_game_equipe1` FOREIGN KEY (`idequipe`) REFERENCES `equipe` (`idequipe`),
  ADD CONSTRAINT `fk_game_missionEtat1` FOREIGN KEY (`idmissionEtat`) REFERENCES `missionEtat` (`idetat`),
  ADD CONSTRAINT `fk_game_scenario1` FOREIGN KEY (`idscenario`) REFERENCES `scenario` (`idscenario`),
  ADD CONSTRAINT `fk_salle` FOREIGN KEY (`idsalle`) REFERENCES `salle` (`idsalle`) ON DELETE CASCADE;

--
-- Contraintes pour la table `missionEtat`
--
ALTER TABLE `missionEtat`
  ADD CONSTRAINT `fk_missionEtat_mission1` FOREIGN KEY (`idmission`) REFERENCES `mission` (`idmission`);

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `fk_reservation_equipe1` FOREIGN KEY (`equipe`) REFERENCES `equipe` (`idequipe`),
  ADD CONSTRAINT `fk_reservation_salle1` FOREIGN KEY (`salle`) REFERENCES `salle` (`idsalle`),
  ADD CONSTRAINT `fk_reservation_utilisateur1` FOREIGN KEY (`utilisateur`) REFERENCES `utilisateur` (`idUser`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
