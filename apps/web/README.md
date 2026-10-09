# UIKey Web App

This is the central web dashboard and landing page for UIKey, built with Next.js 15, Tailwind CSS, Prisma, and NextAuth.

## Getting Started

First, ensure you have dependencies installed (using pnpm):

```bash
pnpm install
```

### Database Setup

We use Prisma with an SQLite database for development. To initialize the database and push the schema, run:

```bash
npx prisma db push
```

### Environment Variables

Configure your environment variables by creating a `.env` file in this directory (`apps/web`):

```env
# The secret used to sign NextAuth tokens. Generate one securely using `openssl rand -base64 32`
NEXTAUTH_SECRET="super-secret-123"

# Prisma Database URL
DATABASE_URL="file:./dev.db"
```

### Running the App

To start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can log in to the Dashboard using the Mock Credentials setup.
- **Username:** `demo`
- **Password:** `demo`
