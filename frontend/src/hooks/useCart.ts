import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');

  const { cartItems, ...methods } = context;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cartItems,
    ...methods,
    totalAmount,
    cartCount
  };
};

export default useCart;
