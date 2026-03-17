import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 

const VerifyPage = () => {
  // 1. Get functions from AuthContext
  const { verifyToken, resendToken } = useAuth() as any; 
  
  // 2. States
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email') || "";

  // 3. Optimized Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    // Take only the last character entered
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-focus next input
    if (value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevSibling = (e.target as HTMLInputElement).previousSibling as HTMLInputElement;
      if (prevSibling) prevSibling.focus();
    }
  };

  // 4. Corrected Event Type
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = code.join('');
      await verifyToken(email, token);
      
      alert("Account verified successfully!");
      navigate('/'); 
    } catch (err: any) {
      // Extract the error message correctly
      const msg = err.response?.data || err.message || "Verification failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;
    
    setIsResending(true);
    setError('');
    try {
      await resendToken(email);
      alert("New 4-digit code sent!");
      setTimeLeft(60); 
    } catch (err: any) {
      setError("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-black">Verify your Email</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Enter the 4-digit code sent to <br/>
          <span className="font-semibold text-gray-800">{email}</span>
        </p>
        
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-4 mb-6">
            {code.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-14 h-14 text-center text-2xl font-extrabold border-2 rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 outline-none transition-all bg-gray-50 text-black"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                required
              />
            ))}
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 font-medium italic">{error}</p>}
          
          <button
            type="submit"
            disabled={loading || code.some(v => v === '')}
            className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-300 transition-all active:scale-[0.98]"
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            {timeLeft > 0 ? (
              <span className="text-gray-400 font-medium italic">Resend in {timeLeft}s</span>
            ) : (
              <button 
                type="button"
                onClick={handleResend} 
                disabled={isResending}
                className="text-blue-600 font-bold hover:underline disabled:text-gray-300"
              >
                {isResending ? 'Sending...' : 'Resend Now'}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
