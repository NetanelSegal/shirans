/**
 * E2E setup: creates an admin user for Playwright tests.
 * Email: e2e-admin@example.com (cleaned up by teardown)
 * Run before E2E tests via Playwright globalSetup.
 */
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const E2E_ADMIN_EMAIL = 'e2e-admin@example.com';
const E2E_ADMIN_PASSWORD = 'Admin123!';
const E2E_ADMIN_NAME = 'E2E Admin';

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('E2E setup: DATABASE_URL not set, skipping admin creation');
    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const hashedPassword = await bcrypt.hash(E2E_ADMIN_PASSWORD, 12);

    await prisma.user.upsert({
      where: { email: E2E_ADMIN_EMAIL },
      create: {
        email: E2E_ADMIN_EMAIL,
        password: hashedPassword,
        name: E2E_ADMIN_NAME,
        role: 'ADMIN',
      },
      update: {
        password: hashedPassword,
        name: E2E_ADMIN_NAME,
        role: 'ADMIN',
      },
    });

    console.log('E2E setup: admin user ready (e2e-admin@example.com)');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('E2E setup failed:', err);
  process.exit(1);
});
