
import { storage } from "../server/storage";

async function createTestUser() {
  try {
    const testUser = {
      username: "admin",
      email: "admin@lab.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true
    };

    const user = await storage.createUser(testUser);
    console.log("Test user created successfully:", {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error creating test user:", error);
  }
  process.exit(0);
}

createTestUser();
