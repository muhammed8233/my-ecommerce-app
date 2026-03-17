import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import  useCart  from '../../hooks/useCart';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">MiniShop</Link>
      
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        
        {/* Customer Specific Links */}
        {user?.role === 'USER' && (
          <>
            <Link to="/cart" className="relative">
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <Link to="/orders">My Orders</Link>
          </>
        )}

        {/* Admin Specific Links */}
        {user?.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="font-semibold text-orange-600">Admin Panel</Link>
        )}

        {/* Auth Toggles */}
        {/* Auth Toggles */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">Hi, {user.name}</span>
            <button 
              onClick={logout} 
              className="text-gray-600 hover:text-red-500 font-medium transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-blue-600 px-4 py-2 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Register
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
