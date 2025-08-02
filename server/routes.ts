import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema, insertPatientSchema, insertSampleSchema, insertQualityControlSchema,
  insertFinancialRecordSchema, insertLabSettingsSchema, insertSystemSettingsSchema,
  insertActionLogSchema, insertReportSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      clients.delete(ws);
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.validateUserPassword(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // In a real app, you'd create a JWT token here
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username) || 
                          await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      res.status(201).json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/dashboard/recent-samples", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const samples = await storage.getRecentSamples(limit);
      res.json(samples);
    } catch (error) {
      console.error("Recent samples error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Patient routes
  app.get("/api/patients", async (req, res) => {
    try {
      const { search } = req.query;
      
      if (search) {
        const patients = await storage.searchPatients(search as string);
        res.json(patients);
      } else {
        const patients = await storage.getRecentPatients(50);
        res.json(patients);
      }
    } catch (error) {
      console.error("Get patients error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Get patient error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      
      // Check if patient ID already exists
      const existing = await storage.getPatientByPatientId(patientData.patientId);
      if (existing) {
        return res.status(409).json({ error: "Patient ID already exists" });
      }

      const patient = await storage.createPatient(patientData);
      
      // Broadcast new patient registration
      broadcast({ type: 'patient_registered', data: patient });
      
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create patient error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Sample routes
  app.get("/api/samples", async (req, res) => {
    try {
      const { status } = req.query;
      
      if (status) {
        const samples = await storage.getSamplesByStatus(status as string);
        res.json(samples);
      } else {
        const samples = await storage.getRecentSamples(50);
        res.json(samples);
      }
    } catch (error) {
      console.error("Get samples error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/samples/:id", async (req, res) => {
    try {
      const sample = await storage.getSample(req.params.id);
      if (!sample) {
        return res.status(404).json({ error: "Sample not found" });
      }
      res.json(sample);
    } catch (error) {
      console.error("Get sample error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/samples", async (req, res) => {
    try {
      const sampleData = insertSampleSchema.parse(req.body);
      
      // Check if sample ID already exists
      const existing = await storage.getSampleBySampleId(sampleData.sampleId);
      if (existing) {
        return res.status(409).json({ error: "Sample ID already exists" });
      }

      const sample = await storage.createSample(sampleData);
      
      // Broadcast new sample
      broadcast({ type: 'sample_created', data: sample });
      
      res.status(201).json(sample);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create sample error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/samples/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const sample = await storage.updateSample(id, updates);
      
      // Broadcast sample update
      broadcast({ type: 'sample_updated', data: sample });
      
      res.json(sample);
    } catch (error) {
      console.error("Update sample error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Test types routes
  app.get("/api/test-types", async (req, res) => {
    try {
      const testTypes = await storage.getTestTypes();
      res.json(testTypes);
    } catch (error) {
      console.error("Get test types error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    try {
      // This would need proper authorization in a real app
      const users = await storage.getRecentPatients(100); // Placeholder
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Quality Control routes
  app.post("/api/quality-control", async (req, res) => {
    try {
      const qcData = insertQualityControlSchema.parse(req.body);
      const qc = await storage.createQualityControl(qcData);
      
      // Log the action
      await storage.logAction({
        userId: req.body.runBy,
        actionType: "QC_ENTRY_SUBMITTED",
        actionCategory: "quality_control",
        actionData: qcData,
        description: `QC entry submitted for test type ${req.body.testTypeId}`,
        success: true
      });

      res.json(qc);
    } catch (error) {
      console.error("QC creation error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid QC data" });
    }
  });

  // Financial routes
  app.post("/api/financial/invoice", async (req, res) => {
    try {
      const invoiceData = insertFinancialRecordSchema.parse(req.body);
      const invoice = await storage.createFinancialRecord(invoiceData);
      
      // Log the action
      await storage.logAction({
        userId: req.body.processedBy,
        actionType: "INVOICE_CREATED",
        actionCategory: "financial",
        actionData: invoiceData,
        description: `Invoice ${invoiceData.invoiceNumber} created for patient ${invoiceData.patientId}`,
        success: true
      });

      res.json(invoice);
    } catch (error) {
      console.error("Invoice creation error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid invoice data" });
    }
  });

  app.post("/api/financial/payment", async (req, res) => {
    try {
      const { invoiceNumber, status } = req.body;
      
      if (!invoiceNumber || !status) {
        return res.status(400).json({ error: "Invoice number and status required" });
      }

      await storage.updatePaymentStatus(invoiceNumber, status);
      
      // Log the action
      await storage.logAction({
        userId: req.body.userId || 'system',
        actionType: "PAYMENT_PROCESSED",
        actionCategory: "financial",
        actionData: { invoiceNumber, status },
        description: `Payment status updated to ${status} for invoice ${invoiceNumber}`,
        success: true
      });

      res.json({ success: true, message: "Payment status updated" });
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ error: "Payment processing failed" });
    }
  });

  // Settings routes
  app.get("/api/settings/lab", async (req, res) => {
    try {
      const settings = await storage.getLabSettings();
      res.json(settings);
    } catch (error) {
      console.error("Lab settings fetch error:", error);
      res.status(500).json({ error: "Failed to fetch lab settings" });
    }
  });

  app.post("/api/settings/lab", async (req, res) => {
    try {
      const settingsData = insertLabSettingsSchema.parse(req.body);
      const settings = await storage.saveLabSettings(settingsData);
      
      // Log the action
      await storage.logAction({
        userId: req.body.updatedBy,
        actionType: "LAB_SETTINGS_SAVED",
        actionCategory: "setup",
        actionData: settingsData,
        description: `Lab settings updated: ${settingsData.labName}`,
        success: true
      });

      res.json(settings);
    } catch (error) {
      console.error("Lab settings save error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid settings data" });
    }
  });

  app.post("/api/settings/system", async (req, res) => {
    try {
      const settingData = insertSystemSettingsSchema.parse(req.body);
      const setting = await storage.saveSystemSetting(settingData);
      
      // Log the action
      await storage.logAction({
        userId: req.body.updatedBy,
        actionType: "SYSTEM_SETTING_SAVED",
        actionCategory: "setup",
        actionData: settingData,
        description: `System setting updated: ${settingData.settingKey}`,
        success: true
      });

      res.json(setting);
    } catch (error) {
      console.error("System setting save error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid setting data" });
    }
  });

  // Reports routes
  app.post("/api/reports/generate", async (req, res) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reportData);
      
      // Log the action
      await storage.logAction({
        userId: req.body.generatedBy,
        actionType: "REPORT_GENERATED",
        actionCategory: "reports",
        actionData: reportData,
        description: `Report generated: ${reportData.title}`,
        success: true
      });

      res.json(report);
    } catch (error) {
      console.error("Report generation error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid report data" });
    }
  });

  app.get("/api/reports", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const reports = await storage.getReports(limit);
      res.json(reports);
    } catch (error) {
      console.error("Reports fetch error:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // User management routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username) || 
                          await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Log the action
      await storage.logAction({
        userId: req.body.createdBy || 'system',
        actionType: "USER_CREATED",
        actionCategory: "user_management",
        actionData: { username: userData.username, email: userData.email, role: userData.role },
        description: `User created: ${userData.username} (${userData.role})`,
        success: true
      });

      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  // Action logs route
  app.get("/api/action-logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getActionLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Action logs fetch error:", error);
      res.status(500).json({ error: "Failed to fetch action logs" });
    }
  });

  // Generic action logging endpoint for any button action
  app.post("/api/actions/log", async (req, res) => {
    try {
      const actionData = insertActionLogSchema.parse(req.body);
      const action = await storage.logAction(actionData);
      res.json(action);
    } catch (error) {
      console.error("Action logging error:", error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid action data" });
    }
  });

  return httpServer;
}
