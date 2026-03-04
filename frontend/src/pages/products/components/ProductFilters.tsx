interface ProductFiltersProps {
  filters: {
    category: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: "price_asc" | "price_desc" | "name_asc" | "name_desc" | null;
  };
  onCategoryChange: (categoryId: number | null) => void;
  onPriceRangeChange: (min: number | null, max: number | null) => void;
  onSortChange: (sortBy: any) => void;
  onReset: () => void;
}

export const ProductFilters = ({
  filters,
  onPriceRangeChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) => {
  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          {/* Sort Dropdown */}
          <select
            value={filters.sortBy || ""}
            onChange={(e) => onSortChange(e.target.value || null)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>

          {/* Price Range */}
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onPriceRangeChange(
                e.target.value ? Number(e.target.value) : null,
                filters.maxPrice,
              )
            }
            className="px-3 py-2 border rounded-md w-24"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              onPriceRangeChange(
                filters.minPrice,
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="px-3 py-2 border rounded-md w-24"
          />
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
