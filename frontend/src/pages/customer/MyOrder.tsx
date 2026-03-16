import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../service/orderService';
import type { Order } from '../../types';
import Spinner from '../../components/common/Spinner';

const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await orderService.getCustomerOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Order Placed</p>
                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                    <p className="text-sm font-medium">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Order #</p>
                  <p className="text-sm font-medium">{order.id}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="p-6">
                {/* Link to a detail page if you have one */}
                <button className="text-blue-600 font-semibold hover:underline text-sm">
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper component for status colors
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    SHIPPED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

export default OrderHistoryPage;
