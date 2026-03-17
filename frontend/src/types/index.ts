// 1. Core Entities (Matches Spring Boot + MongoDB)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
}

// 2. Orders & Items
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

// 3. Authentication & User
export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

// 4. Inventory Logs
export interface InventoryMovement {
  id: string; 
  product: Product; 
  quantityChange: number; 
  movementType: 'RESTOCK' | 'SALE' | 'ADJUSTMENT';
  reason: string; 
  createdAt: string; 
}

// 5. Cart Logic
export interface CartItem extends Product {
  quantity: number;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

// 6. Context Interfaces (Contracts)
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  logout: () => void;
  register: (formData: any) => Promise<any>;
  isAdmin: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void; // CHANGED to string
  updateQuantity: (id: string, delta: number) => void; // CHANGED to string
  clearCart: () => void;
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

export interface OrderContextType {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  loading: boolean;
}
