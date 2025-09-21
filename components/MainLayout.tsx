
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext, useDataContext } from '../context/AppContext';
import { MENU_ITEMS, LogoutIcon, WifiIcon, WifiOffIcon, MenuIcon } from '../constants';

const MainLayout: React.FC = () => {
  const { logout, isOnline, toggleOnlineStatus } = useAppContext();
  const { pendingSyncCount, submissionsToday } = useDataContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <aside 
        className={`w-64 flex-shrink-0 bg-gradient-to-b from-gray-900 to-black border-r border-white/10 flex flex-col fixed inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-center border-b border-white/10">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SurveySync Pro</h1>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-300 group ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-300 shadow-lg'
                        : 'hover:bg-white/10'
                    }`
                  }
                >
                  <span className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="ml-4 font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors duration-200"
          >
            <LogoutIcon />
            <span className="ml-4 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Header */}
        <header className="h-20 bg-gray-900/50 backdrop-blur-lg border-b border-white/10 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-4">
             <button 
                className="text-gray-300 hover:text-white md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <MenuIcon />
            </button>
             {/* Status Indicator */}
            <div 
              onClick={toggleOnlineStatus} 
              className="hidden sm:flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/10"
              title="Click to toggle status (for demo)"
            >
              {isOnline ? (
                <WifiIcon className="text-green-400" />
              ) : (
                <WifiOffIcon className="text-red-400" />
              )}
              <span className={`font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center bg-white/5 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-400">Pending</p>
              <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{pendingSyncCount}</p>
            </div>
            <div className="text-center bg-white/5 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-400">Today</p>
              <p className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">{submissionsToday}</p>
            </div>
          </div>
        </header>
        
        {/* Offline Bar */}
        {!isOnline && (
            <div className="bg-red-500/80 text-white text-center py-2 text-sm font-semibold animate-pulse">
                You are currently offline. Submissions will be synced when online.
            </div>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-black/20">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
