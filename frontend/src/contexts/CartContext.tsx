import { createContext, useState, useEffect, type ReactNode } from 'react';
import { storage } from '../utils/storage';
import type { Product, CartContextType, CartItem } from '../types';

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Use your storage utility for initial load
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return storage.get<CartItem[]>('cart') || [];
  });

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Use storage utility for persistence
  useEffect(() => {
    storage.set('cart', cartItems);
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        // Respect stockQuantity from Spring Boot
        if (exist.quantity >= product.stockQuantity) return prev;
        
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          
          // Guard against negative numbers or exceeding stock
          const clampedQuantity = Math.min(Math.max(0, newQuantity), item.stockQuantity);
          
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, totalAmount, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
