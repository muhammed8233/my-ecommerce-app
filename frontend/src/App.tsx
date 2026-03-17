import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react/jsx-runtime';

// Layout Components
import Navbar from './components/layouts/UserNavbar';
import AdminLayout from './components/layouts/AdminSidebar';

// Public Pages
import Home from './pages/public/Home';
import AuthPage from './pages/public/Auth'; // Ensure this matches your filename
import ProductDetails from './pages/public/ProductDetails';
import Unauthorized from './pages/public/Unauthorized';

// Customer Pages
import CartPage from './pages/customer/CartPage';
import Checkout from './pages/customer/Checkout';
import MyOrder from './pages/customer/MyOrder';
import PaymentStatus from './pages/customer/PaymentStatus';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryLog from './components/inventory/InventoryLog';
import VerifyPage from './pages/public/Verify';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, adminOnly = false }: { children: JSX.Element, adminOnly?: boolean }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/unauthorized" replace />;
  
  return children;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. AUTH ROUTES (No Navbar/Footer for a clean login look) */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 2. PUBLIC & CUSTOMER ROUTES (With Navbar) */}
      <Route element={<><Navbar /><main className="min-h-screen"><Outlet /></main></>}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        
        {/* Protected Customer Links */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
        <Route path="/payment-status/:orderId" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />
      </Route>

      {/* 3. ADMIN ROUTES (With Sidebar Layout) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout /> 
          </ProtectedRoute>
        }
      >
        {/* Child routes: e.g. /admin/dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="logs" element={<InventoryLog movements={[]} />} />
      </Route>

      {/* 4. FALLBACK REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
