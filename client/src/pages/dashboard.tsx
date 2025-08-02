import { KPICards } from '@/components/dashboard/kpi-cards';
import { RecentSamples } from '@/components/dashboard/recent-samples';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { SampleVolumeChart, TestDistributionChart } from '@/components/dashboard/charts';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
              Laboratory Dashboard
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{currentDate}</span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Exporting dashboard report...');
                alert('Report export feature coming soon!');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Link href="/sampling">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Sample
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <KPICards />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Samples - spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RecentSamples />
        </div>
        
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SampleVolumeChart />
        <TestDistributionChart />
      </div>

      {/* Module Overview */}
      <div className="bg-white shadow rounded-lg dark:bg-gray-800">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Module Overview
            </h3>
            <Button variant="ghost" size="sm">
              View All Modules
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Reception', description: 'Patient registration and check-in', count: '34 patients', color: 'blue' },
              { name: 'Sampling', description: 'Sample collection and tracking', count: '127 samples', color: 'green' },
              { name: 'Results', description: 'Test results and validation', count: '43 pending', color: 'purple' },
              { name: 'QC', description: 'Quality control monitoring', count: 'All passed', color: 'orange' },
            ].map((module) => (
              <div key={module.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className={`h-8 w-8 bg-${module.color}-100 dark:bg-${module.color}-900/20 rounded-lg flex items-center justify-center mr-3`}>
                    <div className={`h-5 w-5 bg-${module.color}-600 rounded`} />
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {module.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 mb-2 dark:text-gray-400">
                  {module.description}
                </p>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {module.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
