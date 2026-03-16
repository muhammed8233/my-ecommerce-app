import React from 'react';

// Define the interface for the component props
interface StockStatusProps {
  quantity: number;
}

const StockStatus: React.FC<StockStatusProps> = ({ quantity }) => {
  let statusColor = "bg-green-100 text-green-800"; // Default: In Stock
  let statusText = "In Stock";

  if (quantity === 0) {
    statusColor = "bg-red-100 text-red-800";
    statusText = "Out of Stock";
  } else if (quantity < 5) {
    statusColor = "bg-orange-100 text-orange-800";
    statusText = "Low Stock";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
      {statusText} ({quantity})
    </span>
  );
};

export default StockStatus;
