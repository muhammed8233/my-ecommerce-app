import { useCart } from '../../hooks/useCart';
import StockStatus from '../inventory/StockStatus';
import Button from '../Common/Button';
import { FormatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col bg-white">
      <img 
        src={product.imageUrl || 'https://via.placeholder.com'} 
        alt={product.name} 
        className="h-40 w-full object-cover rounded-md mb-4"
      />
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{product.name}</h3>
        <span className="text-blue-600 font-bold">{FormatCurrency(product.price)}</span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="mt-auto">
        <div className="mb-3">
          <StockStatus quantity={product.stockQuantity} />
        </div>
        
        <Button 
          onClick={() => addToCart(product)} 
          disabled={isOutOfStock}
          variant={isOutOfStock ? "outline" : "primary"}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
