import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  UserPlus, 
  ScanLine, 
  ClipboardList, 
  FileText,
  Activity,
  AlertTriangle 
} from 'lucide-react';

export function QuickActions() {
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

  const labStatus = [
    {
      label: 'Equipment Status',
      status: 'Online',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      indicator: 'bg-green-400',
    },
    {
      label: 'Quality Control',
      status: 'Passed',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      indicator: 'bg-green-400',
    },
    {
      label: 'Reagent Levels',
      status: 'Low',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      indicator: 'bg-yellow-400',
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
          <h4 className="text-sm font-medium text-gray-900 mb-3 dark:text-white">
            Lab Status
          </h4>
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
          <div 
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            onClick={() => {
              console.log('Low reagent alert clicked');
              if (confirm('Reagent levels are critically low. Would you like to:\n\n• Order more reagents automatically?\n• View detailed reagent inventory?\n• Set up automatic reorder alerts?')) {
                alert('Reagent Management\n\nAccessing inventory management where you can:\n• View current reagent levels\n• Place automatic orders\n• Set reorder thresholds\n• Track delivery status\n\nA purchase requisition has been generated for low reagents.');
              }
            }}
          >
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="ml-2 text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Reagent levels are low
              </span>
            </div>
            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              Consider restocking before end of day - Click to manage
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}