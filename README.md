# Project Nova

This is the technical repository for **Talvion**, a modern AI job matching platform.

## Application Brand Configuration
The application name is configurable. The current brand name is defined as `APP_NAME` in the environment configuration and frontend constants.
Changing `APP_NAME` will automatically update references throughout the application.

## Technology Stack
- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL (Prisma ORM)
- **Architecture:** Monorepo (npm workspaces)

## Getting Started
1. Copy `.env.example` to `.env` and adjust the variables.
2. Run `npm install` from the root.
3. Start the Postgres database.
4. Run `npm run db:push` from the `apps/api` folder to apply the schema.
5. Run `npm run db:seed` from the `apps/api` folder to seed dummy data and the admin account.
6. Run `npm run dev` from the root to start both frontend and backend.
