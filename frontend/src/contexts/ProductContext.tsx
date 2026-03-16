// 1. Correct the imports from 'react'
import { createContext, useState, useEffect, type ReactNode } from "react"; 
import type { ProductContextType, Product } from "../types";

// 2. Create and EXPORT the Context
export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  // 3. Use proper state types
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
  setLoading(true);
  try {
    // Fetch 20 products from the public API
    const response = await fetch('https://dummyjson.com/products?limit=20');
    const data = await response.json();
    
    // Map their keys to yours (e.g., title -> name, thumbnail -> imageUrl)
    const formatted = data.products.map((p: any) => ({
      id: p.id.toString(),
      name: p.title,
      price: p.price,
      category: p.category,
      imageUrl: p.thumbnail,
      stockQuantity: p.stock
    }));

    setProducts(formatted);
  } catch (error) {
    console.error("Failed to fetch products", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

