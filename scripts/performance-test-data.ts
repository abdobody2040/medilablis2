#!/usr/bin/env tsx
import { DatabaseStorage } from '../server/storage';
import { nanoid } from 'nanoid';

async function createPerformanceTestData() {
  const storage = new DatabaseStorage();
  console.log('Creating performance test data for unlimited records testing...');

  // Create 1000 test patients
  console.log('Creating 1000 test patients...');
  const patients = [];
  for (let i = 0; i < 1000; i++) {
    const patientData = {
      patientId: `TEST-${String(i + 1).padStart(6, '0')}`,
      firstName: `TestPatient${i + 1}`,
      lastName: `LastName${i + 1}`,
      dateOfBirth: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: ['male', 'female', 'other'][Math.floor(Math.random() * 3)] as 'male' | 'female' | 'other',
      phoneNumber: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      email: `testpatient${i + 1}@example.com`,
      address: `${i + 1} Test Street, Test City, TC 12345`,
      emergencyContact: `Emergency Contact ${i + 1}`,
      insuranceNumber: `INS-${String(i + 1).padStart(8, '0')}`,
      nationalId: `NAT-${String(i + 1).padStart(10, '0')}`,
      treatingDoctor: `Dr. Test Doctor ${(i % 10) + 1}`,
      isFasting: Math.random() > 0.5,
      isDiabetic: Math.random() > 0.8,
      isOnBloodThinner: Math.random() > 0.9,
      medicalHistory: `Medical history for patient ${i + 1}`,
      medications: `Current medications for patient ${i + 1}`,
    };

    try {
      const patient = await storage.createPatient(patientData);
      patients.push(patient);
      if ((i + 1) % 100 === 0) {
        console.log(`Created ${i + 1} patients...`);
      }
    } catch (error) {
      console.error(`Failed to create patient ${i + 1}:`, error);
    }
  }

  // Create 5000 test samples
  console.log('Creating 5000 test samples...');
  const sampleTypes = ['Blood', 'Urine', 'Stool', 'Saliva', 'Tissue'];
  const statuses = ['received', 'in_progress', 'completed', 'rejected'];
  const priorities = ['routine', 'urgent', 'stat'];

  for (let i = 0; i < 5000; i++) {
    const randomPatient = patients[Math.floor(Math.random() * patients.length)];
    const sampleData = {
      sampleId: `LAB-${new Date().getFullYear()}-${String(i + 1).padStart(6, '0')}`,
      patientId: randomPatient.id,
      collectedBy: nanoid(),
      sampleType: sampleTypes[Math.floor(Math.random() * sampleTypes.length)],
      containerType: 'Standard Container',
      volume: Math.floor(Math.random() * 100) + 1,
      unit: 'mL',
      collectionDateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      receivedDateTime: new Date(),
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
      comments: `Test sample ${i + 1} comments`,
      storageLocation: `Rack ${Math.floor(i / 100) + 1}, Position ${(i % 100) + 1}`,
      barcode: `BC-${String(i + 1).padStart(8, '0')}`,
    };

    try {
      await storage.createSample(sampleData);
      if ((i + 1) % 500 === 0) {
        console.log(`Created ${i + 1} samples...`);
      }
    } catch (error) {
      console.error(`Failed to create sample ${i + 1}:`, error);
    }
  }

  // Create 100 test users
  console.log('Creating 100 test users...');
  const roles = ['admin', 'lab_manager', 'technician', 'doctor', 'receptionist'];
  
  for (let i = 0; i < 100; i++) {
    const userData = {
      username: `testuser${i + 1}`,
      email: `testuser${i + 1}@lab.com`,
      password: 'testpass123',
      firstName: `TestUser${i + 1}`,
      lastName: `LastName${i + 1}`,
      role: roles[Math.floor(Math.random() * roles.length)] as any,
      isActive: Math.random() > 0.1, // 90% active users
    };

    try {
      await storage.createUser(userData);
    } catch (error) {
      console.error(`Failed to create user ${i + 1}:`, error);
    }
  }

  console.log('✅ Performance test data creation completed!');
  console.log('📊 Created:');
  console.log('   - 1,000 test patients');
  console.log('   - 5,000 test samples');
  console.log('   - 100 test users');
  console.log('🚀 System is now ready for unlimited records performance testing!');
}

createPerformanceTestData().catch(console.error);