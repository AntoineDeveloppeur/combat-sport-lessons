---
name: add-db-constraint
description: >
  Checklist complète pour ajouter une contrainte de base de données dans ce projet.
  Déclencher ce skill dès que l'utilisateur veut ajouter une contrainte UNIQUE, NOT NULL,
  CHECK ou autre contrainte SQL, modifier le schéma de la base de données, ou s'assurer
  qu'un champ est unique en base. Ce skill orchestre plusieurs autres étapes (error class,
  repository, use case, controller, tests) — l'utiliser dès qu'une contrainte DB est en jeu.
---

Checklist complète — **toutes les étapes sont obligatoires**.

1. ✅ Mettre à jour `init.sql` avec la contrainte
2. ✅ Créer la custom error class correspondante → skill `add-error`
3. ✅ Ajouter la méthode de validation à l'interface repository → skill `add-repo-method`
4. ✅ Implémenter la validation dans le repository PostgreSQL
5. ✅ Mettre à jour le use case pour vérifier la contrainte avant de sauvegarder
6. ✅ Mettre à jour le controller pour gérer la nouvelle erreur
7. ✅ Mettre à jour tous les mocks de tests du repository
