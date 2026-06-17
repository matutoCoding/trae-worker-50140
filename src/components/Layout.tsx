import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Archive,
  ShieldCheck,
  Award,
  Handshake,
  Users,
  Gavel,
  History,
  Menu,
  X,
  Coins,
} from 'lucide-react';

const navItems = [
  { path: '/collection', label: '藏品入库', icon: Archive },
  { path: '/authentication', label: '真伪鉴定', icon: ShieldCheck },
  { path: '/grading', label: '品相评级', icon: Award },
  { path: '/trading', label: '交易撮合', icon: Handshake },
  { path: '/customers', label: '客户管理', icon: Users },
  { path: '/auction', label: '拍卖管理', icon: Gavel },
  { path: '/traceability', label: '溯源档案', icon: History },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen paper-bg flex">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-ink-800 text-white transition-all duration-300 flex flex-col relative`}
      >
        <div className="p-6 border-b border-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-vermilion-600 flex items-center justify-center flex-shrink-0">
              <Coins className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-serif text-lg font-bold text-white">
                  古泉雅集
                </h1>
                <p className="text-xs text-warm-gray-400">古玩鉴定交易系统</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors relative ${
                  isActive
                    ? 'bg-vermilion-600/20 text-vermilion-300 border-r-2 border-vermilion-500'
                    : 'text-warm-gray-300 hover:bg-ink-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-bronze-600 flex items-center justify-center text-sm font-medium">
                管
              </div>
              <div>
                <p className="text-sm font-medium">管理员</p>
                <p className="text-xs text-warm-gray-400">admin@guquan.com</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-full bg-bronze-600 flex items-center justify-center text-sm font-medium">
                管
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-ink-700 rounded-full flex items-center justify-center text-warm-gray-400 hover:text-white hover:bg-ink-600 transition-colors border border-ink-600"
        >
          {sidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-paper-300 flex items-center justify-between px-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink-800">
              {navItems.find((item) => item.path === location.pathname)?.label ||
                '古泉雅集'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-warm-gray-500">
              今日：{new Date().toLocaleDateString('zh-CN')}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
