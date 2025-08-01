import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TestTubeDiagonal, 
  CheckCircle, 
  Clock, 
  Users 
} from 'lucide-react';
import type { DashboardStats } from '@/types';

export function KPICards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      name: 'Samples Today',
      value: stats?.dailySamples || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: TestTubeDiagonal,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      name: 'Results Ready',
      value: stats?.resultsReady || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      name: 'Pending Tests',
      value: stats?.pendingTests || 0,
      change: '2.5 hrs',
      changeType: 'neutral' as const,
      icon: Clock,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      name: 'Active Users',
      value: stats?.activeUsers || 0,
      change: 'Online now',
      changeType: 'neutral' as const,
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        
        return (
          <Card key={kpi.name} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 ${kpi.iconBg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                        {kpi.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {kpi.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700">
                <div className="text-sm">
                  <span className={`font-medium ${
                    kpi.changeType === 'positive' 
                      ? 'text-green-600' 
                      : kpi.changeType === 'negative' 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {kpi.changeType === 'positive' ? 'from yesterday' : 
                     kpi.changeType === 'negative' ? 'below target' : 
                     kpi.name === 'Pending Tests' ? 'avg turnaround' : 
                     'across all modules'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
