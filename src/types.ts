export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  category: string;
  inStock?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  price: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size: string;
  price: number;
}

export interface Order {
  id: string;
  customerDetails: { name: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
