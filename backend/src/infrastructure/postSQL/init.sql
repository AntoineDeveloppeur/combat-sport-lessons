CREATE TYPE role_enum AS ENUM ('administrator', 'moderator', 'user');
CREATE TYPE instruction_enum AS ENUM ('warm_up','body','cool_down');
CREATE TYPE warm_up_cool_down_mode_enum AS ENUM ('custom','preset');

CREATE TABLE "users" (
  "user_id" uuid PRIMARY KEY,
  "username" varchar,
  "email" VARCHAR(50),
  "hash" varchar,
  "role" role_enum,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "lessons" (
  "lesson_id" uuid PRIMARY KEY,
  "title" varchar,
  "sport" varchar,
  "objective" varchar,
  "warm_up" warm_up_cool_down_mode_enum,
  "cool_down" warm_up_cool_down_mode_enum,
  "warm_up_preset_title" varchar,
  "cool_down_preset_title" varchar,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "user_id" uuid NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)

);

CREATE TABLE "instructions" (
  "instruction_id" uuid PRIMARY KEY,
  "text" varchar,
  "type" instruction_enum,
  "min" integer,
  "sec" integer,
  "order" integer NOT NULL,
  "lesson_id" uuid NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);

-- Fin de l'initialisation de la DB

-- Ajout de données de base

INSERT INTO users (user_id,username, email, hash, role)
VALUES ('550e8400-e29b-41d4-a716-446655440001','Jennifer','jenniferDeRouen@gmail.com', 'fakeHash', 'user'),
('550e8400-e29b-41d4-a716-446655440002','John','johnDeLangres@tomato.fr', 'superfakehash','administrator'),
('550e8400-e29b-41d4-a716-446655440003','Julie','juliedu75000@free.li','fakehash','moderator');

-- Insertion des 4 leçons
INSERT INTO lessons (lesson_id, title, sport, objective, "warm_up", "cool_down", "warm_up_preset_title", "cool_down_preset_title", created_at, user_id)
VALUES 
('550e8400-e29b-41d4-a716-446655440011', 'Boxe débutant', 'Boxe', 'Apprendre les bases du jab', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440012', 'Judo avancé', 'Judo', 'Perfectionner les projections', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440013', 'Karaté kata', 'Karaté', 'Maîtriser le kata Heian Shodan', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440014', 'MMA cardio', 'MMA', 'Améliorer endurance et explosivité', 'custom', 'custom', NULL, NULL, CURRENT_TIMESTAMP, '550e8400-e29b-41d4-a716-446655440003');

-- Instructions pour la leçon 1 (Boxe débutant)
INSERT INTO instructions (instruction_id, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 1
('550e8400-e29b-41d4-a716-446655440101', 'Échauffement cardio avec sauts écartés', 'warm_up', 3, 0, 1, '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440102', 'Rotations circulaires des épaules avant/arrière', 'warm_up', 2, 0, 2, '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440103', 'Mouvements de boxe sans force', 'warm_up', 2, 30, 3, '550e8400-e29b-41d4-a716-446655440011'),
-- Body leçon 1
('550e8400-e29b-41d4-a716-446655440104', 'Pratiquer le jab sur sac de frappe', 'body', 5, 0, 1, '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440105', 'Enchaîner jab et direct', 'body', 5, 0, 2, '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440106', 'Exercices avec partenaire aux pattes d''ours', 'body', 8, 0, 3, '550e8400-e29b-41d4-a716-446655440011'),
-- CoolDown leçon 1
('550e8400-e29b-41d4-a716-446655440107', 'Marche sur place pour ralentir le rythme cardiaque', 'cool_down', 2, 0, 1, '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440108', 'Étirer triceps et épaules', 'cool_down', 3, 0, 2, '550e8400-e29b-41d4-a716-446655440011');

-- Instructions pour la leçon 2 (Judo avancé)
INSERT INTO instructions(instruction_id, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 2
('550e8400-e29b-41d4-a716-446655440201', 'Jogging autour du tatami', 'warm_up', 3, 0, 1, '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440202', 'Pratique des chutes avant et arrière', 'warm_up', 4, 0, 2, '550e8400-e29b-41d4-a716-446655440012'),
-- Body leçon 2
('550e8400-e29b-41d4-a716-446655440203', 'Répétition du grand fauchage de hanche', 'body', 6, 0, 1, '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440204', 'Travail de la projection par-dessus épaule', 'body', 6, 0, 2, '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440205', 'Combat libre contrôlé', 'body', 10, 0, 3, '550e8400-e29b-41d4-a716-446655440012'),
-- CoolDown leçon 2
('550e8400-e29b-41d4-a716-446655440206', 'Exercices de respiration en position assise', 'cool_down', 2, 0, 1, '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440207', 'Étirer quadriceps et ischio-jambiers', 'cool_down', 3, 0, 2, '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440208', 'Rei de fin de cours', 'cool_down', 0, 30, 3, '550e8400-e29b-41d4-a716-446655440012');

-- Instructions pour la leçon 3 (Karaté kata)
INSERT INTO instructions(instruction_id, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 3
('550e8400-e29b-41d4-a716-446655440301', 'Techniques de base en déplacement', 'warm_up', 5, 0, 1, '550e8400-e29b-41d4-a716-446655440013'),
('550e8400-e29b-41d4-a716-446655440302', 'Étirements dynamiques des jambes', 'warm_up', 3, 0, 2, '550e8400-e29b-41d4-a716-446655440013'),
-- Body leçon 3
('550e8400-e29b-41d4-a716-446655440303', 'Première moitié du kata', 'body', 4, 0, 1, '550e8400-e29b-41d4-a716-446655440013'),
('550e8400-e29b-41d4-a716-446655440304', 'Seconde moitié du kata', 'body', 4, 0, 2, '550e8400-e29b-41d4-a716-446655440013'),
('550e8400-e29b-41d4-a716-446655440305', 'Enchaînement complet avec kiai', 'body', 8, 0, 3, '550e8400-e29b-41d4-a716-446655440013'),
-- CoolDown leçon 3
('550e8400-e29b-41d4-a716-446655440306', 'Méditation en position seiza', 'cool_down', 2, 0, 1, '550e8400-e29b-41d4-a716-446655440013'),
('550e8400-e29b-41d4-a716-446655440307', 'Étirements passifs de tout le corps', 'cool_down', 4, 0, 2, '550e8400-e29b-41d4-a716-446655440013');

-- Instructions pour la leçon 4 (MMA cardio)
INSERT INTO instructions(instruction_id, text, type, min, sec, "order", lesson_id)
VALUES 
-- WarmUp leçon 4
('550e8400-e29b-41d4-a716-446655440401', 'Échauffement explosif avec burpees', 'warm_up', 2, 0, 1, '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440402', 'Montées de genoux rapides', 'warm_up', 2, 0, 2, '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440403', 'Rotations poignets, chevilles, hanches', 'warm_up', 2, 0, 3, '550e8400-e29b-41d4-a716-446655440014'),
-- Body leçon 4
('550e8400-e29b-41d4-a716-446655440404', 'Combinaisons pieds-poings intensives', 'body', 5, 0, 1, '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440405', 'Entrées de jambes répétées', 'body', 5, 0, 2, '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440406', 'Enchaînement pompes-squats-abdos', 'body', 6, 0, 3, '550e8400-e29b-41d4-a716-446655440014'),
-- CoolDown leçon 4
('550e8400-e29b-41d4-a716-446655440407', 'Marche lente pour récupérer', 'cool_down', 3, 0, 1, '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440408', 'Étirer tous les groupes musculaires sollicités', 'cool_down', 5, 0, 2, '550e8400-e29b-41d4-a716-446655440014');