---
name: troubleshoot
description: >
  Résoudre les problèmes courants du projet (DB, ports, TypeScript).
  Déclencher ce skill dès que l'utilisateur signale que quelque chose ne démarre pas,
  une erreur de connexion à la base de données, un port déjà utilisé, une erreur de
  compilation TypeScript au démarrage, Docker qui ne répond pas, ou pose une question
  du type "ça ne marche pas", "erreur au démarrage", "la DB ne se connecte pas",
  "le port est occupé".
---

## Problème de connexion DB

```bash
docker ps                        # Vérifier que Docker tourne
cd backend && npm run db:reset   # Réinitialiser la DB
```

## Erreur de compilation TypeScript

```bash
cd backend && npm run type:watch
```

## Port déjà utilisé

```bash
npx kill-port 4000   # Backend
npx kill-port 3000   # Frontend
```
