import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { NAVIGATION_ITEMS, ADMIN_NAVIGATION_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { 
  Microscope, 
  LayoutDashboard, 
  UserPlus, 
  TestTube, 
  ClipboardCheck,
  ListChecks,
  ShieldCheck,
  Send,
  BarChart3,
  DollarSign,
  Users,
  CreditCard,
  Settings
} from 'lucide-react';

const iconMap = {
  'layout-dashboard': LayoutDashboard,
  'user-plus': UserPlus,
  'test-tube': TestTube,
  'clipboard-check': ClipboardCheck,
  'list-checks': ListChecks,
  'shield-check': ShieldCheck,
  'send': Send,
  'bar-chart-3': BarChart3,
  'dollar-sign': DollarSign,
  'users': Users,
  'credit-card': CreditCard,
  'settings': Settings,
};

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const isAdmin = user?.role === 'admin' || user?.role === 'lab_manager';

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location === '/' || location === '/dashboard';
    }
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-white lg:border-r lg:border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Microscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                MedLab LIS
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    const active = isActive(item.href);
                    
                    return (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <a className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            active
                              ? 'bg-primary/10 text-primary dark:bg-primary/20'
                              : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                          )}>
                            {Icon && <Icon className="h-5 w-5 shrink-0" />}
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              {isAdmin && (
                <li className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <ul role="list" className="-mx-2 space-y-1">
                    {ADMIN_NAVIGATION_ITEMS.map((item) => {
                      const Icon = iconMap[item.icon as keyof typeof iconMap];
                      const active = isActive(item.href);
                      
                      return (
                        <li key={item.name}>
                          <Link 
                            href={item.href}
                            className={cn(
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                              active
                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                            )}
                          >
                            {Icon && <Icon className="h-5 w-5 shrink-0" />}
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Microscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                MedLab LIS
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    const active = isActive(item.href);
                    
                    return (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            active
                              ? 'bg-primary/10 text-primary dark:bg-primary/20'
                              : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {Icon && <Icon className="h-5 w-5 shrink-0" />}
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              {isAdmin && (
                <li className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <ul role="list" className="-mx-2 space-y-1">
                    {ADMIN_NAVIGATION_ITEMS.map((item) => {
                      const Icon = iconMap[item.icon as keyof typeof iconMap];
                      const active = isActive(item.href);
                      
                      return (
                        <li key={item.name}>
                          <Link 
                            href={item.href}
                            className={cn(
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                              active
                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {Icon && <Icon className="h-5 w-5 shrink-0" />}
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
