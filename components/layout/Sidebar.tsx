'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  BarChart3,
  CreditCard,
  Home,
  PanelLeft,
  PiggyBank,
  Settings,
  TrendingUp,
  Users,
  Link as LinkIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ collapsed, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Get user initials for the collapsed view
  const getInitials = () => {
    if (!session?.user?.name) return 'U';
    return session.user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Accounts', path: '/accounts', icon: LinkIcon },
    { name: 'Cards', path: '/cards', icon: CreditCard },
    { name: 'Investments', path: '/investments', icon: TrendingUp },
    { name: 'Savings', path: '/savings', icon: PiggyBank },
    { name: 'AI Assistant', path: '/ai-assistant', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'sidebar-fixed z-40 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16 collapsed' : 'w-64',
        'bg-sidebar border-r border-sidebar-border noise-bg'
      )}
    >
      <div className="flex flex-col h-full justify-between relative">
        <button
          onClick={toggleSidebar}
          className={cn(
            'text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-md p-1.5 transition-colors cursor-pointer z-50 sidebar-toggle sidebar-toggle-btn',
            collapsed ? 'absolute top-4 right-0' : 'absolute top-4 right-4'
          )}
        >
          <PanelLeft size={18} className={collapsed ? 'rotate-180' : ''} />
        </button>

        <div>
          <div
            className={cn(
              'flex items-center px-5 h-16',
              collapsed ? 'justify-center' : 'justify-start'
            )}
          >
            {!collapsed && (
              <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                <span className="bg-finance-accent text-white w-8 h-8 rounded-md flex items-center justify-center">
                  F
                </span>
                <span className="text-gradient">FinanceAI</span>
              </Link>
            )}
            {collapsed && (
              <Link href="/" className="text-xl font-bold text-white">
                <span className="bg-finance-accent text-white w-8 h-8 rounded-md flex items-center justify-center">
                  F
                </span>
              </Link>
            )}
          </div>

          <div className="mt-5 px-3">
            <nav className="space-y-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-md transition-colors cursor-pointer',
                    pathname === item.path
                      ? 'bg-gradient-to-r from-sidebar-primary to-sidebar-primary/70 text-white shadow-md'
                      : 'text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/30',
                    collapsed ? 'justify-center' : ''
                  )}
                >
                  <item.icon size={collapsed ? 20 : 18} className={collapsed ? '' : 'mr-3'} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-5">
          <div
            className={cn(
              'p-3 glass-panel rounded-lg noise-subtle relative z-10',
              collapsed ? 'text-center sidebar-user-avatar' : ''
            )}
          >
            {!collapsed ? (
              <>
                <p className="text-xs text-sidebar-foreground/70">Premium Member</p>
                <p className="font-medium mt-0.5">{session?.user?.name || 'User'}</p>
              </>
            ) : (
              <Avatar className="h-8 w-8 mx-auto">
                <AvatarFallback className="text-xs bg-sidebar-primary text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
