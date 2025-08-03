import { queryClient } from './queryClient';

// Generic API request function
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

// Action logging function - logs all button actions to database
export async function logAction(
  actionType: string,
  actionCategory: string,
  actionData: any,
  description: string,
  userId: string = 'current-user' // In real app, get from auth context
) {
  try {
    await apiRequest('/api/actions/log', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        actionType,
        actionCategory,
        actionData,
        description,
        success: true,
      }),
    });
    console.log(`Action logged: ${actionType}`, actionData);
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}

// Quality Control API
export const qualityControlApi = {
  async submit(qcData: any) {
    const result = await apiRequest('/api/quality-control', {
      method: 'POST',
      body: JSON.stringify(qcData),
    });
    
    // Invalidate QC queries
    queryClient.invalidateQueries({ queryKey: ['quality-controls'] });
    return result;
  }
};

// Financial API
export const financialApi = {
  async createInvoice(invoiceData: any) {
    const result = await apiRequest('/api/financial/invoice', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
    
    // Invalidate financial queries
    queryClient.invalidateQueries({ queryKey: ['financial-records'] });
    return result;
  },

  async processPayment(invoiceNumber: string, status: string, userId?: string) {
    const result = await apiRequest('/api/financial/payment', {
      method: 'POST',
      body: JSON.stringify({ invoiceNumber, status, userId }),
    });
    
    // Invalidate financial queries
    queryClient.invalidateQueries({ queryKey: ['financial-records'] });
    return result;
  }
};

// Settings API
export const settingsApi = {
  async getLabSettings() {
    return apiRequest('/api/settings/lab');
  },

  async saveLabSettings(settings: any) {
    const result = await apiRequest('/api/settings/lab', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
    
    // Invalidate settings queries
    queryClient.invalidateQueries({ queryKey: ['lab-settings'] });
    return result;
  },

  async saveSystemSetting(setting: any) {
    const result = await apiRequest('/api/settings/system', {
      method: 'POST',
      body: JSON.stringify(setting),
    });
    
    // Invalidate settings queries
    queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    return result;
  }
};

// Reports API
export const reportsApi = {
  async generate(reportData: any) {
    const result = await apiRequest('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
    
    // Invalidate reports queries
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    return result;
  },

  async getReports(limit?: number) {
    const url = limit ? `/api/reports?limit=${limit}` : '/api/reports';
    return apiRequest(url);
  }
};

// User Management API
export const userApi = {
  async createUser(userData: any) {
    const result = await apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Invalidate users queries
    queryClient.invalidateQueries({ queryKey: ['users'] });
    return result;
  }
};

// Action logs API
export const actionLogsApi = {
  async getLogs(limit?: number) {
    const url = limit ? `/api/action-logs?limit=${limit}` : '/api/action-logs';
    return apiRequest(url);
  }
};

// Export settingsApi for setup page
export { settingsApi };