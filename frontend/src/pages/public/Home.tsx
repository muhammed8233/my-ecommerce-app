import React, { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import useCart from '../../hooks/useCart';
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const context = useContext(ProductContext);
  const { addToCart } = useCart();

  if (!context) return null;
  const { products, loading } = context;

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Hero Section */}
      <section className="relative h-[500px] bg-black flex items-center px-8 text-white overflow-hidden">
        <div className="z-10 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
            Elevate Your <br /> Everyday Style
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Discover the latest trends and essential pieces for your collection. 
            Quality products delivered to your door.
          </p>
          <a href="#products" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition">
            Shop Now
          </a>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
      </section>

      {/* 2. Featured Products Grid */}
      <main id="products" className="max-w-7xl mx-auto py-16 px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500">Handpicked items just for you</p>
          </div>
          <Link to="/products" className="text-blue-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
              {/* Product Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                  src={product.imageUrl || 'https://placehold.co'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stockQuantity < 5 && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                    Low Stock
                  </span>
                )}
              </div>
              {product.stockQuantity === 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                    Sold Out
                  </span>
                </div>
              )}

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-1">{product.category}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className={`p-2 rounded-full transition ${
                      product.stockQuantity === 0 
                        ? 'bg-gray-200 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. Newsletter Section */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Get 10% off your first order when you sign up for our newsletter.</p>
        <div className="flex max-w-md mx-auto gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-white/10 border border-white/20 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
          />
          <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Join
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
