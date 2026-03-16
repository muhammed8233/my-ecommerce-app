import React from 'react';
import type { InventoryMovement } from '../../types';
import { formatDateTime } from '../../utils/formatDate';

interface InventoryLogProps {
  movements: InventoryMovement[];
}

const InventoryLog: React.FC<InventoryLogProps> = ({ movements }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Change</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {movements.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
               {formatDateTime(log.createdAt)} 
              </td>
              {/* Accessing NESTED product data */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {log.product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {log.product.sku}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-black ${log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 italic">
                {log.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryLog;
