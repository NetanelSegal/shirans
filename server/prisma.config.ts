import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use DIRECT_URL for Prisma CLI (migrations, introspection).
    // The pooled DATABASE_URL is used at runtime via the PrismaPg adapter.
    url: env('DIRECT_URL'),
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
});
