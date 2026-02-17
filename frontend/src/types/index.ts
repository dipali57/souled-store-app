// src/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}