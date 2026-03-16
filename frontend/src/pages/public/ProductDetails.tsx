import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from '../../contexts/ProductContext';
import useCart from '../../hooks/useCart';
import Spinner from '../../components/common/Spinner';
import type { Product } from '../../types';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(ProductContext);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!context) return null;
  const { products, loading } = context;

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find(p => p.id.toString() === (id));
      setProduct(foundProduct || null);
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (product) {
      // Loop to add multiple quantities based on local state
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      navigate('/cart');
    }
  };

  if (loading) return <Spinner />;
  if (!product) return <div className="p-20 text-center text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Product Image */}
      <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-square">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com'} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center">
        <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2">
          {product.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          {product.name}
        </h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-3xl font-black text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.stockQuantity < 5 && (
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Only {product.stockQuantity} left!
            </span>
          )}
        </div>

        {/* Quantity and CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center bg-gray-100 rounded-xl px-2">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-3 text-xl font-bold hover:text-blue-600"
            > - </button>
            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
              className="p-3 text-xl font-bold hover:text-blue-600"
              disabled={quantity >= product.stockQuantity}
            > + </button>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] 
              ${product.stockQuantity === 0 ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Secure Payment
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
            SKU: {product.sku}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
