import { useState, useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import productService from '../../service/productService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const StockRestock = () => {
  const context = useContext(ProductContext);
  const [selectedProductId, setSelectedProductId] = useState<string | null>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>('RESTOCK');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context) return null;
  const { products, refreshProducts } = context;

  const handleRestock = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) {
      alert("Please select a product and enter a valid quantity.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Hits your backend POST /products/{id}/restock
      await productService.restockProduct(selectedProductId, quantity, reason);
      
      alert("Inventory updated successfully!");
      setQuantity(0);
      setSelectedProductId('');
      setReason('RESTOCK');
      refreshProducts(); // Sync global state with new backend values
    } catch (error) {
      console.error("Restock failed:", error);
      alert("Failed to update inventory.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manual Inventory Restock</h1>
      
      <form onSubmit={handleRestock} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-bold mb-2">Select Product</label>
          <select 
            value={selectedProductId || ''}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose a Product --</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Current Stock: {p.stockQuantity})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <Input 
          label="Quantity to Add"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="e.g. 50"
        />

        {/* Reason (Optional but good for InventoryMovement logs) */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Adjustment Reason</label>
          <input 
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-500"
            value={reason}
            readOnly
          />
        </div>

        <Button
          type="submit" 
          disabled={isSubmitting}
          variant="primary"
        >
          {isSubmitting ? "Updating..." : "Confirm Restock"}
        </Button>
      </form>
    </div>
  );
};

export default StockRestock;
