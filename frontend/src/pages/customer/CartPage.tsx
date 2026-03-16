import useCart from '../../hooks/useCart';
import type { OrderItem,  } from '../../types';

const CartPage = () => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart } = useCart();

  const handleCheckout = () => {
    // This perfectly matches your 'OrderItem' interface for Spring Boot
    const orderData: OrderItem[] = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice: item.price
    }));

    console.log("Payload for Backend:", orderData);
    // TODO: Send orderData to your OrderService
  };

  if (cartItems.length === 0) return <div className="p-10 text-center">Empty Cart</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b pb-4">
            <div>
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              <p className="text-blue-600">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded">
                <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1">-</button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)} 
                  disabled={item.quantity >= item.stockQuantity}
                  className="px-3 py-1 disabled:opacity-30"
                >+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <button 
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;
