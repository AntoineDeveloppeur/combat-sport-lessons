CREATE TYPE access_right_enum AS ENUM ('administrator', 'moderator', 'user');

CREATE TABLE users(
  id TEXT PRIMARY KEY,
  name VARCHAR(50),
  email VARCHAR(50),
  hash TEXT,
  access_right access_right_enum
);

-- Fin de l'initialisation de la DB

-- Ajout de données de base

INSERT INTO users (id,name, email, hash, access_right)
VALUES ('idUnique1','Jennifer','jenniferDeRouen@gmail.com', 'fakeHash', 'user'),
('idUnique2','John','johnDeLangres@tomato.fr', 'superfakehash','administrator'),
('idUnique3','Julie','juliedu75000@free.li','fakehash','moderator');