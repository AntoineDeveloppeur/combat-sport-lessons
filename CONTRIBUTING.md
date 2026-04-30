# Guide de Contribution 🤝

Merci de votre intérêt pour contribuer à **Combat Sport Lessons** ! Ce projet
est un espace d'apprentissage open-source où les contributions de tous niveaux
sont les bienvenues.

---

## 🎯 Philosophie du Projet

Ce projet est avant tout un **exercice d'apprentissage** visant à maîtriser :

- L'architecture hexagonale (ports & adapters)
- Le Repository Pattern avec TypeScript
- Les bonnes pratiques de développement full-stack moderne
- La collaboration open-source

**Nous encourageons** :

- Les questions et discussions
- Les contributions de développeurs de tous niveaux
- Le partage de connaissances et l'apprentissage mutuel
- Les retours constructifs sur le code et l'architecture

---

## 📝 Règles de Base

### Code Style

- **ES modules uniquement** : Utilisez `import`/`export`, jamais `require`
- **TypeScript strict mode** : Activé sur backend et frontend
- **Immutabilité** : Privilégiez les fonctions pures et les structures de
  données immuables
- **Interfaces** : Préférez les interfaces aux types pour les objets
- **Prettier + ESLint** : Configurés et prêts à l'emploi

### Conventions de Nommage

| Élément              | Convention                | Exemple                             |
| -------------------- | ------------------------- | ----------------------------------- |
| Fichiers utilitaires | camelCase                 | `hashPassword.ts`                   |
| Composants/Classes   | PascalCase                | `LessonTable.tsx`                   |
| Classes d'erreur     | `[Name]Error` ou `[Name]` | `NotOwnerError`, `LessonIdNotFound` |
| Hooks React          | `use[Name]`               | `useAuth`, `useLesson`              |

### Formatage

- **Pas de points-virgules** (enforced by Prettier)
- **Single quotes** pour les strings
- **2 espaces** d'indentation
- Lancez `npm run prettier:backend` ou `npm run prettier:frontend` avant de
  commit

### 🌍 Langue

**IMPORTANT** : Pour faciliter la collaboration :

- **Code comments** : ANGLAIS uniquement
- **Commits** : FRANÇAIS (conventional commits)
- **Documentation** : FRANÇAIS (README, CONTRIBUTING)

**Exemples** :

```typescript
// ✅ CORRECT
// Check if user is authenticated before allowing access
if (!isAuthenticated) {
  throw new UnauthorizedError()
}

// ❌ INCORRECT
// Vérifie si l'utilisateur est authentifié avant de permettre l'accès
if (!isAuthenticated) {
  throw new UnauthorizedError()
}
```

**Commits** :

```bash
✅ git commit -m "feat: ajout authentification Google"
✅ git commit -m "fix: correction bug formulaire de leçon"
❌ git commit -m "feat: add Google authentication"
```

---

## 🔧 Setup Développement

### 1. Fork et Clone

```bash
# Fork le repo sur GitHub (bouton "Fork")
# Puis clone TON fork
git clone https://github.com/[ton-username]/combat-sport-lessons.git
cd combat-sport-lessons
```

### 2. Installation des Dépendances

```bash
# Dépendances racine (Husky, Playwright, etc.)
npm install

# Dépendances backend
cd backend
npm install

# Dépendances frontend
cd ../frontend
npm install
```

### 3. Configuration Environnement

```bash
# À la RACINE du projet (pas dans backend/ ou frontend/)
cp .env.example .env
```

**Éditez `.env`** et configurez :

- `JWT_SECRET` : Générez une chaîne aléatoire sécurisée (32+ caractères)
- `POSTGRES_PASSWORD` : Choisissez un mot de passe
- `RECAPTCHA_*` : Optionnel pour dev local (utilisez les clés de test fournies)

### 4. Démarrer les Services

```bash
# Terminal 1 : PostgreSQL
cd backend
npm run db:start

# Terminal 2 : Compilation TypeScript (backend)
cd backend
npm run type:watch

# Terminal 3 : Serveur backend
cd backend
npm run dev

# Terminal 4 : Serveur frontend
cd frontend
npm run dev
```

**Accès** :

- Frontend : http://localhost:3000
- Backend API : http://localhost:4000
- PgAdmin (optionnel) : http://localhost:8888 (avec `npm run db:start:tools`)

---

## 🧪 Tests

### ⚠️ RÈGLE CRITIQUE

**NE JAMAIS commit avec les tests en mode watch !**

Les batteries de tests backend et frontend utilisent des configurations
différentes qui peuvent entrer en conflit. **Arrêtez toujours le mode watch
avant de commit.**

### Commandes de Test

```bash
# Backend
cd backend
npm run test              # Mode watch (développement)
npm run test:coverage     # Coverage sans watch

# Frontend
cd frontend
npm run test              # Mode watch (développement)
npm run test:coverage     # Coverage sans watch

# E2E (depuis la racine)
npm run test:e2e          # Headless
npm run test:e2e:ui       # Avec UI
npm run test:e2e:debug    # Mode debug
```

### Écrire des Tests

- **Backend** : Tests unitaires dans le même dossier que le module testé
- **Frontend** : Tests de composants avec React Testing Library
- **E2E** : Tests d'intégration dans `tests/integration/`

---

## 🏗️ Architecture

### Backend (Hexagonal Architecture)

```
backend/src/
├── domain/              # Business logic (framework-agnostic)
│   ├── entities/        # User, Lesson
│   ├── repositories/    # Repository interfaces
│   ├── services/        # Service interfaces (Hasher, TokenManager)
│   └── errors/          # Custom error classes
│
├── application/         # Use cases (orchestration)
│   └── usecases/        # CreateLesson, UpdateLesson, etc.
│
├── infrastructure/      # Technical implementations
│   ├── postSQL/         # PostgreSQL repository implementations
│   └── services/        # Concrete services (bcrypt, JWT)
│
└── presentation/        # HTTP layer
    ├── controllers/     # Express controllers
    └── routes/          # Route definitions
```

**Principes clés** :

- Le domaine est **indépendant** de tout framework
- Les use cases dépendent d'**interfaces**, pas d'implémentations
- Injection de dépendances au niveau des contrôleurs

### Frontend (Next.js 16 + React 19)

```
frontend/
├── app/                 # Next.js App Router
│   ├── (app)/          # Routes authentifiées
│   ├── (auth)/         # Routes publiques (login, sign-up)
│   └── layout.tsx
│
├── components/          # Composants React
│   ├── ui/             # shadcn/ui components
│   ├── form/           # Composants de formulaire
│   └── lessonTable/    # Composants de table
│
├── store/              # Redux Toolkit
│   └── api/            # RTK Query API slices
│
└── contexts/           # React contexts (Auth, etc.)
```

**Principes clés** :

- **Server components** par défaut
- `"use client"` uniquement pour composants interactifs
- **shadcn/ui** pour les primitives UI
- **TailwindCSS** utility-first pour le styling

---

## 📋 Checklist Avant Pull Request

Avant de soumettre votre PR, vérifiez :

- [ ] **Tests passent** (sans mode watch)
  ```bash
  cd backend && npm run test:coverage
  cd frontend && npm run test:coverage
  ```
- [ ] **Code formatté** avec Prettier
  ```bash
  npm run prettier:backend
  npm run prettier:frontend
  ```
- [ ] **Lint sans erreurs**
  ```bash
  npm run lint:backend
  npm run lint:frontend
  ```
- [ ] **Comments en anglais** dans tout le code
- [ ] **Commits en français** (conventional commits)
- [ ] **`.env.example` mis à jour** si nouvelles variables d'environnement
- [ ] **Types TypeScript corrects** (pas de `any`)
- [ ] **Documentation mise à jour** si nécessaire

---

## 🔄 Workflow de Contribution

### 1. Créer une Branche

```bash
git checkout -b feat/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug-formulaire
```

**Préfixes de branches** :

- `feat/` : Nouvelle fonctionnalité
- `fix/` : Correction de bug
- `docs/` : Documentation
- `refactor/` : Refactoring
- `test/` : Ajout/modification de tests

### 2. Développer et Tester

- Écrivez du code propre et testé
- Commitez régulièrement avec des messages clairs
- Suivez les conventions du projet

### 3. Commits (Conventional Commits en français)

```bash
# Format
git commit -m "<type>: <description courte>"

# Exemples
git commit -m "feat: ajout authentification Google"
git commit -m "fix: correction validation formulaire de leçon"
git commit -m "docs: mise à jour README avec instructions Docker"
git commit -m "refactor: extraction logique validation dans service"
git commit -m "test: ajout tests unitaires pour CreateLesson"
```

**Types de commits** :

- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage (pas de changement de code)
- `refactor` : Refactoring
- `test` : Ajout/modification de tests
- `chore` : Tâches de maintenance

### 4. Push et Pull Request

```bash
# Push vers TON fork
git push origin feat/ma-nouvelle-fonctionnalite
```

Puis sur GitHub :

1. Ouvrez une Pull Request vers `main` du repo original
2. Décrivez clairement vos changements
3. Référencez les issues liées si applicable
4. Attendez la review

---

## 🚫 Ce qui N'est PAS Autorisé

Conformément à la licence AGPL-3.0 avec clauses additionnelles :

### ❌ Interdit

- Déployer le code comme service indépendant
- Utiliser le code à des fins commerciales
- Créer un fork pour distribution séparée
- Modifier et déployer sans contribuer au repo original

### ✅ Autorisé et Encouragé

- Forker pour contribuer via Pull Request
- Étudier et apprendre du code
- Exécuter localement pour développement
- Soumettre des améliorations et corrections

**En résumé** : Vous pouvez forker pour **contribuer**, mais pas pour **déployer
indépendamment**.

---

## 📚 Ressources Utiles

### Documentation Projet

- **AGENTS.md** : Documentation technique complète (à ajouter comme contexte
  pour AI assistants)
- **README.md** : Guide de démarrage rapide
- **.env.example** : Template de configuration

### Technologies

- [Architecture Hexagonale](https://alistair.cockburn.us/hexagonal-architecture/)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Outils de Développement

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [PgAdmin](https://www.pgadmin.org/) (optionnel)
- [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) pour
  tester l'API

---

## 🐛 Signaler un Bug

Ouvrez une issue avec :

- **Description claire** du problème
- **Steps to reproduce** (étapes pour reproduire)
- **Comportement attendu** vs **comportement actuel**
- **Environnement** (OS, Node version, Docker version)
- **Screenshots** si applicable

---

## 💡 Proposer une Fonctionnalité

Ouvrez une issue avec le label `enhancement` :

- **Description** de la fonctionnalité
- **Cas d'usage** : Pourquoi est-ce utile ?
- **Proposition d'implémentation** (optionnel)

---

## 💬 Questions ?

- Ouvrez une **issue** avec le label `question`
- Consultez **AGENTS.md** pour la documentation technique
- Lisez les **issues existantes** (votre question a peut-être déjà une réponse)

---

## 🙏 Merci !

Chaque contribution, aussi petite soit-elle, est précieuse. Merci de prendre le
temps de contribuer à ce projet d'apprentissage !

**Happy coding!** 🚀
