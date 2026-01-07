## Objectif

- Appréhender le repository Pattern
- Apprendre les requêtes SQL

A travers la création d'une API permettant de :

- Créer un utilisateur
- Modifier un mot de passe

### Conditions d'utilisation

- Utiliser Postman pour envoyer les requêtes

### Points clés

- Séparation claire de la logique métier et de la technique : les applications/useCases utilise les interface et non les class concrète
- Les contrats sont spécifiés dans src/domain/ pour les Repositories mais aussi pour les services tel que le hasher les mots de passe ou créé un identifiant unique

### Comment la base de donnée fonctionne

- Docker monte une image de postgres et initie la base de donnée avec le fichier src/infrastructure/postSQL/init.sql
- La connexion à la base de donnée est faite avec une pool de connexion src/infrastructure/postSQL/postgrePool.ts

### Gestions des erreurs

- Utilise des custom class définis dans src/domain/errors. Elles centralisent ainsi les messages d'erreur et les status
- Un seul bloc try catch dans le controllers qui récupère toutes les erreurs pour renvoyer une réponse adaptée

### Démarrer l'API en mode dev

- npm install

#### Run la base de données POSTGRES

- Démarrer l'application Docker desktop
- `npm run db:start`

La base de donnée est initialisée avec des utilisateurs fictifs.

#### Build l'API

- `npm run type:watch`

#### Démarrer node

- `npm run dev `
