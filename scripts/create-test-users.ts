
#!/usr/bin/env tsx
import { DatabaseStorage } from '../server/storage';
import bcrypt from 'bcryptjs';

async function createTestUsers() {
  const storage = new DatabaseStorage();
  
  console.log('🚀 Creating test users for all roles...\n');
  
  const testUsers = [
    {
      username: 'admin',
      email: 'admin@lab.com',
      password: 'admin123',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin' as const,
      isActive: true
    },
    {
      username: 'labmanager',
      email: 'manager@lab.com',
      password: 'manager123',
      firstName: 'Lab',
      lastName: 'Manager',
      role: 'lab_manager' as const,
      isActive: true
    },
    {
      username: 'tech1',
      email: 'tech1@lab.com',
      password: 'tech123',
      firstName: 'John',
      lastName: 'Technician',
      role: 'technician' as const,
      isActive: true
    },
    {
      username: 'tech2',
      email: 'tech2@lab.com',
      password: 'tech123',
      firstName: 'Sarah',
      lastName: 'Analyst',
      role: 'technician' as const,
      isActive: true
    },
    {
      username: 'doctor1',
      email: 'doctor1@lab.com',
      password: 'doctor123',
      firstName: 'Dr. Michael',
      lastName: 'Smith',
      role: 'doctor' as const,
      isActive: true
    },
    {
      username: 'doctor2',
      email: 'doctor2@lab.com',
      password: 'doctor123',
      firstName: 'Dr. Emily',
      lastName: 'Johnson',
      role: 'doctor' as const,
      isActive: true
    },
    {
      username: 'reception1',
      email: 'reception1@lab.com',
      password: 'reception123',
      firstName: 'Alice',
      lastName: 'Receptionist',
      role: 'receptionist' as const,
      isActive: true
    },
    {
      username: 'reception2',
      email: 'reception2@lab.com',
      password: 'reception123',
      firstName: 'Bob',
      lastName: 'FrontDesk',
      role: 'receptionist' as const,
      isActive: true
    },
    // Inactive users for testing
    {
      username: 'inactive_tech',
      email: 'inactive@lab.com',
      password: 'inactive123',
      firstName: 'Inactive',
      lastName: 'User',
      role: 'technician' as const,
      isActive: false
    }
  ];

  const createdUsers = [];

  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        console.log(`⚠️  User '${userData.username}' already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      createdUsers.push({
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        password: userData.password // Store original password for reference
      });
      
      console.log(`✅ Created ${user.role}: ${user.username} (${user.email})`);
    } catch (error) {
      console.error(`❌ Failed to create user '${userData.username}':`, error);
    }
  }

  console.log('\n📋 SUMMARY OF CREATED USERS:');
  console.log('='.repeat(60));
  
  const roleGroups = createdUsers.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  }, {} as Record<string, typeof createdUsers>);

  Object.entries(roleGroups).forEach(([role, users]) => {
    console.log(`\n👥 ${role.toUpperCase().replace('_', ' ')}:`);
    users.forEach(user => {
      const status = user.isActive ? '🟢 Active' : '🔴 Inactive';
      console.log(`   ${status} | ${user.username} | ${user.email} | Password: ${user.password}`);
    });
  });

  console.log('\n🔐 LOGIN CREDENTIALS:');
  console.log('='.repeat(60));
  createdUsers.forEach(user => {
    console.log(`Username: ${user.username} | Password: ${user.password} | Role: ${user.role}`);
  });

  console.log('\n🎯 ROLE PERMISSIONS TESTING:');
  console.log('='.repeat(60));
  console.log('👑 ADMIN - Full system access, user management, settings');
  console.log('🏢 LAB_MANAGER - Lab oversight, reports, quality control');
  console.log('🔬 TECHNICIAN - Sample processing, test entry, results');
  console.log('👩‍⚕️ DOCTOR - View results, patient data, reports');
  console.log('📋 RECEPTIONIST - Patient registration, sample collection');
  
  console.log(`\n✨ Created ${createdUsers.length} test users successfully!`);
  console.log('🚀 You can now test role-based access control with these accounts.');
}

createTestUsers().catch(console.error);
