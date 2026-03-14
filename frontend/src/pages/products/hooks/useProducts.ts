import { useMemo } from "react";
import {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
} from "../redux/product.api";
import {
  setCategoryFilter,
  setPriceRange,
  setSortBy,
  clearFilters,
} from "../redux/product.slice"; // Fixed import path
import { useAppDispatch, useAppSelector } from "../../../store/store";


export const useProducts = (categoryId?: number, searchTerm?: string) => {
  const dispatch = useAppDispatch();
  const allProductsQuery = useGetAllProductsQuery();
  const filters = useAppSelector((state) => state.product.filters);

  const categoryProductsQuery = useGetProductsByCategoryQuery(categoryId ?? 0, {
    skip: !categoryId,
  });

  const searchProductsQuery = useSearchProductsQuery(searchTerm ?? "", {
    skip: !searchTerm,
  });

  const queryResult = useMemo(() => {
    if (searchTerm) {
      return searchProductsQuery;
    } else if (categoryId) {
      return categoryProductsQuery;
    } else {
      return allProductsQuery;
    }
  }, [
    searchTerm,
    categoryId,
    searchProductsQuery,
    categoryProductsQuery,
    allProductsQuery,
  ]);

  const { data, error, isLoading, isFetching, refetch } = queryResult;

  const filteredProducts = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    let products = [...data];

    if (filters.minPrice !== null) {
      products = products.filter(
        (p) => parseFloat(p.price) >= filters.minPrice!,
      );
    }
    if (filters.maxPrice !== null) {
      products = products.filter(
        (p) => parseFloat(p.price) <= filters.maxPrice!,
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      products.sort((a, b) => {
        switch (filters.sortBy) {
          case "price_asc":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price_desc":
            return parseFloat(b.price) - parseFloat(a.price);
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    return products;
  }, [data, filters]);

  const setCategory = (categoryId: number | null) => {
    dispatch(setCategoryFilter(categoryId));
  };

  const setPriceRangeFilter = (min: number | null, max: number | null) => {
    dispatch(setPriceRange({ min, max }));
  };

  const setSort = (sortBy: typeof filters.sortBy) => {
    dispatch(setSortBy(sortBy));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  return {
    products: filteredProducts,
    allProducts: data || [],
    loading: isLoading,
    isFetching,
    error,
    refetch,
    filters,
    setCategory,
    setPriceRange: setPriceRangeFilter,
    setSort,
    resetFilters,
  };
};
