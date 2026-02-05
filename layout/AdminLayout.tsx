import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, FolderKanban, Award, FileText, Mail, LogOut, ArrowLeft, Briefcase } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear tokens here
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hero & About', path: '/admin/about', icon: User },
    { name: 'Experience & Stats', path: '/admin/experience', icon: Briefcase },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Contact Info', path: '/admin/contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">D</span>
          </div>
          <span className="font-bold text-lg">Sub UI</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 border-b border-slate-800 z-20 p-4 flex justify-between items-center">
        <span className="font-bold text-lg">Sub UI</span>
        <button onClick={handleLogout}><LogOut size={20} /></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;