import 'dotenv/config';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function releaseAdvisoryLocks() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('🔍 Checking for active advisory locks...\n');

    // Check for active advisory locks
    const lockCheckResult = await client.query(`
      SELECT 
        locktype,
        objid,
        pid,
        mode,
        granted
      FROM pg_locks
      WHERE locktype = 'advisory'
      ORDER BY objid;
    `);

    if (lockCheckResult.rows.length > 0) {
      console.log('⚠️  Found active advisory locks:');
      lockCheckResult.rows.forEach((lock) => {
        console.log(
          `   - Lock ID: ${lock.objid}, PID: ${lock.pid}, Mode: ${lock.mode}, Granted: ${lock.granted}`
        );
      });
      console.log('');
    } else {
      console.log('✅ No active advisory locks found\n');
    }

    // Release all advisory locks for this session
    console.log('🔓 Releasing all advisory locks for this session...');
    const releaseResult = await client.query('SELECT pg_advisory_unlock_all()');
    console.log('✅ Advisory locks released\n');

    // Check again to see if locks were released
    const finalCheck = await client.query(`
      SELECT COUNT(*) as count
      FROM pg_locks
      WHERE locktype = 'advisory';
    `);

    const remainingLocks = parseInt(finalCheck.rows[0].count, 10);
    if (remainingLocks > 0) {
      console.log(
        `⚠️  Warning: ${remainingLocks} advisory lock(s) still active (may be held by other sessions)`
      );
      
      // Get PIDs holding granted locks
      const grantedLocks = await client.query(`
        SELECT DISTINCT pid
        FROM pg_locks
        WHERE locktype = 'advisory' AND granted = true;
      `);

      if (grantedLocks.rows.length > 0) {
        console.log('\n🔪 Attempting to terminate processes holding locks...\n');
        
        for (const row of grantedLocks.rows) {
          const pid = row.pid;
          try {
            await client.query(`SELECT pg_terminate_backend(${pid})`);
            console.log(`   ✅ Terminated process PID: ${pid}`);
          } catch (error) {
            console.log(`   ⚠️  Could not terminate PID ${pid}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        
        // Wait a moment for locks to clear
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check again
        const finalCheck2 = await client.query(`
          SELECT COUNT(*) as count
          FROM pg_locks
          WHERE locktype = 'advisory';
        `);
        
        const stillRemaining = parseInt(finalCheck2.rows[0].count, 10);
        if (stillRemaining === 0) {
          console.log('\n✅ All advisory locks cleared!\n');
        } else {
          console.log(`\n⚠️  ${stillRemaining} lock(s) still active. You may need to restart your database.\n`);
        }
      } else {
        console.log(
          '\n   You may need to restart your database or kill the process holding the lock.\n'
        );
      }
    } else {
      console.log('✅ All advisory locks cleared!\n');
    }

    console.log('💡 You can now run: npm run prisma:migrate');
  } catch (error) {
    console.error('❌ Error releasing locks:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

releaseAdvisoryLocks();
