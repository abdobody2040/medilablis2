import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { useWebSocket } from '@/hooks/use-websocket';
import { Sidebar } from './sidebar';
import { TopNavigation } from './top-navigation';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { darkMode, sidebarOpen } = useUIStore();
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && location !== '/login') {
      window.location.href = '/login';
    }
  }, [isAuthenticated, location]);

  if (!isAuthenticated && location !== '/login') {
    return null;
  }

  if (location === '/login') {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  return (
    <div className="h-full">
      <Sidebar />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      <div className={cn(
        "flex flex-col flex-1",
        "lg:pl-64" // Always push content on desktop
      )}>
        <TopNavigation />
        
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Connection status indicator */}
          <div className="fixed bottom-4 right-4 z-50">
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium",
              isConnected 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-400" : "bg-red-400"
              )} />
              {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}
