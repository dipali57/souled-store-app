export interface Product {
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

export interface FetchProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}