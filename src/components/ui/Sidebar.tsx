'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Settings, Users, PenTool, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const mecanicoLinks = [
    { name: 'Dashboard', href: '/mecanico', icon: LayoutDashboard },
    { name: 'Calendario', href: '/mecanico/calendario', icon: CalendarDays },
    { name: 'Configuración', href: '/mecanico/configuracion', icon: Settings },
  ];

  const clienteLinks = [
    { name: 'Mis Citas', href: '/cliente', icon: CalendarDays },
    { name: 'Agendar Cita', href: '/cliente/agendar', icon: PenTool },
  ];

  const links = user?.rol === 'mecanico' ? mecanicoLinks : clienteLinks;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen hidden md:flex flex-col shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h2 className="text-xl font-bold tracking-tight">Panel Principal</h2>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{user?.nombre}</span>
            <span className="text-xs text-gray-400 truncate">{user?.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
