import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../service/orderService';

const CartPage: React.FC = () => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    try {
      // 1. Format the items - Ensure these match your OrderItem.java model!
      const items = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      // 2. FIX: Use 'userId' and 'orderedItems' to match your @Document
      const orderRequest = {
        userId: user.id,            // Changed from customerId to userId
        orderedItems: items,        // Changed from items to orderedItems
        totalAmount: totalAmount,   // Pass the total if your DTO requires it
        orderedStatus: 'PENDING'    // Match your OrderedStatus Enum if needed
      };

      // 3. Call Service
      const order = await orderService.createOrder(orderRequest);
      
      // 4. Initiate Payment
      // Since your Java @Id is 'private String id', 'order.id' is correct here.
      await orderService.payOrder(order.id);

      alert("Order placed successfully!");
      clearCart();
      navigate('/orders');
      
    } catch (error: any) {
      console.error("Order failed:", error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- EMPTY STATE ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LIST AREA */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <img 
                src={item.imageUrl || 'https://placehold.co'} 
                className="w-20 h-20 object-cover rounded-xl bg-gray-50"
                alt={item.name}
              />
              
              <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-400 uppercase font-bold">{item.category}</p>
                <p className="text-blue-600 font-black mt-1">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center bg-gray-50 border rounded-lg overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)} 
                    className="px-3 py-1 hover:bg-gray-200 transition"
                  >-</button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)} 
                    disabled={item.quantity >= item.stockQuantity}
                    className="px-3 py-1 hover:bg-gray-200 transition disabled:opacity-20"
                  >+</button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-xs font-bold text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY AREA */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-500 font-bold">Free</span>
              </div>
              <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-4">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all 
                ${isProcessing ? 'bg-gray-400' : 'bg-black hover:bg-gray-800 active:scale-95'}`}
            >
              {isProcessing ? 'Processing...' : 'Complete Purchase'}
            </button>
            
            <p className="text-[10px] text-center text-gray-400 mt-4 px-2">
              By clicking "Complete Purchase", you agree to our terms of service and shipping policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
