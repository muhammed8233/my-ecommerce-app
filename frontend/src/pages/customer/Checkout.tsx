import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import orderService from '../../service/orderService';
import type { OrderItem } from '../../types';

const CheckoutPage: React.FC = () => {
  const { user, isCustomer, loading: authLoading } = useAuth();
  const { cartItems, totalAmount, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    // 1. Safety Checks
    if (!user || !isCustomer) {
      alert("Only customers can place orders.");
      return;
    }
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      // 2. Map Cart to Backend OrderItem format
      const items: OrderItem[] = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      // 3. Create the Order in Spring Boot
      const newOrder = await orderService.createOrder(user.id, items);

      // 4. Trigger Mock Payment using the new Order ID
      const payment = await orderService.payOrder(newOrder.id);

      if (payment.status === 'SUCCESS' || payment.status === 'PAID') {
        alert(`Order Placed! Ref: ${payment.reference}`);
        clearCart();
        navigate('/orders'); // Redirect to customer order history
      }
    } catch (error: any) {
      console.error("Order process failed:", error);
      alert(error.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading/Guard States
  if (authLoading) return <div className="p-10 text-center">Checking credentials...</div>;
  if (!user) return <div className="p-10 text-center">Please <Link to="/login" className="text-blue-500">login</Link> to checkout.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl my-10 border border-gray-50">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Review Your Order</h1>

      <div className="bg-gray-50 p-6 rounded-xl space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping to</span>
          <span className="font-semibold text-gray-800">{user.name} ({user.email})</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Items in Cart</span>
          <span className="font-semibold text-gray-800">{cartItems.length} Products</span>
        </div>
        <div className="pt-4 border-t flex justify-between items-baseline">
          <span className="text-lg font-bold text-gray-700">Total Amount</span>
          <span className="text-3xl font-black text-green-600">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={isProcessing || cartItems.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all 
            ${isProcessing ? 'bg-gray-400 cursor-wait' : 'bg-black hover:bg-gray-800 active:scale-[0.98]'}`}
        >
          {isProcessing ? 'Processing Payment...' : 'Confirm & Pay Now'}
        </button>
        
        <button 
          onClick={() => navigate('/cart')}
          disabled={isProcessing}
          className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          Cancel and return to cart
        </button>
      </div>

      <p className="mt-6 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
        Encrypted Transaction via Spring Security
      </p>
    </div>
  );
};

export default CheckoutPage;
