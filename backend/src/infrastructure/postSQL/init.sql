CREATE TYPE role_enum AS ENUM ('administrator', 'moderator', 'user');
CREATE TYPE instruction_enum AS ENUM ('warmUp','body','coolDown');
CREATE TYPE warmUpCoolDownMode_enum AS ENUM ('custom','preset');

CREATE TABLE "users" (
  "user_id" integer PRIMARY KEY,
  "username" varchar,
  "email" VARCHAR(50),
  "hash" varchar,
  "role" role_enum,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "lessons" (
  "lesson_id" integer PRIMARY KEY,
  "title" varchar,
  "sport" varchar,
  "objective" varchar,
  "warmUp" warmUpCoolDownMode_enum,
  "coolDown" warmUpCoolDownMode_enum,
  "warmUpPresetTitle" varchar,
  "coolDownPresetTitle" varchar,
  "created_at" DEFAULT CURRENT_TIMESTAMP,
  "user_id" integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)

);

CREATE TABLE "instructions" (
  "instruction_id" integer PRIMARY KEY,
  "title" varchar(50),
  "text" varchar,
  "type" instruction_enum,
  "min" integer,
  "sec" integer,
  "order" integer NOT NULL,
  "lesson_id" integer NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) 
);

-- Fin de l'initialisation de la DB

-- Ajout de données de base

INSERT INTO users (user_id,username, email, hash, role)
VALUES (1,'Jennifer','jenniferDeRouen@gmail.com', 'fakeHash', 'user'),
(2,'John','johnDeLangres@tomato.fr', 'superfakehash','administrator'),
(3,'Julie','juliedu75000@free.li','fakehash','moderator');

-- Insertion des 4 leçons
INSERT INTO lessons (lesson_id, title, sport, objective, "warmUp", "coolDown", "warmUpPresetTitle", "coolDownPresetTitle", created_at, user_id)
VALUES 
(1, 'Boxe débutant', 'Boxe', 'Apprendre les bases du jab', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, 1),
(2, 'Judo avancé', 'Judo', 'Perfectionner les projections', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, 2),
(3, 'Karaté kata', 'Karaté', 'Maîtriser le kata Heian Shodan', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, 1),
(4, 'MMA cardio', 'MMA', 'Améliorer endurance et explosivité', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, 3);

-- Instructions pour la leçon 1 (Boxe débutant)
INSERT INTO instructions (instruction_id, title, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 1
(1, 'Jumping jacks', 'Échauffement cardio avec sauts écartés', 'warmUp', 3, 0, 1, 1),
(2, 'Rotations épaules', 'Rotations circulaires des épaules avant/arrière', 'warmUp', 2, 0, 2, 1),
(3, 'Shadow boxing léger', 'Mouvements de boxe sans force', 'warmUp', 2, 30, 3, 1),
-- Body leçon 1
(4, 'Technique du jab', 'Pratiquer le jab sur sac de frappe', 'body', 5, 0, 1, 1),
(5, 'Combinaisons jab-direct', 'Enchaîner jab et direct', 'body', 5, 0, 2, 1),
(6, 'Travail au pad', 'Exercices avec partenaire aux pattes d''ours', 'body', 8, 0, 3, 1),
-- CoolDown leçon 1
(7, 'Marche active', 'Marche sur place pour ralentir le rythme cardiaque', 'coolDown', 2, 0, 1, 1),
(8, 'Étirements bras', 'Étirer triceps et épaules', 'coolDown', 3, 0, 2, 1);

-- Instructions pour la leçon 2 (Judo avancé)
INSERT INTO instructions(instruction_id, title, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 2
(9, 'Course légère', 'Jogging autour du tatami', 'warmUp', 3, 0, 1, 2),
(10, 'Ukemi', 'Pratique des chutes avant et arrière', 'warmUp', 4, 0, 2, 2),
-- Body leçon 2
(11, 'O-goshi', 'Répétition du grand fauchage de hanche', 'body', 6, 0, 1, 2),
(12, 'Seoi-nage', 'Travail de la projection par-dessus épaule', 'body', 6, 0, 2, 2),
(13, 'Randori', 'Combat libre contrôlé', 'body', 10, 0, 3, 2),
-- CoolDown leçon 2
(14, 'Respiration profonde', 'Exercices de respiration en position assise', 'coolDown', 2, 0, 1, 2),
(15, 'Étirements jambes', 'Étirer quadriceps et ischio-jambiers', 'coolDown', 3, 0, 2, 2),
(16, 'Salut final', 'Rei de fin de cours', 'coolDown', 0, 30, 3, 2);

-- Instructions pour la leçon 3 (Karaté kata)
INSERT INTO instructions(instruction_id, title, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 3
(17, 'Kihon', 'Techniques de base en déplacement', 'warmUp', 5, 0, 1, 3),
(18, 'Assouplissements', 'Étirements dynamiques des jambes', 'warmUp', 3, 0, 2, 3),
-- Body leçon 3
(19, 'Heian Shodan partie 1', 'Première moitié du kata', 'body', 4, 0, 1, 3),
(20, 'Heian Shodan partie 2', 'Seconde moitié du kata', 'body', 4, 0, 2, 3),
(21, 'Kata complet', 'Enchaînement complet avec kiai', 'body', 8, 0, 3, 3),
-- CoolDown leçon 3
(22, 'Mokuso', 'Méditation en position seiza', 'coolDown', 2, 0, 1, 3),
(23, 'Étirements statiques', 'Étirements passifs de tout le corps', 'coolDown', 4, 0, 2, 3);

-- Instructions pour la leçon 4 (MMA cardio)
INSERT INTO instructions(instruction_id, title, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 4
(24, 'Burpees', 'Échauffement explosif avec burpees', 'warmUp', 2, 0, 1, 4),
(25, 'High knees', 'Montées de genoux rapides', 'warmUp', 2, 0, 2, 4),
(26, 'Mobilité articulaire', 'Rotations poignets, chevilles, hanches', 'warmUp', 2, 0, 3, 4),
-- Body leçon 4
(27, 'Rounds de frappe', 'Combinaisons pieds-poings intensives', 'body', 5, 0, 1, 4),
(28, 'Takedowns', 'Entrées de jambes répétées', 'body', 5, 0, 2, 4),
(29, 'Circuit training', 'Enchaînement pompes-squats-abdos', 'body', 6, 0, 3, 4),
-- CoolDown leçon 4
(30, 'Marche récupération', 'Marche lente pour récupérer', 'coolDown', 3, 0, 1, 4),
(31, 'Étirements complets', 'Étirer tous les groupes musculaires sollicités', 'coolDown', 5, 0, 2, 4);