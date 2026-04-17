# AGENTS.md

## Project Overview

Combat Sport Lessons is a full-stack application for creating, managing, and sharing combat sport lesson plans. The project follows a **monorepo structure** with a **hexagonal architecture** backend and a **Next.js** frontend.

### Tech Stack

**Backend:**

- TypeScript + Node.js + Express 5
- PostgreSQL (Docker)
- Repository Pattern + Hexagonal Architecture
- JWT authentication
- Vitest for testing

**Frontend:**

- Next.js 16 + React 19
- TypeScript
- TailwindCSS 4 + shadcn/ui
- Redux Toolkit (RTK Query)
- React Hook Form + Yup validation
- Vitest + Testing Library

**Monorepo:**

- npm workspaces
- Husky + Commitlint (conventional commits)
- Playwright for E2E tests
- Shared ESLint + Prettier config

---

## Setup Commands

### Initial Setup

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend;npm install

# Install backend dependencies
cd frontend;npm install

# Start PostgreSQL database
cd backend; npm run db:start
```

### Backend Development

```bash
cd backend

# Compile TypeScript in watch mode (terminal 1)
npm run type:watch

# Start dev server with nodemon (terminal 2)
npm run dev

# Run tests
npm run test
npm run test:ui  # with UI

# Database management
npm run db:start   # Start PostgreSQL
npm run db:stop    # Stop PostgreSQL
npm run db:reset   # Reset database
```

### Frontend Development

```bash
cd frontend

# Start Next.js dev server
npm run dev

# Run tests
npm run test
npm run test:ui
npm run test:coverage
```

### Integration Tests

```bash
# From root directory
npm run test:integration
npm run test:integration:ui
npm run test:integration:debug
```

---

## Architecture Guidelines

### Backend Structure

```
backend/src/
├── domain/              # Business logic (framework-agnostic)
│   ├── entities/        # Business entities (User, Lesson)
│   ├── repositories/    # Repository interfaces
│   ├── services/        # Service interfaces (Hasher, TokenManager)
│   ├── errors/          # Custom error classes
│   └── utils/           # Types and utilities
│
├── application/         # Use cases (orchestration layer)
│   └── usecases/        # Business operations
│
├── infrastructure/      # Technical implementations
│   ├── postSQL/         # PostgreSQL repository implementations
│   └── services/        # Concrete service implementations
│
└── presentation/        # HTTP layer
    ├── controllers/     # Express controllers
    ├── routes/          # Route definitions
    └── swagger/         # API documentation
```

**Key Principles:**

- Domain layer is **independent** of frameworks and external libraries
- Use cases depend on **interfaces**, not concrete implementations
- Dependency injection at the controller level
- All errors extend custom error classes with `status` and `log` properties

### Frontend Structure

```
frontend/
├── app/                 # Next.js App Router
│   ├── (app)/          # Authenticated routes
│   ├── (auth)/         # Public auth routes
│   └── layout.tsx
│
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── form/           # Form-specific components
│   ├── lessonTable/    # Table components
│   └── landing/        # Landing page components
│
├── store/              # Redux store
│   └── api/            # RTK Query API slices
│
├── contexts/           # React contexts
├── lib/                # Utilities and helpers
├── types/              # TypeScript types
└── utils/              # Utility functions
```

---

## Code Style

### TypeScript

- **Strict mode enabled** in both frontend and backend
- Use **ES modules** (`import`/`export`), not CommonJS (`require`)
- Prefer **interfaces** over types for object shapes
- Use **functional patterns** where possible (pure functions, immutability)

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components/classes
- **Error classes**: `[Name]Error` or `[Name]` (e.g., `NotOwnerError`, `LessonIdNotFound`)
- **Components**: PascalCase (e.g., `LessonTable.tsx`)
- **Hooks**: `use[Name]` (e.g., `useAuth`)

### React/Next.js

- Use **"use client"** directive for client components
- Prefer **server components** by default
- Use **shadcn/ui** components for UI primitives
- **TailwindCSS** for styling (utility-first)
- **Lucide React** or **Tabler Icons** for icons

### Formatting

- **No semicolons** (enforced by Prettier)
- **Single quotes** for strings
- **2 spaces** indentation
- Run `npm run prettier:backend` or `npm run prettier:frontend` before committing

---

## Testing Guidelines

### Backend Tests (Vitest)

- Unit tests for use cases and domain logic are in the same folder than the tested module
- E2E tests are in src/**test**/
- Test files: `*.test.ts` or `*.spec.ts`
- Mock repositories and services using interfaces
- Run: `cd backend && npm run test`

### Frontend Tests (Vitest + Testing Library)

- Component tests with React Testing Library
- Test user interactions, not implementation details
- Run: `cd frontend && npm run test`

### E2E Tests (Playwright)

- Located in `tests/integration/`
- Test critical user flows (sign-up, login, lesson creation)
- Run from root: `npm run test:integration`

---

## Critical Checklists

### When Adding a Custom Error Class

**ALWAYS complete ALL these steps:**

1. ✅ Create the error class in `domain/errors/[ErrorName].ts`
   - Must extend `Error`
   - Must have `status: number` property
   - Must have `log` property with relevant context
   - Must call `super()` with public message

2. ✅ **Update the controller** in `presentation/controllers/`
   - Import the new error class
   - Add `if (error instanceof [ErrorName])` block in catch
   - Log the error: `console.error(error.log)`
   - Return appropriate response: `res.status(error.status).json({ error: error.message })`

3. ✅ Create/update tests for the use case
   - Test that the error is thrown in the correct scenario
   - Use `expect(...).rejects.toThrow([ErrorName])`

**Example:**

```typescript
// 1. domain/errors/DuplicateUsername.ts
export class DuplicateUsername extends Error {
  status: number = 409
  log: { logMessage: string; username: string }
  constructor(username: string) {
    const publicMessage = "Ce nom d'utilisateur est déjà utilisé"
    super(publicMessage)
    this.log = { logMessage: `Duplicate username: ${username}`, username }
  }
}

// 2. presentation/controllers/user.ts
import { DuplicateUsername } from "../../domain/errors/DuplicateUsername.js"

catch (error) {
  if (error instanceof DuplicateUsername) {
    console.error(error.log)
    return res.status(error.status).json({ error: error.message })
  }
}

// 3. Test
await expect(
  createUser(...)
).rejects.toThrow(DuplicateUsername)
```

### When Adding a Method to a Repository Interface

**ALWAYS complete ALL these steps:**

1. ✅ Add method to the interface in `domain/repositories/`

   ```typescript
   export interface UserRepository {
     isUsernameAlreadyUsed(username: string): Promise<boolean>
   }
   ```

2. ✅ **Implement the method** in `infrastructure/postSQL/`

   ```typescript
   async isUsernameAlreadyUsed(username: string): Promise<boolean> {
     const query = `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) as exists`
     const result = await this.pool.query(query, [username])
     return result.rows[0].exists
   }
   ```

3. ✅ **Update ALL existing tests** that mock this repository
   - Add the new method to mock objects: `isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false)`
   - Tests will fail with TypeScript errors if you forget this step

**Example:**

```typescript
// Before: Test will FAIL after adding isUsernameAlreadyUsed to interface
const mockUserRepository: Partial<UserRepository> = {
  isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
  create: vi.fn().mockResolvedValue(undefined),
}

// After: Test will PASS
const mockUserRepository: Partial<UserRepository> = {
  isEmailAlreadyUsed: vi.fn().mockResolvedValue(false),
  isUsernameAlreadyUsed: vi.fn().mockResolvedValue(false), // ✅ Added
  create: vi.fn().mockResolvedValue(undefined),
}
```

### When Adding Database Constraints (UNIQUE, NOT NULL, etc.)

**ALWAYS complete ALL these steps:**

1. ✅ Update `init.sql` with the constraint
2. ✅ Create corresponding custom error class
3. ✅ Update repository interface with validation method
4. ✅ Implement validation in PostgreSQL repository
5. ✅ Update use case to check constraint before saving
6. ✅ Update controller to handle the error
7. ✅ Update all test mocks for the repository

---

## Common Patterns

### Error Handling (Backend)

```typescript
// 1. Create custom error in domain/errors/
export class NotOwnerError extends Error {
  status: number = 403
  log: { logMessage: string }
  constructor(userId: string, lessonId: string) {
    super("Vous n'êtes pas propriétaire de cette leçon")
    this.log = { logMessage: `Unauthorized - userId: ${userId}, lessonId: ${lessonId}` }
  }
}

// 2. Throw in use case
if (lesson.userId !== userId) {
  throw new NotOwnerError(userId, lessonId)
}

// 3. Handle in controller
catch (error) {
  if (error instanceof NotOwnerError) {
    console.error(error.log)
    return res.status(error.status).json({ error: error.message })
  }
}
```

### API Calls (Frontend)

```typescript
// Use RTK Query in store/api/
export const lessonApi = createApi({
  reducerPath: "lessonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  endpoints: (builder) => ({
    getLessons: builder.query<Lesson[], void>({
      query: () => "/lessons",
    }),
  }),
})
```

### Event Propagation (Frontend)

```typescript
// Stop propagation when clicking nested interactive elements
<DropdownMenuItem
  onClick={(e) => {
    e.stopPropagation()
    handleAction()
  }}
>
```

---

## Important Notes

- **Database**: PostgreSQL runs on `localhost:5432` via Docker
- **Backend API**: Runs on `http://localhost:4000`
- **Frontend**: Runs on `http://localhost:3000`
- **API Docs**: Swagger UI at `http://localhost:4000/api-docs`
- **Environment**: Backend requires `.env` file with `JWT_SECRET` and database credentials
- **Type Safety**: Always check types when proposing solutions
- **Immutability**: Prefer immutable data structures and pure functions
- **No Auto-Answers**: Encourage learning by pointing to problematic code before providing solutions

---

## Troubleshooting

### Database Connection Issues

```bash
# Check if Docker is running
docker ps

# Reset database
cd backend && npm run db:reset
```

### TypeScript Compilation Errors

```bash
# Rebuild TypeScript
cd backend && npm run type:watch
```

### Port Already in Use

```bash
# Kill process on port 4000 (backend)
npx kill-port 4000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

---

## Learning Philosophy

This project emphasizes **understanding over shortcuts**:

- When asked about issues, **identify the problematic code** first
- Explain **why** something is wrong using analogies when helpful
- Encourage finding solutions independently before providing answers
- Focus on **vocabulary** and correct terminology
- Check **type correctness** in every solution
