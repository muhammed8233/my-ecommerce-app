// src/layouts/AdminLayout.tsx
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 text-xl font-bold border-b border-slate-800">
          Admin Panel
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {/* Using NavLink allows us to style the "Active" state easily */}
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `block p-3 rounded-lg transition ${isActive ? 'bg-indigo-600' : 'hover:bg-slate-800 text-gray-400'}`
            }
          >
            Dashboard Overview
          </NavLink>
          
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => 
              `block p-3 rounded-lg transition ${isActive ? 'bg-indigo-600' : 'hover:bg-slate-800 text-gray-400'}`
            }
          >
            Product Inventory
          </NavLink>

          <NavLink 
            to="/admin/logs" 
            className={({ isActive }) => 
              `block p-3 rounded-lg transition ${isActive ? 'bg-indigo-600' : 'hover:bg-slate-800 text-gray-400'}`
            }
          >
            Inventory Logs
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <NavLink to="/" className="text-sm text-gray-400 hover:text-white">← Exit to Store</NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 underline decoration-indigo-500 underline-offset-8">
            Management Console
          </h1>
        </header>
        
        {/* Your Admin pages (Dashboard, ProductManagement, etc.) render here */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
