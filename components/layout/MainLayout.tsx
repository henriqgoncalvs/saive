import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    // Add Satoshi font link to head
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.cdnfonts.com/css/satoshi';
    document.head.appendChild(link);

    return () => {
      // Clean up
      document.head.removeChild(link);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      className={cn(
        'flex min-h-screen bg-background font-sans',
        isLoaded ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-500'
      )}
    >
      <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out main-content',
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="py-6 px-6 md:px-8">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;
