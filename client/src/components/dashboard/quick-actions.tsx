import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { 
  UserPlus, 
  ScanLine, 
  ClipboardList, 
  FileText,
  Activity,
  AlertTriangle,
  Settings,
  RefreshCw
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function QuickActions() {
  const { user } = useAuth();
  const [labStatusRefreshing, setLabStatusRefreshing] = useState(false);
  const [equipmentStatus, setEquipmentStatus] = useState('Online');
  const [qcStatus, setQcStatus] = useState('Passed');
  const [reagentStatus, setReagentStatus] = useState('Low');

  const handleRefreshStatus = async () => {
    setLabStatusRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Randomly update statuses for demo
      const statuses = ['Online', 'Offline', 'Maintenance'];
      const qcStatuses = ['Passed', 'Failed', 'Pending'];
      const reagentStatuses = ['Normal', 'Low', 'Critical'];
      
      setEquipmentStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      setQcStatus(qcStatuses[Math.floor(Math.random() * qcStatuses.length)]);
      setReagentStatus(reagentStatuses[Math.floor(Math.random() * reagentStatuses.length)]);
    } finally {
      setLabStatusRefreshing(false);
    }
  };

  const handleReagentOrder = () => {
    // Simulate reagent ordering
    alert('Reagent Order Initiated\n\nThe following reagents have been ordered:\n• CBC Reagent Kit (x5)\n• Chemistry Panel Reagents (x3)\n• Quality Control Solutions (x2)\n\nEstimated delivery: 2-3 business days\nOrder confirmation will be sent to your email.');
  };
  const actions = [
    {
      title: 'Register Patient',
      description: 'Add new patient to system',
      icon: UserPlus,
      href: '/reception',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Scan Barcode',
      description: 'Quick sample lookup',
      icon: ScanLine,
      href: '/sampling',
      color: 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700',
      iconColor: 'text-green-600',
    },
    {
      title: 'View Worklist',
      description: 'Check pending tasks',
      icon: ClipboardList,
      href: '/worklists',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-700',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Generate Report',
      description: 'Create lab summary',
      icon: FileText,
      href: '/reports',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-700',
      iconColor: 'text-purple-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'passed':
      case 'normal':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          indicator: 'bg-green-400',
        };
      case 'low':
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          indicator: 'bg-yellow-400',
        };
      case 'offline':
      case 'failed':
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          indicator: 'bg-red-400',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          indicator: 'bg-gray-400',
        };
    }
  };

  const labStatus = [
    {
      label: 'Equipment Status',
      status: equipmentStatus,
      ...getStatusColor(equipmentStatus),
    },
    {
      label: 'Quality Control',
      status: qcStatus,
      ...getStatusColor(qcStatus),
    },
    {
      label: 'Reagent Levels',
      status: reagentStatus,
      ...getStatusColor(reagentStatus),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.title} href={action.href}>
              <Button
                variant="ghost"
                className={`w-full ${action.color} border rounded-lg p-4 h-auto justify-start transition-colors`}
                onClick={(e) => {
                  console.log(`Navigating to ${action.title}`);
                  
                  // Add role-based access control
                  if (!user) {
                    alert('Please log in to access this feature.');
                    return;
                  }
                  
                  // Simulate role checking
                  const userRoles = user.roles || [];
                  const requiredRoles = {
                    'Register Patient': ['reception', 'admin'],
                    'Scan Barcode': ['sampling', 'laboratory', 'admin'],
                    'View Worklist': ['laboratory', 'quality_control', 'admin'],
                    'Generate Report': ['laboratory', 'admin'],
                  };
                  
                  const required = requiredRoles[action.title as keyof typeof requiredRoles];
                  if (required && !required.some(role => userRoles.includes(role))) {
                    alert(`Access denied. This feature requires one of the following roles: ${required.join(', ')}`);
                    return;
                  }
                }}
              >
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0">
                    <Icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}

        {/* Lab Status Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Lab Status
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshStatus}
              disabled={labStatusRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${labStatusRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="space-y-2">
            {labStatus.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                  <div className={`w-1.5 h-1.5 ${item.indicator} rounded-full mr-1`} />
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Alert for low reagents */}
          {reagentStatus === 'Low' || reagentStatus === 'Critical' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className={`mt-4 p-3 rounded-lg cursor-pointer transition-colors ${
                  reagentStatus === 'Critical' 
                    ? 'bg-red-50 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-700 dark:hover:bg-red-900/30'
                    : 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-700 dark:hover:bg-yellow-900/30'
                }`}>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-4 w-4 ${
                      reagentStatus === 'Critical' 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`} />
                    <span className={`ml-2 text-sm font-medium ${
                      reagentStatus === 'Critical'
                        ? 'text-red-800 dark:text-red-400'
                        : 'text-yellow-800 dark:text-yellow-400'
                    }`}>
                      Reagent levels are {reagentStatus.toLowerCase()}
                    </span>
                  </div>
                  <p className={`mt-1 text-xs ${
                    reagentStatus === 'Critical'
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {reagentStatus === 'Critical' 
                      ? 'Immediate action required - Click to order' 
                      : 'Consider restocking before end of day - Click to manage'
                    }
                  </p>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reagent Management</AlertDialogTitle>
                  <AlertDialogDescription>
                    Reagent levels are {reagentStatus.toLowerCase()}. Would you like to take action?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2 text-sm">
                  <p>Available actions:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Order reagents automatically</li>
                    <li>View detailed inventory</li>
                    <li>Set up reorder alerts</li>
                    <li>Contact suppliers</li>
                  </ul>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReagentOrder}>
                    Order Now
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}