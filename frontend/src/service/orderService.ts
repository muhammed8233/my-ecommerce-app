import client from './client';
import type { Order, OrderItem } from '../types';

const orderService = {
  // Step 1: Create the Order
  createOrder: async (customerId: string, items: OrderItem[]): Promise<Order> => {
    const response = await client.post<Order>('/orders', { customerId, items });
    return response.data;
  },

  // Step 2: Trigger Mock Payment
  payOrder: async (orderId: string): Promise<{ status: string; reference: string }> => {
    const response = await client.post(`/orders/${orderId}/pay`);
    return response.data;
  },

  // For Customer Profile
  getCustomerOrders: async (customerId: string): Promise<Order[]> => {
    const response = await client.get<Order[]>(`/orders/customer/${customerId}`);
    return response.data;
  }
};

export default orderService;
