import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Campanhas', href: '/campaigns', icon: '🏰' },
    { name: 'Personagens', href: '/characters', icon: '🎭' },
    { name: 'Perfil', href: '/profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 shadow-xl">
            <SidebarContent navigation={navigation} currentPath={location.pathname} user={user} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <SidebarContent navigation={navigation} currentPath={location.pathname} user={user} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <button
                type="button"
                className="lg:hidden text-gray-300 hover:text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Abrir sidebar</span>
                ☰
              </button>
              
              <h1 className="text-xl font-bold text-white">
                CONCLAVE
              </h1>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Olá, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  navigation: Array<{ name: string; href: string; icon: string }>;
  currentPath: string;
  user: any;
  onLogout: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ navigation, currentPath, user, onLogout }) => {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center px-4 bg-gray-900">
        <h1 className="text-lg font-bold text-white">⚔️ RPG Forja</h1>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="flex-shrink-0 border-t border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
          >
            🚪 Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Layout;