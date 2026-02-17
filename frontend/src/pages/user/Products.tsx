// pages/Products.tsx
import { useState, useEffect } from "react";
import { ProductGrid } from "../../components/ProductGrid";
import { fetchAllProducts } from "../../api/product.api";
import { useNavigate } from "react-router-dom";


interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
}

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchAllProducts();
      console.log('response in products:', response.data);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (product: Product) => {
    console.log("Quick view:", product);
    // Open modal or navigate
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <ProductGrid 
        products={products} 
        columns={4}
        onQuickView={handleQuickView}
      />
    </div>
  );
};