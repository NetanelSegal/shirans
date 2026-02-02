import 'dotenv/config';
import { hashPassword } from '../src/utils/password';
import { userRepository } from '../src/repositories/user.repository';
import { UserRole } from '../prisma/generated/prisma/enums';

async function createAdminUser() {
  // Get arguments from command line
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Usage: tsx scripts/create-admin-user.ts <email> <password> <name>');
    console.error('   Example: tsx scripts/create-admin-user.ts admin@example.com "SecurePassword123" "Shiran Gilad"');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    console.log('🔍 Checking if user already exists...');
    
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      console.error(`❌ User with email ${email} already exists`);
      process.exit(1);
    }

    console.log('🔐 Hashing password...');
    // Hash password
    const hashedPassword = await hashPassword(password);

    console.log('👤 Creating admin user...');
    // Create admin user
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: UserRole.ADMIN,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
