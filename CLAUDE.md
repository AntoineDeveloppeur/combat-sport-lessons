# CLAUDE.md

## Project Overview

Combat Sport Lessons is a full-stack application for creating, managing, and
sharing combat sport lesson plans. Monorepo with hexagonal architecture backend
and Next.js frontend.

### Tech Stack

**Backend:** TypeScript + Node.js + Express 5 · PostgreSQL (Docker) · Repository
Pattern + Hexagonal Architecture · JWT · Vitest

**Frontend:** Next.js 16 + React 19 · TypeScript · TailwindCSS 4 + shadcn/ui ·
Redux Toolkit (RTK Query) · React Hook Form + Yup · Vitest + Testing Library

**Monorepo:** npm workspaces · Husky + Commitlint (conventional commits) ·
Playwright E2E · Shared ESLint + Prettier

---

## Key Principles

- Domain layer is **independent** of frameworks — no external imports
- Use cases depend on **interfaces**, not concrete implementations
- All errors extend custom error classes with `status` and `log` properties
- Dependency injection at the controller level

---

## Code Style

- **Strict TypeScript** — ES modules (`import`/`export`), interfaces over types
- **No semicolons** · single quotes · 2 spaces (enforced by Prettier)
- **Files**: camelCase utilities, PascalCase components/classes
- **Hooks**: `use[Name]` · **Errors**: `[Name]Error` or `[Name]`
- Prefer server components by default; `"use client"` only when needed

---

## Important Notes

- **DB**: PostgreSQL `localhost:5432` via Docker
- **Backend API**: `http://localhost:4000`
- **Frontend**: `http://localhost:3000`
- **Env**: backend requires `.env` with `JWT_SECRET` + DB credentials

---

## Skills disponibles

Les skills suivants se déclenchent automatiquement selon le contexte de la
question :

| Skill               | Se déclenche quand…                                   |
| ------------------- | ----------------------------------------------------- |
| `ctx7`              | Question sur une librairie, framework, SDK ou API     |
| `add-error`         | Création d'une custom error class                     |
| `add-repo-method`   | Ajout d'une méthode à un repository                   |
| `add-db-constraint` | Ajout d'une contrainte DB (UNIQUE, NOT NULL…)         |
| `architecture`      | Question sur la structure ou l'organisation du projet |
| `testing`           | Écriture ou organisation de tests                     |
| `setup`             | Installation ou démarrage du projet                   |
| `troubleshoot`      | Problème de démarrage, DB, port ou compilation        |
