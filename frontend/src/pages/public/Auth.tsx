import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 

const AuthPage: React.FC = () => {
  const { login, register } = useAuth(); // Ensure register is in your hook
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleAuth = async (formData: FormData) => {
  setLoading(true);
  setError(null);

  const email = (formData.get('email') as string).toLowerCase().trim();
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    if (isLogin) {
      // Real Login: AuthProvider handles the /api/v1/auth/login call
      await login({ email, password });
      
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else {
      // Real Register: Hits /api/v1/auth/register
      await register({ name, email, password });
      
      // REDIRECT TO VERIFY: Send them to enter the 4-digit code
      navigate(`/verify?email=${encodeURIComponent(email)}`, { 
        state: { email }, 
        replace: true 
      });
    }
  } catch (err: any) {
    // Show the actual error from Spring Boot (e.g., "User already exists" or "Verify your account")
    setError(err.message || "An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isLogin ? 'Enter details to access shop' : 'Join our community today'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 italic">
            {error}
          </div>
        )}

        {/* USE action INSTEAD OF onSubmit */}
        <form action={handleAuth} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Full Name</label>
              <input
                type="text"
                name="name" // Used by formData.get('name')
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email Address</label>
            <input
              type="email"
              name="email" // Used by formData.get('email')
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Password</label>
            <input
              type="password"
              name="password" // Used by formData.get('password')
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 transition outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-[0.98]'}`}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button" // Important: set to button type so it doesn't trigger the form
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-blue-600 hover:underline"
            >
              {isLogin ? 'Create one now' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
