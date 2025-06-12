# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DoingApi is a task management and automation service for Live Church Solutions. It handles task workflows, automation triggers, assignments, and scheduling functionality for church management systems.

## Development Commands

```bash
# Initial setup
npm install
npm run initdb              # Initialize MySQL database with schema and demo data
npm run dev                 # Start development server with hot reload

# Build and deployment
npm run clean               # Clean dist directory
npm run lint                # Run TSLint with auto-fix
npm run tsc                 # TypeScript compilation
npm run build               # Full build pipeline (clean + lint + tsc)
npm run deploy-staging      # Deploy to staging environment
npm run deploy-prod         # Deploy to production environment

# Testing and local development
npm run serverless-local    # Test serverless functions locally
npm run start               # Run compiled application
```

## Architecture Overview

**Core Technologies:**
- Node.js 18.x with TypeScript
- Express.js with Inversify dependency injection
- MySQL database with custom repository pattern
- AWS Lambda deployment via Serverless Framework
- @churchapps/apihelper for shared functionality

**Key Architectural Patterns:**

1. **Dependency Injection**: Controllers use Inversify decorators (`@controller`, `@httpGet`, `@httpPost`)
2. **Repository Pattern**: Data access through `Repositories.getCurrent()` singleton
3. **Base Controller**: All controllers extend `DoingBaseController` which provides repository access
4. **Environment Configuration**: Config management via `Environment.init()` with environment-specific JSON files

## Database Setup

1. Create MySQL database named `doing`
2. Copy `dotenv.sample.txt` to `.env` with database credentials
3. Run `npm run initdb` to execute schema scripts from `tools/dbScripts/`

The initdb script creates two main table groups:
- **Tasks**: Actions, Automations, Tasks, Conditions
- **Scheduling**: Assignments, BlockoutDates, Plans, PlanItems, Positions, Times

## Code Structure

**Controllers** (`src/controllers/`):
- All extend `DoingBaseController` for shared functionality
- Use Inversify HTTP decorators for routing
- Access data via `this.repositories.[repositoryName]`
- Wrap business logic in `this.actionWrapper()` for authentication/error handling

**Models** (`src/models/`):
- TypeScript interfaces/classes for data entities
- Core entities: Task, Action, Automation, Plan, Assignment, etc.

**Repositories** (`src/repositories/`):
- Custom repository pattern for database operations
- Accessed via `Repositories.getCurrent()` singleton
- Each repository handles CRUD operations for its entity

**Helpers** (`src/helpers/`):
- `Environment.ts`: Configuration management (dev.json, staging.json, prod.json)
- Business logic helpers for automations, conditions, and plans

## Configuration

Environment-specific configs in `config/` directory:
- `dev.json` - Development settings
- `staging.json` - Staging environment
- `prod.json` - Production environment

Access configuration via `Environment.init()` method, never directly from config files.

## Authentication

Uses `CustomAuthProvider` from @churchapps/apihelper for JWT-based authentication. All controller actions automatically receive authentication context via the `actionWrapper` method.