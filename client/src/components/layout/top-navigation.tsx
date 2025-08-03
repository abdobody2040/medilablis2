import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  Moon, 
  Sun,
  LogOut 
} from 'lucide-react';

export function TopNavigation() {
  const { user } = useAuthStore();
  const { darkMode, toggleSidebar, toggleDarkMode, notifications, removeNotification, addNotification } = useUIStore();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}"\n\nSearch functionality will be implemented to find patients, samples, and results.`);
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-700">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 lg:gap-x-6">
        <form 
          className="relative flex flex-1 max-w-md" 
          role="search"
          onSubmit={handleSearch}
        >
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
          <Input
            type="search"
            placeholder="Search patients, samples, results..."
            className="pl-10 border-0 bg-transparent focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Dark mode toggle */}
        <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
          {darkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative">{notifications.length > 9 ? '9+' : notifications.length}</span>
                </span>
              )}
              <span className="sr-only">View notifications</span>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 text-sm font-semibold border-b">
              Notifications ({notifications.length})
            </div>
            
            {notifications.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                No new notifications
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 border-b last:border-b-0">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'error' ? 'bg-red-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`} />
                          <span className="font-medium text-sm">{notification.title}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuItem className="p-3 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      notifications.forEach(n => removeNotification(n.id));
                    }}
                  >
                    Clear All
                  </Button>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200">
              <div className="font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
