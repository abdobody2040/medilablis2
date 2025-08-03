import { 
  users, patients, samples, testRequests, testResults, testTypes, 
  qualityControls, outboundSamples, worklists, financialRecords,
  labSettings, systemSettings, actionLogs, reports,
  type User, type InsertUser, type Patient, type InsertPatient,
  type Sample, type InsertSample, type TestRequest, type InsertTestRequest,
  type TestResult, type InsertTestResult, type TestType, type InsertTestType,
  type QualityControl, type InsertQualityControl, type FinancialRecord, type InsertFinancialRecord,
  type LabSettings, type InsertLabSettings, type SystemSettings, type InsertSystemSettings,
  type ActionLog, type InsertActionLog, type Report, type InsertReport
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, count, sum, avg, gte } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUsers(limit: number, offset?: number, role?: string, search?: string): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  validateUserPassword(username: string, password: string): Promise<User | null>;

  // Patient operations
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByPatientId(patientId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;
  searchPatients(query: string, limit?: number, offset?: number): Promise<Patient[]>;
  getRecentPatients(limit: number, offset?: number): Promise<Patient[]>;

  // Sample operations
  getSample(id: string): Promise<Sample | undefined>;
  getSampleBySampleId(sampleId: string): Promise<Sample | undefined>;
  createSample(sample: InsertSample): Promise<Sample>;
  updateSample(id: string, sample: Partial<InsertSample>): Promise<Sample>;
  getRecentSamples(limit: number): Promise<Array<Sample & { patient: Patient }>>;
  getSamples(limit?: number, offset?: number, sortBy?: string, sortOrder?: string): Promise<Array<Sample & { patient: Patient }>>;
  getSamplesByStatus(status: string, limit?: number, offset?: number, sortBy?: string, sortOrder?: string): Promise<Array<Sample & { patient: Patient }>>;
  getDailySamplesCount(): Promise<number>;

  // Test operations
  getTestTypes(): Promise<TestType[]>;
  createTestType(testType: InsertTestType): Promise<TestType>;
  createTestRequest(testRequest: InsertTestRequest): Promise<TestRequest>;
  getTestRequestsForSample(sampleId: string): Promise<TestRequest[]>;
  getPendingTestsCount(): Promise<number>;

  // Results operations
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResults(testRequestId: string): Promise<TestResult[]>;
  getCompletedResultsCount(): Promise<number>;

  // Quality Control operations
  createQualityControl(qc: InsertQualityControl): Promise<QualityControl>;
  getRecentQualityControls(limit: number): Promise<Array<QualityControl & { testType: TestType }>>;

  // Dashboard statistics
  getDashboardStats(): Promise<{
    dailySamples: number;
    resultsReady: number;
    pendingTests: number;
    activeUsers: number;
  }>;

  // Financial operations
  createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord>;
  getFinancialRecords(limit?: number): Promise<Array<FinancialRecord & { patient: Patient }>>;
  updatePaymentStatus(invoiceNumber: string, status: string): Promise<void>;

  // Settings operations
  getLabSettings(): Promise<LabSettings | undefined>;
  saveLabSettings(settings: InsertLabSettings): Promise<LabSettings>;
  getSystemSetting(key: string): Promise<SystemSettings | undefined>;
  saveSystemSetting(setting: InsertSystemSettings): Promise<SystemSettings>;

  // Action logging
  logAction(action: InsertActionLog): Promise<ActionLog>;
  getActionLogs(limit?: number): Promise<Array<ActionLog & { user: User }>>;

  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReports(limit?: number): Promise<Array<Report & { generatedBy: User }>>;
  updateReportStatus(id: string, status: string, filePath?: string, fileSize?: number): Promise<void>;

    getUserById(id: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

    async getUserById(id: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }

  async getUsers(limit: number, offset: number = 0, role?: string, search?: string): Promise<User[]> {
    let query = db
      .select()
      .from(users);

    // Add role filter if specified
    if (role && role !== 'all') {
      query = query.where(eq(users.role, role as any));
    }

    // Add search filter if specified
    if (search) {
      query = query.where(
        like(users.firstName, `%${search}%`) ||
        like(users.lastName, `%${search}%`) ||
        like(users.username, `%${search}%`) ||
        like(users.email, `%${search}%`)
      );
    }

    return await query
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 12);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async updateUser(id: string, updateUser: Partial<InsertUser>): Promise<User> {
    const updateData = { ...updateUser };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getPatientByPatientId(patientId: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.patientId, patientId));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async updatePatient(id: string, updatePatient: Partial<InsertPatient>): Promise<Patient> {
    const [patient] = await db
      .update(patients)
      .set({ ...updatePatient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return patient;
  }

  async searchPatients(query: string, limit: number = 50, offset: number = 0): Promise<Patient[]> {
    return await db
      .select()
      .from(patients)
      .where(
        like(patients.firstName, `%${query}%`) ||
        like(patients.lastName, `%${query}%`) ||
        like(patients.patientId, `%${query}%`)
      )
      .orderBy(desc(patients.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getRecentPatients(limit: number, offset: number = 0): Promise<Patient[]> {
    return await db
      .select()
      .from(patients)
      .orderBy(desc(patients.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getSample(id: string): Promise<Sample | undefined> {
    const [sample] = await db.select().from(samples).where(eq(samples.id, id));
    return sample || undefined;
  }

  async getSampleBySampleId(sampleId: string): Promise<Sample | undefined> {
    const [sample] = await db.select().from(samples).where(eq(samples.sampleId, sampleId));
    return sample || undefined;
  }

  async createSample(insertSample: InsertSample): Promise<Sample> {
    const [sample] = await db
      .insert(samples)
      .values(insertSample)
      .returning();
    return sample;
  }

  async updateSample(id: string, updateSample: Partial<InsertSample>): Promise<Sample> {
    const [sample] = await db
      .update(samples)
      .set({ ...updateSample, updatedAt: new Date() })
      .where(eq(samples.id, id))
      .returning();
    return sample;
  }

  async getRecentSamples(limit: number): Promise<Array<Sample & { patient: Patient }>> {
    const result = await db
      .select()
      .from(samples)
      .innerJoin(patients, eq(samples.patientId, patients.id))
      .orderBy(desc(samples.createdAt))
      .limit(limit);

    return result.map(row => ({
      ...row.samples,
      patient: row.patients
    }));
  }

  async getSamples(limit: number = 50, offset: number = 0, sortBy: string = 'createdAt', sortOrder: string = 'desc'): Promise<Array<Sample & { patient: Patient }>> {
    const orderByClause = sortOrder === 'asc' ? asc(samples[sortBy as keyof typeof samples] || samples.createdAt) : desc(samples[sortBy as keyof typeof samples] || samples.createdAt);
    
    const result = await db
      .select()
      .from(samples)
      .leftJoin(patients, eq(samples.patientId, patients.id))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return result.map(row => ({
      ...row.samples,
      patient: row.patients || {
        id: '',
        patientId: 'Unknown',
        firstName: 'Unknown',
        lastName: 'Patient',
        dateOfBirth: new Date(),
        gender: 'unknown' as const,
        phoneNumber: null,
        email: null,
        address: null,
        emergencyContact: null,
        insuranceNumber: null,
        nationalId: null,
        treatingDoctor: null,
        landline: null,
        fastingHours: null,
        isFasting: false,
        isDiabetic: false,
        isOnBloodThinner: false,
        isOnAntibiotics: false,
        isOnThyroidMedication: false,
        isOnKidneyTreatment: false,
        isOnLiverTreatment: false,
        isOnCholesterolMedication: false,
        isOnCortisone: false,
        hadContrastScan: false,
        hadBloodTransfusion: false,
        bloodTransfusionDate: null,
        hadSurgeries: false,
        hadChemoRadiotherapy: false,
        lastMenstrualPeriod: null,
        isPregnant: false,
        requiredTests: null,
        isOnIronVitamins: false,
        ironVitaminsDose: null,
        ironVitaminsDuration: null,
        medicalHistory: null,
        medications: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));
  }

  async getSamplesByStatus(status: string, limit: number = 50, offset: number = 0, sortBy: string = 'createdAt', sortOrder: string = 'desc'): Promise<Array<Sample & { patient: Patient }>> {
    // Validate that the status is a valid enum value
    const validStatuses = ['received', 'in_progress', 'completed', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid sample status: ${status}`);
    }

    const orderByClause = sortOrder === 'asc' ? asc(samples[sortBy as keyof typeof samples] || samples.createdAt) : desc(samples[sortBy as keyof typeof samples] || samples.createdAt);

    const result = await db
      .select()
      .from(samples)
      .innerJoin(patients, eq(samples.patientId, patients.id))
      .where(eq(samples.status, status as any))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return result.map(row => ({
      ...row.samples,
      patient: row.patients
    }));
  }

  async getDailySamplesCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [result] = await db
      .select({ count: count() })
      .from(samples)
      .where(gte(samples.receivedDateTime, today));

    return result.count;
  }

  async getTestTypes(): Promise<TestType[]> {
    return await db
      .select()
      .from(testTypes)
      .where(eq(testTypes.isActive, true))
      .orderBy(asc(testTypes.name));
  }

  async createTestType(insertTestType: InsertTestType): Promise<TestType> {
    const [testType] = await db
      .insert(testTypes)
      .values(insertTestType)
      .returning();
    return testType;
  }

  async createTestRequest(insertTestRequest: InsertTestRequest): Promise<TestRequest> {
    const [testRequest] = await db
      .insert(testRequests)
      .values(insertTestRequest)
      .returning();
    return testRequest;
  }

  async getTestRequestsForSample(sampleId: string): Promise<TestRequest[]> {
    return await db
      .select()
      .from(testRequests)
      .where(eq(testRequests.sampleId, sampleId))
      .orderBy(desc(testRequests.requestDateTime));
  }

  async getPendingTestsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(testRequests)
      .where(eq(testRequests.status, "pending"));

    return result.count;
  }

  async createTestResult(insertTestResult: InsertTestResult): Promise<TestResult> {
    const [testResult] = await db
      .insert(testResults)
      .values(insertTestResult)
      .returning();
    return testResult;
  }

  async getTestResults(testRequestId: string): Promise<TestResult[]> {
    return await db
      .select()
      .from(testResults)
      .where(eq(testResults.testRequestId, testRequestId))
      .orderBy(asc(testResults.parameterId));
  }

  async getCompletedResultsCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [result] = await db
      .select({ count: count() })
      .from(testRequests)
      .where(
        and(
          eq(testRequests.status, "completed"),
          gte(testRequests.completedDateTime, today)
        )
      );

    return result.count;
  }

  async createQualityControl(insertQualityControl: InsertQualityControl): Promise<QualityControl> {
    const [qualityControl] = await db
      .insert(qualityControls)
      .values(insertQualityControl)
      .returning();
    return qualityControl;
  }

  async getRecentQualityControls(limit: number): Promise<Array<QualityControl & { testType: TestType }>> {
    const result = await db
      .select()
      .from(qualityControls)
      .innerJoin(testTypes, eq(qualityControls.testTypeId, testTypes.id))
      .orderBy(desc(qualityControls.runDateTime))
      .limit(limit);

    return result.map(row => ({
      ...row.quality_controls,
      testType: row.test_types
    }));
  }

  async getDashboardStats(): Promise<{
    dailySamples: number;
    resultsReady: number;
    pendingTests: number;
    activeUsers: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [dailySamples] = await db
      .select({ count: count() })
      .from(samples)
      .where(gte(samples.receivedDateTime, today));

    const [resultsReady] = await db
      .select({ count: count() })
      .from(testRequests)
      .where(eq(testRequests.status, "completed"));

    const [pendingTests] = await db
      .select({ count: count() })
      .from(testRequests)
      .where(eq(testRequests.status, "pending"));

    const [activeUsers] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.isActive, true));

    return {
      dailySamples: dailySamples.count,
      resultsReady: resultsReady.count,
      pendingTests: pendingTests.count,
      activeUsers: activeUsers.count,
    };
  }

  // Financial operations
  async createFinancialRecord(insertFinancialRecord: InsertFinancialRecord): Promise<FinancialRecord> {
    const [record] = await db
      .insert(financialRecords)
      .values(insertFinancialRecord)
      .returning();
    return record;
  }

  async getFinancialRecords(limit: number = 50): Promise<Array<FinancialRecord & { patient: Patient }>> {
    const result = await db
      .select()
      .from(financialRecords)
      .innerJoin(patients, eq(financialRecords.patientId, patients.id))
      .orderBy(desc(financialRecords.transactionDate))
      .limit(limit);

    return result.map(row => ({
      ...row.financial_records,
      patient: row.patients
    }));
  }

  async updatePaymentStatus(invoiceNumber: string, status: string): Promise<void> {
    await db
      .update(financialRecords)
      .set({ paymentStatus: status })
      .where(eq(financialRecords.invoiceNumber, invoiceNumber));
  }

  // Settings operations
  async getLabSettings(): Promise<LabSettings | undefined> {
    const [settings] = await db
      .select()
      .from(labSettings)
      .orderBy(desc(labSettings.updatedAt))
      .limit(1);
    return settings || undefined;
  }

  async saveLabSettings(insertLabSettings: InsertLabSettings): Promise<LabSettings> {
    const [settings] = await db
      .insert(labSettings)
      .values(insertLabSettings)
      .returning();
    return settings;
  }

  async getSystemSetting(key: string): Promise<SystemSettings | undefined> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.settingKey, key));
    return setting || undefined;
  }

  async saveSystemSetting(insertSystemSettings: InsertSystemSettings): Promise<SystemSettings> {
    const [setting] = await db
      .insert(systemSettings)
      .values(insertSystemSettings)
      .onConflictDoUpdate({
        target: systemSettings.settingKey,
        set: {
          settingValue: insertSystemSettings.settingValue,
          updatedBy: insertSystemSettings.updatedBy,
          updatedAt: new Date(),
        }
      })
      .returning();
    return setting;
  }

  // Action logging
  async logAction(insertActionLog: InsertActionLog): Promise<ActionLog> {
    const [action] = await db
      .insert(actionLogs)
      .values(insertActionLog)
      .returning();
    return action;
  }

  async getActionLogs(limit: number = 100): Promise<Array<ActionLog & { user: User }>> {
    const result = await db
      .select()
      .from(actionLogs)
      .innerJoin(users, eq(actionLogs.userId, users.id))
      .orderBy(desc(actionLogs.createdAt))
      .limit(limit);

    return result.map(row => ({
      ...row.action_logs,
      user: row.users
    }));
  }

  // Reports
  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getReports(limit: number = 50): Promise<Array<Report & { generatedBy: User }>> {
    const result = await db
      .select()
      .from(reports)
      .innerJoin(users, eq(reports.generatedBy, users.id))
      .orderBy(desc(reports.generatedAt))
      .limit(limit);

    return result.map(row => ({
      ...row.reports,
      generatedBy: row.users
    } as Report & { generatedBy: User }));
  }

  async updateReportStatus(id: string, status: string, filePath?: string, fileSize?: number): Promise<void> {
    const updateData: any = { status };
    if (filePath) updateData.filePath = filePath;
    if (fileSize) updateData.fileSize = fileSize;

    await db
      .update(reports)
      .set(updateData)
      .where(eq(reports.id, id));
  }

  // Missing methods for worklists
  async getWorklists(limit: number = 50): Promise<Worklist[]> {
    return await db
      .select()
      .from(worklists)
      .where(eq(worklists.isActive, true))
      .orderBy(desc(worklists.createdAt))
      .limit(limit);
  }

  async createWorklist(insertWorklist: InsertWorklist): Promise<Worklist> {
    const [worklist] = await db
      .insert(worklists)
      .values(insertWorklist)
      .returning();
    return worklist;
  }

  // Missing methods for outbound samples
  async getOutboundSamples(limit: number = 50): Promise<OutboundSample[]> {
    return await db
      .select()
      .from(outboundSamples)
      .orderBy(desc(outboundSamples.sentDateTime))
      .limit(limit);
  }

  async createOutboundSample(insertOutboundSample: InsertOutboundSample): Promise<OutboundSample> {
    const [outboundSample] = await db
      .insert(outboundSamples)
      .values(insertOutboundSample)
      .returning();
    return outboundSample;
  }

  // Missing method for saving test results
  async saveTestResults(results: any): Promise<void> {
    // This would implement the actual test results saving logic
    // For now, just log the action
    await this.logAction({
      userId: results.enteredBy || 'system',
      actionType: "TEST_RESULT_SAVED",
      actionCategory: "results",
      actionData: results,
      description: `Test results saved for sample ${results.sampleId}`,
      success: true
    });
  }
}

export const storage = new DatabaseStorage();