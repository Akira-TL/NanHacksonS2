import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ThermometerSun,
  Zap,
  Box,
  AlertTriangle,
  Users,
  Settings,
  BookOpen,
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function Sidebar() {
  const { t } = useAppContext();

  const navItems = [
    { name: t('Project Overview'), path: '/', icon: LayoutDashboard },
    { name: t('Thermal Stats'), path: '/temperature', icon: ThermometerSun },
    { name: t('Energy Matrix'), path: '/energy', icon: Zap },
    { name: t('Thermal Control'), path: '/heat', icon: Box },
    { name: t('Alert Center'), path: '/alerts', icon: AlertTriangle },
  ];

  const systemItems = [
    { name: t('User Management'), path: '/users', icon: Users },
    { name: t('System Settings'), path: '/settings', icon: Settings },
    { name: t('Resource Library'), path: '/library', icon: BookOpen },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 bg-[#1E1E1E] border-r border-[#2D2D2D] shadow-lg shadow-black/50">
      <div className="px-6 py-4 border-b border-[#2D2D2D]">
        <h2 className="text-[#cfbcff] font-black text-sm tracking-tighter">HEATSYS</h2>
        <p className="text-[10px] text-gray-500 uppercase font-medium">Node 04 - Active</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">{t('Workspace')}</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => {
              const Icon = item.icon;
              return `flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-[#2D2D2D] hover:text-gray-200 transition-all duration-150 rounded font-['Inter'] text-xs font-medium uppercase group ${
                isActive
                  ? "bg-[#2D2D2D] text-[#cfbcff] border-l-4 border-[#cfbcff] rounded-r"
                  : ""
              }`;
            }}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2 mt-8">{t('System')}</div>
        {systemItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => {
              const Icon = item.icon;
              return `flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-[#2D2D2D] hover:text-gray-200 transition-all duration-150 rounded font-['Inter'] text-xs font-medium uppercase group ${
                isActive
                  ? "bg-[#2D2D2D] text-[#cfbcff] border-l-4 border-[#cfbcff] rounded-r"
                  : ""
              }`;
            }}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-[#2D2D2D]">
        <button className="w-full py-3 bg-[#93000A] text-[#FFB4AB] rounded font-bold text-[10px] uppercase tracking-widest border border-[#F44336] hover:bg-[#F44336] hover:text-white transition-colors flex items-center justify-center gap-2">
          <span className="text-sm">⚠</span>
          {t('Emergency Stop')}
        </button>
      </div>
    </aside>
  );
}
