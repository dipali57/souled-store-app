import { ProductCard } from "./ProductCard";


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

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  onQuickView?: (product: Product) => void;
}

export const ProductGrid = ({ products, columns = 4, onQuickView }: ProductGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};