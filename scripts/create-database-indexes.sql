-- Performance optimization indexes for Laboratory Information System
-- Run this to optimize database performance for unlimited records

-- Indexes for Patients table
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_first_name ON patients(first_name);
CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name);
CREATE INDEX IF NOT EXISTS idx_patients_name_search ON patients(first_name, last_name);

-- Indexes for Samples table  
CREATE INDEX IF NOT EXISTS idx_samples_created_at ON samples(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_samples_status ON samples(status);
CREATE INDEX IF NOT EXISTS idx_samples_patient_id ON samples(patient_id);
CREATE INDEX IF NOT EXISTS idx_samples_sample_id ON samples(sample_id);
CREATE INDEX IF NOT EXISTS idx_samples_status_created_at ON samples(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_samples_collection_date ON samples(collection_date);

-- Indexes for Test Results table
CREATE INDEX IF NOT EXISTS idx_test_results_sample_id ON test_results(sample_id);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);

-- Indexes for Test Requests table
CREATE INDEX IF NOT EXISTS idx_test_requests_sample_id ON test_requests(sample_id);
CREATE INDEX IF NOT EXISTS idx_test_requests_test_type_id ON test_requests(test_type_id);
CREATE INDEX IF NOT EXISTS idx_test_requests_created_at ON test_requests(created_at DESC);

-- Indexes for Users table
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Indexes for Action Logs table
CREATE INDEX IF NOT EXISTS idx_action_logs_user_id ON action_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_action_logs_created_at ON action_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_action_logs_action_type ON action_logs(action_type);

-- Indexes for Financial Records table
CREATE INDEX IF NOT EXISTS idx_financial_records_patient_id ON financial_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_created_at ON financial_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_records_transaction_date ON financial_records(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_records_payment_status ON financial_records(payment_status);

-- Indexes for Quality Controls table
CREATE INDEX IF NOT EXISTS idx_quality_controls_test_type_id ON quality_controls(test_type_id);
CREATE INDEX IF NOT EXISTS idx_quality_controls_performed_at ON quality_controls(performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quality_controls_performed_by ON quality_controls(performed_by);

-- Indexes for Worklists table
CREATE INDEX IF NOT EXISTS idx_worklists_created_at ON worklists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_worklists_assigned_to ON worklists(assigned_to);
CREATE INDEX IF NOT EXISTS idx_worklists_status ON worklists(status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_samples_patient_status ON samples(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_test_results_sample_status ON test_results(sample_id, status);
CREATE INDEX IF NOT EXISTS idx_patients_search_composite ON patients(first_name, last_name, patient_id);

-- Additional performance indexes for large datasets
CREATE INDEX IF NOT EXISTS idx_samples_collection_status ON samples(collection_date, status);
CREATE INDEX IF NOT EXISTS idx_action_logs_user_type ON action_logs(user_id, action_type);
CREATE INDEX IF NOT EXISTS idx_financial_records_date_status ON financial_records(transaction_date, payment_status);