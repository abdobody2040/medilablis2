import { apiRequest } from "./queryClient";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return response.json();
  },

  register: async (data: RegisterData) => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    return response.json();
  },

  logout: async () => {
    // In a real app, this would invalidate the session/token
    localStorage.removeItem("user");
    window.location.href = "/login";
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  RECEPTION: '/reception',
  SAMPLING: '/sampling',
  RESULTS: '/results',
  QC: '/quality-control',
  WORKLISTS: '/worklists',
  OUTBOUND: '/outbound',
  REPORTS: '/reports',
  FINANCIAL: '/financial',
  SETUP: '/setup',
  USER_MANAGEMENT: '/user-management',
} as const;

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canAccessAll: true,
    canManageUsers: true,
    canAccessFinancial: true,
    canAccessSetup: true,
    canAccessReports: true,
    canAccessQC: true,
    canAccessResults: true,
    canAccessSampling: true,
    canAccessReception: true,
    canAccessWorklists: true,
    canAccessOutbound: true,
  },
  lab_manager: {
    canAccessAll: false,
    canManageUsers: false,
    canAccessFinancial: true,
    canAccessSetup: false,
    canAccessReports: true,
    canAccessQC: true,
    canAccessResults: true,
    canAccessSampling: true,
    canAccessReception: true,
    canAccessWorklists: true,
    canAccessOutbound: true,
  },
  technician: {
    canAccessAll: false,
    canManageUsers: false,
    canAccessFinancial: false,
    canAccessSetup: false,
    canAccessReports: false,
    canAccessQC: true,
    canAccessResults: true,
    canAccessSampling: true,
    canAccessReception: false,
    canAccessWorklists: true,
    canAccessOutbound: true,
  },
  doctor: {
    canAccessAll: false,
    canManageUsers: false,
    canAccessFinancial: false,
    canAccessSetup: false,
    canAccessReports: true,
    canAccessQC: false,
    canAccessResults: true,
    canAccessSampling: false,
    canAccessReception: false,
    canAccessWorklists: false,
    canAccessOutbound: false,
  },
  receptionist: {
    canAccessAll: false,
    canManageUsers: false,
    canAccessFinancial: false,
    canAccessSetup: false,
    canAccessReports: false,
    canAccessQC: false,
    canAccessResults: false,
    canAccessSampling: true,
    canAccessReception: true,
    canAccessWorklists: false,
    canAccessOutbound: false,
  },
} as const;

export const hasPermission = (userRole: string, permission: keyof typeof ROLE_PERMISSIONS['admin']): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  if (!rolePermissions) return false;
  return rolePermissions[permission] || false;
};

export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissionMap: Record<string, keyof typeof ROLE_PERMISSIONS['admin']> = {
    '/dashboard': 'canAccessAll', // Dashboard accessible to all authenticated users
    '/reception': 'canAccessReception',
    '/sampling': 'canAccessSampling',
    '/results': 'canAccessResults',
    '/quality-control': 'canAccessQC',
    '/worklists': 'canAccessWorklists',
    '/outbound': 'canAccessOutbound',
    '/reports': 'canAccessReports',
    '/financial': 'canAccessFinancial',
    '/setup': 'canAccessSetup',
    '/user-management': 'canManageUsers',
  };

  const permission = routePermissionMap[route];
  if (!permission) return true; // Allow access to unspecified routes

  // Special case: dashboard is accessible to all authenticated users
  if (route === '/dashboard') return true;

  return hasPermission(userRole, permission);
};