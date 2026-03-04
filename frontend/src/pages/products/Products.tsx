import { useCartOperations } from "../cart/hooks/useCartOperations";
import { useWishlist } from "../wishlist/hooks/useWishlist";
import { ProductFilters } from "./components/ProductFilters";
import { ProductGrid } from "./components/ProductGrid";
import { useProducts } from "./hooks/useProducts";
import { useGetAllProductsQuery } from "./redux/product.api";

export const Products = () => {
  const {
    loading,
    error,
    refetch,
    filters,
    setCategory,
    setPriceRange,
    setSort,
    resetFilters,
  } = useProducts();

  const { data: products = [] } = useGetAllProductsQuery();
  const { handleAddToCart, isAddingToCart } = useCartOperations();
  const { toggleWishlist, isInWishlist } = useWishlist();
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-96 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Failed to load products</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductFilters
        filters={filters}
        onCategoryChange={setCategory}
        onPriceRangeChange={setPriceRange}
        onSortChange={setSort}
        onReset={resetFilters}
      />
      <ProductGrid
        products={products}
        onAddToCart={(productId) =>
          handleAddToCart(
            productId,
            products.find((p) => p.id === productId)?.stock || 0,
          )
        }
        onWishlistAction={toggleWishlist}
        isInWishlist={isInWishlist}
        isAddingToCart={isAddingToCart}
        wishlistIcon="heart"
        showCategory={true}
      />
    </div>
  );
};
