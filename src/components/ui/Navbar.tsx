'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">
          Taller<span className="text-blue-600">Calendar</span>
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 leading-tight">{user?.nombre || 'Usuario'}</span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{user?.rol || ''}</span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          title="Cerrar sesión"
        >
          <span className="text-sm font-medium hidden sm:block">Salir</span>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
