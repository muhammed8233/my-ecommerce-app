import client from './client';

// src/service/orderService.ts
const orderService = {
    // 1. Create the order using the @PostMapping("/place")
    createOrder: async (orderData: any) => {
        const response = await client.post('/orders/place', orderData);
        return response.data;
    },

    // 2. Initiate payment using @PostMapping("/{orderId}/initiate-payment")
    payOrder: async (orderId: string) => {
        const response = await client.post(`/orders/${orderId}/initiate-payment`);
        return response.data;
    },
 
    getCustomerOrders: async (userId: string) => {
        const response = await client.get(`/orders/user/${userId}`);
        return response.data; // Should return the list of orders
    },

    // 3. Fetch orders with search and pagination mapping to your @GetMapping
    getOrders: async (searchTerm: string = "", page: number = 0): Promise<any> => {
        const response = await client.get(`/orders`, {
            params: {
                search: searchTerm, // Maps to @RequestParam String search
                page: page,         // Maps to Pageable
                size: 10            // Matches your @PageableDefault size
            }
        });
        // Returns the full Page object { content: [], totalPages: x, ... }
        return response.data; 
    }
};

export default orderService;
