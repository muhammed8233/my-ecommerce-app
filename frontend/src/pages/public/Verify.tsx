import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../../service/client';

const VerifyPage = () => {
  const [code, setCode] = useState(['', '', '', '']); // For a 4-digit OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || "";

  // Auto-focus next input
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = code.join('');
      // Matches your @PostMapping("/verify-token") with @RequestParam
      const res = await client.post(`/auth/verify-token?email=${email}&token=${token}`);
      
      alert(res.data); // "Account verified successfully!"
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data || "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await client.post(`/auth/resend-token?email=${email}`);
      alert("New code sent!");
    } catch (err) {
      alert("Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your Email</h2>
        <p className="text-gray-500 mb-8">Enter the 4-digit code sent to <span className="font-semibold">{email}</span></p>
        
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-4 mb-6">
            {code.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-extrabold border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            type="submit"
            disabled={loading || code.some(v => v === '')}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        
        <p className="mt-6 text-sm text-gray-500">
          Didn't receive the code?{' '}
          <button onClick={resendCode} className="text-blue-600 font-bold hover:underline">Resend</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
