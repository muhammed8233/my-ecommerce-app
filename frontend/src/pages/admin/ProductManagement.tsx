import React, { useContext, useState } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import productService from '../../service/productService';
import Button from '../../components/common/Button';
import type { ProductContextType } from '../../types';

const ManageProducts: React.FC = () => {
  const context = useContext(ProductContext) as ProductContextType;
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!context) return null;
  const { products, refreshProducts } = context;

  const handleRestock = async (id: string) => {
    const qtyInput = prompt("Enter quantity to add:");
    const quantity = Number(qtyInput);

    if (qtyInput && !isNaN(quantity) && quantity > 0) {
      setUpdatingId(id);
      try {
        // Match your Spring Boot signature: productId (String), quantity (int)
        await productService.restockProduct(id, quantity, "MANUAL_RESTOCK");
        
        // Refresh the global ProductContext to update Dashboard and this list
        await refreshProducts(); 
        alert("Stock updated successfully!");
      } catch (error) {
        console.error("Restock failed:", error);
        alert("Failed to update stock. Please try again.");
      } finally {
        setUpdatingId(null);
      }
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Product Management</h1>
        <p className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          Total SKUs: {products.length}
        </p>
      </div>

      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex-1">
              <p className="font-bold text-lg text-gray-900">{p.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{p.sku}</span>
                <span className={`text-sm font-bold ${p.stockQuantity < 5 ? 'text-red-500' : 'text-blue-600'}`}>
                  Available: {p.stockQuantity}
                </span>
              </div>
            </div>

            <Button 
              onClick={() => handleRestock(p.id)} 
              variant="outline"
              disabled={updatingId === p.id}
            >
              {updatingId === p.id ? "Updating..." : "Add Stock"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProducts;
