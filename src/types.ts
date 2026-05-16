export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
}

export interface OrderItem {
  productId: string;
  qty: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: OrderItem[];
  totalPrice: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface SalesOrder {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface InventoryLog {
  id: string;
  type: 'inbound' | 'outbound';
  productId: string;
  qty: number;
  unitPrice: number;
  orderId: string;
  orderType: 'purchase' | 'sale';
  date: string;
}
