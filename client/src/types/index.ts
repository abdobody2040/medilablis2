export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'technician' | 'receptionist' | 'doctor' | 'lab_manager';
  isActive: boolean;
  lastLogin?: Date;
}

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'unknown';
  phoneNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  insuranceNumber?: string;
}

export interface Sample {
  id: string;
  sampleId: string;
  patientId: string;
  sampleType: string;
  status: 'received' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat' | 'critical';
  collectionDateTime: Date;
  receivedDateTime: Date;
  patient?: Patient;
}

export interface DashboardStats {
  dailySamples: number;
  resultsReady: number;
  pendingTests: number;
  activeUsers: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  current?: boolean;
}

export interface QuickAction {
  name: string;
  description: string;
  icon: string;
  action: () => void;
  color: string;
}
