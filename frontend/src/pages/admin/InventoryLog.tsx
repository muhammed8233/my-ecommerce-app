import { useState, useEffect } from 'react';
import client from '../../service/client';
import InventoryLog from '../../components/inventory/InventoryLog';
import Spinner from '../../components/common/Spinner';
import type { InventoryMovement } from '../../types'; 

const InventoryLogPage: React.FC = () => {
  // Explicitly type the state array
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Type the axios response so 'data' is recognised as InventoryMovement[]
        const response = await client.get<InventoryMovement[]>('/inventory/movements');
        setMovements(response.data);
      } catch (err) {
        console.error("Failed to load inventory logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Movement History</h1>
          <p className="text-sm text-gray-500">Track all stock additions and customer sales</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition"
        >
          Refresh Data
        </button>
      </div>

      {movements.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-400 font-medium">No movement logs found in the database.</p>
        </div>
      ) : (
        <InventoryLog movements={movements} />
      )}
    </div>
  );
};

export default InventoryLogPage;
