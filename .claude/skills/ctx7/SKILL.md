---
name: ctx7
description: >
  Fetch up-to-date library documentation using the ctx7 CLI.
  Use this skill whenever the user's question involves a specific named library, framework, SDK, API,
  CLI tool, or cloud service — including React, Next.js, Prisma, Express, Tailwind, Django,
  Spring Boot, RTK Query, Vitest, Playwright, shadcn/ui, JWT, PostgreSQL drivers, or any other
  named technology. Trigger for: API syntax, configuration options, version migration,
  library-specific errors or debugging, setup instructions, CLI usage, "how do I use X",
  "what's the config for X". Always prefer this over training data — even for well-known
  libraries, the docs may have changed. Do NOT trigger for: pure refactoring, business logic
  debugging unrelated to a library API, general code review, or abstract programming concepts
  with no named library involved.
---

## Procédure

Toujours appeler `library` en premier pour obtenir un ID valide, sauf si l'utilisateur fournit directement un ID au format `/org/project`.

### Étape 1 — Résoudre l'ID de la librairie

```bash
npx ctx7@latest library <nom> "<question complète de l'utilisateur>"
```

Utiliser le nom officiel avec la ponctuation exacte :
- ✅ `"Next.js"` pas `"nextjs"`
- ✅ `"Three.js"` pas `"threejs"`
- ✅ `"Customer.io"` pas `"customerio"`

Si les résultats ne correspondent pas, essayer une variante du nom ou reformuler la query.

### Étape 2 — Choisir le meilleur match

Critères de sélection (format `/org/project`) :
1. Correspondance exacte du nom
2. Pertinence de la description par rapport à la question
3. Nombre de code snippets (plus = mieux)
4. Réputation de la source (High/Medium préféré)
5. Benchmark score (plus élevé = mieux)

Pour une version spécifique, utiliser `/org/project/version` (ex: `/vercel/next.js/v14.3.0`).

### Étape 3 — Fetcher la documentation

```bash
npx ctx7@latest docs <libraryId> "<question complète de l'utilisateur>"
```

Utiliser la question complète comme query — les queries précises donnent de meilleurs résultats que des mots seuls.

### Étape 4 — Répondre avec la documentation récupérée

## Contraintes

- Maximum 3 commandes par question
- Ne jamais inclure d'informations sensibles (clés API, mots de passe) dans les queries
- En cas d'erreur quota : informer l'utilisateur et suggérer `npx ctx7@latest login` ou la variable `CONTEXT7_API_KEY`
- Ne jamais tomber silencieusement sur les données d'entraînement si ctx7 échoue
