import type { NavigationItem } from '@/types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { name: 'Reception', href: '/reception', icon: 'user-plus' },
  { name: 'Sampling', href: '/sampling', icon: 'test-tube' },
  { name: 'Results', href: '/results', icon: 'clipboard-check' },
  { name: 'Worklists', href: '/worklists', icon: 'list-checks' },
  { name: 'Quality Control', href: '/quality-control', icon: 'shield-check' },
  { name: 'Outbound Samples', href: '/outbound', icon: 'send' },
  { name: 'Reports', href: '/reports', icon: 'bar-chart-3' },
  { name: 'Financial', href: '/financial', icon: 'dollar-sign' },
];

export const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'User Management', href: '/users', icon: 'users' },
  { name: 'Pricing', href: '/pricing', icon: 'credit-card' },
  { name: 'Setup', href: '/setup', icon: 'settings' },
];

export const SAMPLE_STATUSES = [
  { value: 'received', label: 'Received', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
];

export const TEST_PRIORITIES = [
  { value: 'routine', label: 'Routine', color: 'gray' },
  { value: 'urgent', label: 'Urgent', color: 'yellow' },
  { value: 'stat', label: 'STAT', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
];

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'lab_manager', label: 'Lab Manager' },
  { value: 'technician', label: 'Technician' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'doctor', label: 'Doctor' },
];
