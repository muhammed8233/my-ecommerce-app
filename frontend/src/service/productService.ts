import client from './client';
// Explicitly use 'import type' for your interface
import type { Product } from '../types';

const productService = {
  // Returns a Promise that resolves to an array of Products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await client.get<Product[]>('/products');
    return response.data;
  },

  // Returns a single Product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await client.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Admin Only: Triggers your backend's InventoryMovement log
  restockProduct: async (productId: string, quantity: number, reason: string): Promise<Product> => {
  const response = await client.post<Product>(`/products/${productId}/restock`, { 
    quantity, 
    reason // Pass the reason here!
  });
  return response.data;
}
};

export default productService;
