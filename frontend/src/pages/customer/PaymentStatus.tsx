import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../service/orderService';
import type { Order } from '../../types';
import Spinner from '../../components/common/Spinner';

const PaymentStatusPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const checkStatus = async () => {
    if (!orderId || !user) return;
    try {
      const data = await orderService.getCustomerOrders(user.id);
      
      // Compare as strings directly
      const currentOrder = data.find(o => o.id.toString() === orderId);
      
      setOrder(currentOrder || null);
    } catch (error) {
      console.error("Status check failed:", error);
    } finally {
      setLoading(false);
    }
  };
  checkStatus();
}, [orderId, user]);

  if (loading) return <Spinner />;

  // 1. Success State (PAID)
  if (order?.status === 'PAID') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-2xl text-center border border-green-50">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 text-sm px-4">
          Thank you for your purchase. Your order <strong>#{order.id}</strong> is being processed.
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Amount Paid</span><span className="font-bold">${order.totalAmount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</span></div>
        </div>
        <button onClick={() => navigate('/orders')} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:opacity-90">View My Orders</button>
      </div>
    );
  }

  // 2. Failure/Cancelled State
  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-2xl text-center border border-red-50">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p className="text-gray-500 mb-8">We couldn't process your payment for order #{orderId}.</p>
      <Link to="/checkout" className="block w-full bg-red-600 text-white py-4 rounded-xl font-bold mb-4">Try Again</Link>
      <button onClick={() => navigate('/')} className="text-gray-400 text-sm hover:underline">Return to Home</button>
    </div>
  );
};

export default PaymentStatusPage;
