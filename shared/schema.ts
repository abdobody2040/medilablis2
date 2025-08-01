import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, pgEnum, json, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "technician", "receptionist", "doctor", "lab_manager"]);
export const sampleStatusEnum = pgEnum("sample_status", ["received", "in_progress", "completed", "rejected", "cancelled"]);
export const testStatusEnum = pgEnum("test_status", ["pending", "in_progress", "completed", "failed", "cancelled"]);
export const priorityEnum = pgEnum("priority", ["routine", "urgent", "stat", "critical"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other", "unknown"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: userRoleEnum("role").notNull().default("technician"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Patients table
export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id", { length: 50 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  insuranceNumber: varchar("insurance_number", { length: 50 }),
  medicalHistory: json("medical_history"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Test types table
export const testTypes = pgTable("test_types", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  sampleType: varchar("sample_type", { length: 50 }).notNull(),
  methodology: varchar("methodology", { length: 100 }),
  turnaroundTime: integer("turnaround_time").notNull(), // in hours
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  referenceRanges: json("reference_ranges"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Samples table
export const samples = pgTable("samples", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sampleId: varchar("sample_id", { length: 50 }).notNull().unique(),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  collectedBy: uuid("collected_by").references(() => users.id).notNull(),
  sampleType: varchar("sample_type", { length: 50 }).notNull(),
  containerType: varchar("container_type", { length: 50 }),
  volume: decimal("volume", { precision: 10, scale: 2 }),
  unit: varchar("unit", { length: 10 }),
  collectionDateTime: timestamp("collection_date_time").notNull(),
  receivedDateTime: timestamp("received_date_time").defaultNow().notNull(),
  status: sampleStatusEnum("status").notNull().default("received"),
  priority: priorityEnum("priority").notNull().default("routine"),
  comments: text("comments"),
  storageLocation: varchar("storage_location", { length: 100 }),
  barcode: varchar("barcode", { length: 100 }).unique(),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Test requests table
export const testRequests = pgTable("test_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sampleId: uuid("sample_id").references(() => samples.id).notNull(),
  testTypeId: uuid("test_type_id").references(() => testTypes.id).notNull(),
  requestedBy: uuid("requested_by").references(() => users.id).notNull(),
  status: testStatusEnum("status").notNull().default("pending"),
  priority: priorityEnum("priority").notNull().default("routine"),
  requestDateTime: timestamp("request_date_time").defaultNow().notNull(),
  startDateTime: timestamp("start_date_time"),
  completedDateTime: timestamp("completed_date_time"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Test results table
export const testResults = pgTable("test_results", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  testRequestId: uuid("test_request_id").references(() => testRequests.id).notNull(),
  parameterId: varchar("parameter_id", { length: 50 }).notNull(),
  parameterName: varchar("parameter_name", { length: 200 }).notNull(),
  value: text("value").notNull(),
  unit: varchar("unit", { length: 20 }),
  referenceRange: varchar("reference_range", { length: 100 }),
  flag: varchar("flag", { length: 10 }), // H, L, N, A (High, Low, Normal, Abnormal)
  enteredBy: uuid("entered_by").references(() => users.id).notNull(),
  verifiedBy: uuid("verified_by").references(() => users.id),
  enteredAt: timestamp("entered_at").defaultNow().notNull(),
  verifiedAt: timestamp("verified_at"),
  comments: text("comments"),
});

// Quality control table
export const qualityControls = pgTable("quality_controls", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  testTypeId: uuid("test_type_id").references(() => testTypes.id).notNull(),
  qcLevel: varchar("qc_level", { length: 20 }).notNull(),
  lotNumber: varchar("lot_number", { length: 50 }).notNull(),
  expectedValue: decimal("expected_value", { precision: 15, scale: 5 }).notNull(),
  tolerance: decimal("tolerance", { precision: 10, scale: 5 }).notNull(),
  runDateTime: timestamp("run_date_time").defaultNow().notNull(),
  actualValue: decimal("actual_value", { precision: 15, scale: 5 }).notNull(),
  passed: boolean("passed").notNull(),
  runBy: uuid("run_by").references(() => users.id).notNull(),
  comments: text("comments"),
});

// Outbound samples table
export const outboundSamples = pgTable("outbound_samples", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  sampleId: uuid("sample_id").references(() => samples.id).notNull(),
  referenceLabId: uuid("reference_lab_id").notNull(),
  referenceLabName: varchar("reference_lab_name", { length: 200 }).notNull(),
  testRequested: varchar("test_requested", { length: 200 }).notNull(),
  sentBy: uuid("sent_by").references(() => users.id).notNull(),
  sentDateTime: timestamp("sent_date_time").defaultNow().notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  expectedReturnDate: timestamp("expected_return_date"),
  status: varchar("status", { length: 50 }).notNull().default("sent"),
  notes: text("notes"),
});

// Worklists table
export const worklists = pgTable("worklists", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  criteria: json("criteria").notNull(),
  assignedTo: uuid("assigned_to").references(() => users.id),
  createdBy: uuid("created_by").references(() => users.id).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Financial records table
export const financialRecords = pgTable("financial_records", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  sampleId: uuid("sample_id").references(() => samples.id),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("pending"),
  invoiceNumber: varchar("invoice_number", { length: 100 }),
  description: text("description"),
  processedBy: uuid("processed_by").references(() => users.id).notNull(),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  samplesCollected: many(samples, { relationName: "collectedBy" }),
  testRequestsRequested: many(testRequests, { relationName: "requestedBy" }),
  testRequestsAssigned: many(testRequests, { relationName: "assignedTo" }),
  testResultsEntered: many(testResults, { relationName: "enteredBy" }),
  testResultsVerified: many(testResults, { relationName: "verifiedBy" }),
  qualityControlsRun: many(qualityControls),
  outboundSamplesSent: many(outboundSamples),
  worklistsCreated: many(worklists, { relationName: "createdBy" }),
  worklistsAssigned: many(worklists, { relationName: "assignedTo" }),
  financialRecordsProcessed: many(financialRecords),
}));

export const patientsRelations = relations(patients, ({ many }) => ({
  samples: many(samples),
  financialRecords: many(financialRecords),
}));

export const samplesRelations = relations(samples, ({ one, many }) => ({
  patient: one(patients, {
    fields: [samples.patientId],
    references: [patients.id],
  }),
  collectedBy: one(users, {
    fields: [samples.collectedBy],
    references: [users.id],
  }),
  testRequests: many(testRequests),
  outboundSamples: many(outboundSamples),
  financialRecords: many(financialRecords),
}));

export const testTypesRelations = relations(testTypes, ({ many }) => ({
  testRequests: many(testRequests),
  qualityControls: many(qualityControls),
}));

export const testRequestsRelations = relations(testRequests, ({ one, many }) => ({
  sample: one(samples, {
    fields: [testRequests.sampleId],
    references: [samples.id],
  }),
  testType: one(testTypes, {
    fields: [testRequests.testTypeId],
    references: [testTypes.id],
  }),
  requestedBy: one(users, {
    fields: [testRequests.requestedBy],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [testRequests.assignedTo],
    references: [users.id],
  }),
  testResults: many(testResults),
}));

export const testResultsRelations = relations(testResults, ({ one }) => ({
  testRequest: one(testRequests, {
    fields: [testResults.testRequestId],
    references: [testRequests.id],
  }),
  enteredBy: one(users, {
    fields: [testResults.enteredBy],
    references: [users.id],
  }),
  verifiedBy: one(users, {
    fields: [testResults.verifiedBy],
    references: [users.id],
  }),
}));

export const qualityControlsRelations = relations(qualityControls, ({ one }) => ({
  testType: one(testTypes, {
    fields: [qualityControls.testTypeId],
    references: [testTypes.id],
  }),
  runBy: one(users, {
    fields: [qualityControls.runBy],
    references: [users.id],
  }),
}));

export const outboundSamplesRelations = relations(outboundSamples, ({ one }) => ({
  sample: one(samples, {
    fields: [outboundSamples.sampleId],
    references: [samples.id],
  }),
  sentBy: one(users, {
    fields: [outboundSamples.sentBy],
    references: [users.id],
  }),
}));

export const worklistsRelations = relations(worklists, ({ one }) => ({
  createdBy: one(users, {
    fields: [worklists.createdBy],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [worklists.assignedTo],
    references: [users.id],
  }),
}));

export const financialRecordsRelations = relations(financialRecords, ({ one }) => ({
  patient: one(patients, {
    fields: [financialRecords.patientId],
    references: [patients.id],
  }),
  sample: one(samples, {
    fields: [financialRecords.sampleId],
    references: [samples.id],
  }),
  processedBy: one(users, {
    fields: [financialRecords.processedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSampleSchema = createInsertSchema(samples).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestRequestSchema = createInsertSchema(testRequests).omit({
  id: true,
  createdAt: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  enteredAt: true,
});

export const insertQualityControlSchema = createInsertSchema(qualityControls).omit({
  id: true,
});

export const insertOutboundSampleSchema = createInsertSchema(outboundSamples).omit({
  id: true,
});

export const insertWorklistSchema = createInsertSchema(worklists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({
  id: true,
});

export const insertTestTypeSchema = createInsertSchema(testTypes).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Sample = typeof samples.$inferSelect;
export type InsertSample = z.infer<typeof insertSampleSchema>;
export type TestRequest = typeof testRequests.$inferSelect;
export type InsertTestRequest = z.infer<typeof insertTestRequestSchema>;
export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type QualityControl = typeof qualityControls.$inferSelect;
export type InsertQualityControl = z.infer<typeof insertQualityControlSchema>;
export type OutboundSample = typeof outboundSamples.$inferSelect;
export type InsertOutboundSample = z.infer<typeof insertOutboundSampleSchema>;
export type Worklist = typeof worklists.$inferSelect;
export type InsertWorklist = z.infer<typeof insertWorklistSchema>;
export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;
export type TestType = typeof testTypes.$inferSelect;
export type InsertTestType = z.infer<typeof insertTestTypeSchema>;
