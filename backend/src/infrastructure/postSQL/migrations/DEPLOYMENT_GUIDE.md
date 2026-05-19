# Guide de déploiement - Fonctionnalité Durée de leçon

## Vue d'ensemble

Cette migration ajoute une colonne `duration` (INTEGER) à la table `lessons`
pour stocker la durée totale de chaque leçon en minutes.

**⚠️ Important** : La base de données PostgreSQL tourne dans un container Docker
(`combat_lesson_db_prod`). Toutes les commandes utilisent `docker exec` pour
interagir avec le container.

## Migration à la volée avec Docker ⭐

### Avantages

- ✅ Conservation de toutes les données (utilisateurs + leçons)
- ✅ Pas de downtime
- ✅ Simple et rapide
- ✅ Rollback facile si nécessaire

### Procédure de déploiement

#### 1. Backup de la base de données (OBLIGATOIRE)

```bash
# Se connecter au serveur de production
ssh user@coursdecombat.fr

# Aller dans le dossier backend
cd /path/to/backend

# Utiliser le script de backup automatisé
chmod +x migrations/backup_database.sh
./migrations/backup_database.sh before_duration

# OU manuellement avec Docker
docker exec combat_lesson_db_prod pg_dump -U postgres -d combat_sport_lessons > backup_before_duration_$(date +%Y%m%d_%H%M%S).sql

# Vérifier que le backup existe et n'est pas vide
ls -lh backups/before_duration* # ou backup_before_duration_*.sql
```

#### 2. Exécuter la migration

```bash
# Option A: Via fichier SQL (recommandé)
cat migrations/001_add_duration_column.sql | docker exec -i combat_lesson_db_prod psql -U postgres -d combat_sport_lessons

# Option B: Via commande directe
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons << 'EOF'
ALTER TABLE lessons ADD COLUMN duration INTEGER;

UPDATE lessons l
SET duration = (
  SELECT CEIL(SUM(i.min * 60 + i.sec) / 60.0)
  FROM instructions i
  WHERE i.lesson_id = l.lesson_id
)
WHERE duration IS NULL;

```

#### 3. Vérifier la migration

```bash
# Vérifier que la colonne existe
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "\d lessons"

# Vérifier les valeurs
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "SELECT lesson_id, title, duration FROM lessons ORDER BY created_at DESC LIMIT 10;"

# Vérifier qu'il n'y a pas de NULL
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "SELECT COUNT(*) FROM lessons WHERE duration IS NULL;"
# Devrait retourner 0
```

#### 4. Déployer le nouveau code

```bash
# Backend
cd /path/to/backend
git pull origin main
npm install
npm run build
pm2 restart backend

# Frontend
cd /path/to/frontend
git pull origin main
npm install
npm run build
pm2 restart frontend
```

#### 5. Tester en production

- Créer une nouvelle leçon et vérifier que la durée s'affiche
- Modifier une leçon existante et vérifier que la durée se met à jour
- Vérifier que les anciennes leçons affichent leur durée calculée

### Rollback en cas de problème

```bash
# Supprimer la colonne duration
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "ALTER TABLE lessons DROP COLUMN duration;"

# Restaurer le backup si nécessaire
chmod +x migrations/restore_database.sh
./migrations/restore_database.sh backups/before_duration.sql

# OU manuellement
cat backup_before_duration_YYYYMMDD_HHMMSS.sql | docker exec -i combat_lesson_db_prod psql -U postgres -d combat_sport_lessons
```

---

## Gestion du backend avec les anciennes données

Le backend est déjà préparé pour gérer les leçons sans durée :

### Dans le mapper (`lessonMapper.ts`)

```typescript
// Si duration est NULL en base, il sera mappé comme undefined
duration: row.duration ?? 0, // Valeur par défaut à 0
```

### Lors de la mise à jour

Quand un utilisateur modifie une ancienne leçon, le `SendLessonToBackend`
recalculera automatiquement la durée :

```typescript
const duration = calculateLessonDuration(lesson)
const lessonWithDuration = { ...lesson, duration }
```

---

## Checklist de déploiement

- [ ] Backup de la base de données créé et vérifié
- [ ] Migration SQL testée en local/dev
- [ ] Code backend déployé et testé
- [ ] Code frontend déployé et testé
- [ ] Vérification des anciennes leçons (durée affichée)
- [ ] Vérification des nouvelles leçons (durée calculée)
- [ ] Vérification de la modification de leçons (durée mise à jour)
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Backup conservé pendant au moins 7 jours

---

## Commandes utiles avec Docker

### Vérifier l'état de la base de données

```bash
# Statistiques sur les durées
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "
SELECT
  COUNT(*) as total_lessons,
  COUNT(duration) as lessons_with_duration,
  AVG(duration) as avg_duration,
  MIN(duration) as min_duration,
  MAX(duration) as max_duration
FROM lessons;
"

# Leçons sans durée
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "
SELECT lesson_id, title, created_at
FROM lessons
WHERE duration IS NULL OR duration = 0
LIMIT 10;
"
```

### Recalculer toutes les durées

```bash
# Si besoin de recalculer toutes les durées
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "
UPDATE lessons l
SET duration = (
  SELECT CEIL(SUM(i.min * 60 + i.sec) / 60.0)
  FROM instructions i
  WHERE i.lesson_id = l.lesson_id
);
"
```

### Accéder au shell PostgreSQL

```bash
# Ouvrir une session psql interactive
docker exec -it combat_lesson_db_prod psql -U postgres -d combat_sport_lessons

# Une fois dans psql, vous pouvez exécuter des commandes SQL normalement
# \dt pour lister les tables
# \d lessons pour voir la structure de la table lessons
# \q pour quitter
```

---

## Support et dépannage

### Problème : Les anciennes leçons affichent "pas de durée"

**Solution :** Exécuter le script de recalcul des durées ci-dessus.

### Problème : Erreur lors de la création de leçon

**Vérification :**

```bash
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "
SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'lessons' AND column_name = 'duration';
"
```

### Problème : Performances lentes

Si la table `lessons` est très grande (>100k lignes), créer un index :

```bash
docker exec combat_lesson_db_prod psql -U postgres -d combat_sport_lessons -c "CREATE INDEX idx_lessons_duration ON lessons(duration);"
```

### Problème : Container Docker non accessible

**Vérification :**

```bash
# Vérifier que le container tourne
docker ps | grep combat_lesson_db_prod

# Voir les logs du container
docker logs combat_lesson_db_prod --tail 50

# Redémarrer le container si nécessaire
docker restart combat_lesson_db_prod
```
