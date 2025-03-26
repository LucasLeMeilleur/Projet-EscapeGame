-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 26 mars 2025 à 13:35
-- Version du serveur :  10.5.28-MariaDB-0+deb11u1
-- Version de PHP : 7.3.33-22+0~20241124.122+debian11~1.gbpb244f0

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
  `idequipe` int(11) NOT NULL,
  `nom` varchar(70) NOT NULL,
  `nombre_joueur` tinyint(4) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `equipe`
--

INSERT INTO `equipe` (`idequipe`, `nom`, `nombre_joueur`, `date`) VALUES
(1, 'LesMeilleurs', 3, '2025-01-27 17:58:36'),
(2, 'Zeub', 2, '2025-02-11 14:42:53'),
(3, 'ss', 4, '2025-03-24 10:24:26'),
(4, 'ss', 4, '2025-03-24 10:25:08'),
(5, 'ss', 4, '2025-03-24 10:25:11'),
(6, 'ss', 5, '2025-03-24 10:25:37'),
(7, 'SAmm', 14, '2025-03-26 09:51:33'),
(8, 'SAmm', 14, '2025-03-26 09:51:34'),
(9, 'DZ', 45, '2025-03-26 09:54:01');

-- --------------------------------------------------------

--
-- Structure de la table `game`
--

CREATE TABLE `game` (
  `idgame` int(11) NOT NULL,
  `idmissionEtat` int(11) DEFAULT NULL,
  `idscenario` int(11) NOT NULL,
  `idsalle` int(10) DEFAULT NULL,
  `dateCreation` timestamp NOT NULL DEFAULT current_timestamp(),
  `dateDepart` timestamp NULL DEFAULT NULL,
  `idequipe` int(11) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT 0,
  `terminee` tinyint(1) NOT NULL DEFAULT 0,
  `duree` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `game`
--

INSERT INTO `game` (`idgame`, `idmissionEtat`, `idscenario`, `idsalle`, `dateCreation`, `dateDepart`, `idequipe`, `actif`, `terminee`, `duree`) VALUES
(4, 1, 1, 1, '2025-01-27 17:59:37', '2025-03-21 08:16:25', 1, 0, 1, 200),
(5, 1, 1, 1, '2025-03-21 16:43:38', '2025-03-21 16:00:15', 1, 0, 0, NULL),
(6, 1, 1, 1, '2025-03-22 16:31:03', NULL, 1, 0, 0, NULL),
(7, 1, 1, 1, '2025-03-22 17:26:33', NULL, 1, 0, 0, NULL),
(18, 5, 2, 1, '2025-03-24 07:41:17', NULL, 1, 0, 0, NULL),
(19, 6, 2, 1, '2025-03-24 07:41:17', NULL, 1, 0, 0, NULL),
(22, 9, 1, 1, '2025-03-24 07:47:05', NULL, 2, 0, 0, NULL),
(23, 10, 1, 1, '2025-03-24 07:47:05', NULL, 2, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

CREATE TABLE `mission` (
  `idmission` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `tempsRequis` smallint(6) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `mission`
--

INSERT INTO `mission` (`idmission`, `nom`, `tempsRequis`, `description`) VALUES
(1, 'Mission1', 255, ''),
(2, 'aa', 100, 'da');

-- --------------------------------------------------------

--
-- Structure de la table `missionEtat`
--

CREATE TABLE `missionEtat` (
  `idetat` int(11) NOT NULL,
  `heuredebut` time NOT NULL DEFAULT current_timestamp(),
  `heurefin` time DEFAULT NULL,
  `idgame` int(11) NOT NULL,
  `idmission` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `missionEtat`
--

INSERT INTO `missionEtat` (`idetat`, `heuredebut`, `heurefin`, `idgame`, `idmission`) VALUES
(1, '18:31:33', '18:58:25', 5, 1),
(2, '08:38:35', NULL, 15, 1),
(3, '08:38:38', NULL, 16, 1),
(4, '08:38:54', NULL, 17, 1),
(5, '08:41:22', NULL, 18, 1),
(6, '08:41:44', NULL, 19, 1),
(9, '08:49:19', NULL, 22, 1),
(10, '08:59:14', NULL, 23, 1),
(11, '22:43:01', NULL, 19, 1),
(12, '22:43:32', NULL, 19, 1),
(13, '22:43:53', NULL, 19, 1),
(14, '22:44:12', NULL, 19, 1),
(15, '22:44:16', NULL, 19, 1),
(16, '22:45:09', NULL, 19, 2),
(17, '22:45:14', NULL, 19, 2),
(18, '22:45:19', NULL, 19, 2);

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `idreservation` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `utilisateur` int(11) NOT NULL,
  `salle` int(11) NOT NULL,
  `equipe` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`idreservation`, `date`, `utilisateur`, `salle`, `equipe`) VALUES
(1, '2025-02-06 20:00:00', 1, 1, 1),
(2, '2025-03-06 21:00:00', 1, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `salle`
--

CREATE TABLE `salle` (
  `idsalle` int(11) NOT NULL,
  `nom` varchar(75) NOT NULL,
  `ville` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `salle`
--

INSERT INTO `salle` (`idsalle`, `nom`, `ville`) VALUES
(1, 'Antares', 'Nogent-sur-marne'),
(2, 'Test', 'Test');

-- --------------------------------------------------------

--
-- Structure de la table `scenario`
--

CREATE TABLE `scenario` (
  `idscenario` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `ordre` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `scenario`
--

INSERT INTO `scenario` (`idscenario`, `nom`, `ordre`, `description`) VALUES
(1, 'Pirate', '1,4,5', ''),
(2, 'ag', '1,2,8,4,6', ''),
(3, 'zd', '1,5,4', ''),
(4, 'Sal', '1,5,4', ''),
(5, 'dz', '1,4', 'Description'),
(6, 'zda', '14', 'description');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `idUser` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `permission` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`idUser`, `username`, `password`, `email`, `permission`) VALUES
(1, 'NV', '$2b$15$RaC31pJYYbcmgRbFOKD8puAqFroOWfqZpg3djfu.f5nnndIzEB17W', 'Email', 0),
(2, 'ff', '$2b$15$VXe5eQjO7UIFOW66frkAAuHAmWY0m/zJVqbizdCyB1v8Xemhgukq.', 'Email', 0),
(3, 'ff', '$2b$15$ApJCvOIAKl.km/l4YyA1gOOXzJxIjBwpkYKfEbEkvhv.GkXAbOMNy', 'Email', 0),
(4, 'dd', '$2b$15$HfpytFnZOZRbmZHI.2SijeT0axrkNPHb0u4/lvoGk68H4zy5QNO9.', 'Email', 0),
(5, 'sd', '$2b$15$ooIw.mSebUpZ5e0T2uoc8OLZcle0Xu4xpgIPcdmgTvLInutP3tOJO', 'Email', 0),
(6, 'sd', '$2b$15$Sa9imdAtVG8J/bxpd3ELh.kEwtd2lJ8jsx9mCtCYKifFwkkGE9v8q', 'sd', 0),
(7, 'sd', '$2b$15$ySDVE67rNpJkVtXV9LsEWegX7taOrvZomDnK4AXJmLzf7w6PNjes6', 'sss@fz', 0),
(8, 'LeBG', '$2b$15$.E.WbyrTTEEhowFXhRgGGucbNnPW8DPIXlZ9/FZ4M265SfTdeLpiW', 'ss', 1),
(9, 'Zizi', '$2b$15$NYpEbn1zc8xzu4lclXgp1e8Pd40jwOItcJ/q/bkg3cWmnuam/mN7C', 'zob@gmail.com', 0);

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
  ADD KEY `idsalle` (`idsalle`);

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
  ADD KEY `fk_reservation_equipe1` (`equipe`);

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
  MODIFY `idequipe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `game`
--
ALTER TABLE `game`
  MODIFY `idgame` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `mission`
--
ALTER TABLE `mission`
  MODIFY `idmission` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `missionEtat`
--
ALTER TABLE `missionEtat`
  MODIFY `idetat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `idreservation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `salle`
--
ALTER TABLE `salle`
  MODIFY `idsalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `scenario`
--
ALTER TABLE `scenario`
  MODIFY `idscenario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
