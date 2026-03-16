import { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import StockStatus from '../../components/inventory/StockStatus';
import Spinner from '../../components/common/Spinner';
import type { ProductContextType } from '../../types'; 



const Dashboard = () => {
  const context = useContext(ProductContext) as ProductContextType; 
  if (!context) return null;
  const { products, loading } = context;

  const lowStockItems = products.filter(p => p.stockQuantity < 5);
  const outOfStockItems = products.filter(p => p.stockQuantity === 0);

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <p className="text-sm text-blue-600">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg shadow">
          <p className="text-sm text-orange-600">Low Stock Alerts</p>
          <p className="text-2xl font-bold">{lowStockItems.length}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <p className="text-sm text-red-600">Out of Stock</p>
          <p className="text-2xl font-bold">{outOfStockItems.length}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Stock Overview</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4 text-gray-500">{product.sku}</td>
                <td className="px-6 py-4"><StockStatus quantity={product.stockQuantity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
