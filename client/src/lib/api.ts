
import { queryClient } from './queryClient';

// Auth API
export const authApi = {
  async login(credentials: { username: string; password: string }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  async register(userData: any) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  async validateUser(userId: string) {
    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Validation failed');
    }
    
    return response.json();
  },
};

// Dashboard API
export const dashboardApi = {
  async getStats() {
    const response = await fetch('/api/dashboard/stats');
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  async getRecentSamples(limit = 10) {
    const response = await fetch(`/api/dashboard/recent-samples?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch recent samples');
    return response.json();
  },
};

// Patients API
export const patientsApi = {
  async getPatients(params: { search?: string; page?: number; limit?: number } = {}) {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    
    const response = await fetch(`/api/patients?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
  },

  async getPatient(id: string) {
    const response = await fetch(`/api/patients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch patient');
    return response.json();
  },

  async createPatient(patientData: any) {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create patient');
    }
    
    return response.json();
  },
};

// Samples API
export const samplesApi = {
  async getSamples(params: { status?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    
    const response = await fetch(`/api/samples?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch samples');
    return response.json();
  },

  async getSample(id: string) {
    const response = await fetch(`/api/samples/${id}`);
    if (!response.ok) throw new Error('Failed to fetch sample');
    return response.json();
  },

  async createSample(sampleData: any) {
    const response = await fetch('/api/samples', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create sample');
    }
    
    return response.json();
  },

  async updateSample(id: string, updates: any) {
    const response = await fetch(`/api/samples/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update sample');
    }
    
    return response.json();
  },
};

// Results API
export const resultsApi = {
  async saveResults(resultData: any) {
    const response = await fetch('/api/results/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save results');
    }
    
    return response.json();
  },
};

// Quality Control API
export const qualityControlApi = {
  async createQC(qcData: any) {
    const response = await fetch('/api/quality-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(qcData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create QC entry');
    }
    
    return response.json();
  },
};

// Financial API
export const financialApi = {
  async createInvoice(invoiceData: any) {
    const response = await fetch('/api/financial/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create invoice');
    }
    
    return response.json();
  },

  async processPayment(paymentData: any) {
    const response = await fetch('/api/financial/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process payment');
    }
    
    return response.json();
  },
};

// Settings API
export const settingsApi = {
  async getLabSettings() {
    const response = await fetch('/api/settings/lab');
    if (!response.ok) throw new Error('Failed to fetch lab settings');
    return response.json();
  },

  async saveLabSettings(settingsData: any) {
    const response = await fetch('/api/settings/lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save lab settings');
    }
    
    return response.json();
  },

  async saveSystemSetting(settingData: any) {
    const response = await fetch('/api/settings/system', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save system setting');
    }
    
    return response.json();
  },
};

// Reports API
export const reportsApi = {
  async generateReport(reportData: any) {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate report');
    }
    
    return response.json();
  },

  async getReports(limit = 50) {
    const response = await fetch(`/api/reports?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },
};

// Worklists API
export const worklistsApi = {
  async getWorklists(limit = 50) {
    const response = await fetch(`/api/worklists?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch worklists');
    return response.json();
  },

  async createWorklist(worklistData: any) {
    const response = await fetch('/api/worklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(worklistData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create worklist');
    }
    
    return response.json();
  },
};

// Outbound API
export const outboundApi = {
  async getOutboundSamples(limit = 50) {
    const response = await fetch(`/api/outbound?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch outbound samples');
    return response.json();
  },

  async createOutboundSample(outboundData: any) {
    const response = await fetch('/api/outbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outboundData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create outbound sample');
    }
    
    return response.json();
  },
};

// Users API
export const usersApi = {
  async getUsers(params: { page?: number; limit?: number; role?: string; search?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.role) searchParams.set('role', params.role);
    if (params.search) searchParams.set('search', params.search);
    
    const response = await fetch(`/api/users?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async createUser(userData: any) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }
    
    return response.json();
  },
};

// Test Types API
export const testTypesApi = {
  async getTestTypes() {
    const response = await fetch('/api/test-types');
    if (!response.ok) throw new Error('Failed to fetch test types');
    return response.json();
  },
};

// Action Logs API
export const actionLogsApi = {
  async logAction(actionData: any) {
    const response = await fetch('/api/actions/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to log action');
    }
    
    return response.json();
  },

  async getActionLogs(limit = 100) {
    const response = await fetch(`/api/action-logs?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch action logs');
    return response.json();
  },
};
