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

      // Spring Data Pageable wraps the list in a "content" field
      // Fallback to [] if data or data.content is missing
      const sourceData = data?.content || [];

      const formatted = sourceData.map((p: any) => ({
        id: p.id?.toString() || Math.random().toString(),
        name: p.productName || p.name || "Unknown", // Controller uses productName sort key
        price: p.price || 0,
        category: p.category || "General",
        imageUrl: p.imageUrl || "",
        stockQuantity: p.stockQuantity || 0
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]); // Prevents UI crash if backend fails
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

