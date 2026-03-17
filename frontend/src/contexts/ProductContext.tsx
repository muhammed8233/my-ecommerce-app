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
      const response = await fetch('/api/v1/products'); 
      const data = await response.json();

      /** 
       * NOTE: If your backend returns a direct array, use 'data'.
       * If it wraps it like DummyJSON, use 'data.products'.
       */
      const sourceData = Array.isArray(data) ? data : data.products;

      const formatted: Product[] = sourceData.map((p: any) => ({
        id: p.id.toString(),
        name: p.string || p.name, // Handles both DummyJSON and standard naming
        price: p.price,
        category: p.category,
        imageUrl: p.string || p.imageUrl,
        stockQuantity: p.number || p.stockQuantity
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

