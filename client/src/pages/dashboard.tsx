import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { Charts } from '@/components/dashboard/charts';
import { RecentSamples } from '@/components/dashboard/recent-samples';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  const { 
    data: recentSamples, 
    isLoading: samplesLoading, 
    error: samplesError 
  } = useQuery({
    queryKey: ['/api/dashboard/recent-samples'],
    queryFn: () => dashboardApi.getRecentSamples(10),
  });

  if (statsError || samplesError) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Dashboard Error
            </CardTitle>
            <CardDescription>
              Failed to load dashboard data: {(statsError as Error)?.message || (samplesError as Error)?.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Laboratory management system overview
        </p>
      </div>

      <QuickActions />

      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <KPICards stats={stats} />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          {statsLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ) : (
            <Charts stats={stats} />
          )}
        </div>

        <div className="lg:col-span-3">
          {samplesLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <RecentSamples samples={recentSamples || []} />
          )}
        </div>
      </div>
    </div>
  );
}