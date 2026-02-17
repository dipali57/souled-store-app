// pages/admin/Products.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";

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

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch("/api/admin/products");
    const data = await response.json();
    setProducts(data);
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link 
          to="/admin/products/new"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-6 py-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.category.name}</td>
                <td className="px-6 py-4">₹{parseFloat(product.price).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    parseInt(product.stock) > 10 
                      ? 'bg-green-100 text-green-800'
                      : parseInt(product.stock) > 0
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link 
                      to={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};