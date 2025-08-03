#!/usr/bin/env tsx
import { DatabaseStorage } from '../server/storage';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  const storage = new DatabaseStorage();
  
  console.log('Creating admin user...');
  
  const adminUser = {
    username: 'admin',
    email: 'admin@lab.com',
    password: await bcrypt.hash('admin123', 12),
    firstName: 'System',
    lastName: 'Administrator',
    role: 'admin' as const,
    isActive: true
  };

  try {
    // Check if admin user already exists
    const existingUser = await storage.getUserByUsername('admin');
    if (existingUser) {
      console.log('Admin user already exists!');
      console.log('Username:', existingUser.username);
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      return;
    }

    // Create the admin user
    const user = await storage.createUser(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('🔑 Password: admin123');
    console.log('🔒 Role:', user.role);
    console.log('🆔 User ID:', user.id);
    
    console.log('\n🚀 You can now log in with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser().catch(console.error);