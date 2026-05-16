import { create } from 'zustand';
import type { Product, Supplier, Customer, PurchaseOrder, SalesOrder, InventoryLog } from './types';

interface Store {
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  purchaseOrders: PurchaseOrder[];
  salesOrders: SalesOrder[];
  inventoryLogs: InventoryLog[];

  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Purchase order actions
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => string;
  completePurchaseOrder: (id: string) => void;

  // Sales order actions
  addSalesOrder: (order: Omit<SalesOrder, 'id'>) => string;
  completeSalesOrder: (id: string) => { success: boolean; error?: string };

  // Helpers
  getProduct: (id: string) => Product | undefined;
  getSupplier: (id: string) => Supplier | undefined;
  getCustomer: (id: string) => Customer | undefined;
}

const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();

const initialProducts: Product[] = [
  { id: 'P001', name: '鼠标', price: 99.00, stock: 50, minStock: 10 },
  { id: 'P002', name: '键盘', price: 199.00, stock: 30, minStock: 5 },
  { id: 'P003', name: '显示器', price: 1299.00, stock: 8, minStock: 3 },
  { id: 'P004', name: '耳机', price: 299.00, stock: 2, minStock: 10 },
];

const initialSuppliers: Supplier[] = [
  { id: 'S001', name: '深圳电子厂', contact: '13800138001' },
  { id: 'S002', name: '广州配件商', contact: '13800138002' },
];

const initialCustomers: Customer[] = [
  { id: 'C001', name: '某某公司', contact: '13900139001' },
  { id: 'C002', name: '另一家公司', contact: '13900139002' },
];

export const useStore = create<Store>((set, get) => ({
  products: initialProducts,
  suppliers: initialSuppliers,
  customers: initialCustomers,
  purchaseOrders: [],
  salesOrders: [],
  inventoryLogs: [],

  // Product actions
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: 'P' + generateId() }]
  })),
  updateProduct: (id, product) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...product } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),

  // Supplier actions
  addSupplier: (supplier) => set((state) => ({
    suppliers: [...state.suppliers, { ...supplier, id: 'S' + generateId() }]
  })),
  updateSupplier: (id, supplier) => set((state) => ({
    suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...supplier } : s)
  })),
  deleteSupplier: (id) => set((state) => ({
    suppliers: state.suppliers.filter(s => s.id !== id)
  })),

  // Customer actions
  addCustomer: (customer) => set((state) => ({
    customers: [...state.customers, { ...customer, id: 'C' + generateId() }]
  })),
  updateCustomer: (id, customer) => set((state) => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...customer } : c)
  })),
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter(c => c.id !== id)
  })),

  // Purchase order actions
  addPurchaseOrder: (order) => {
    const id = 'PO' + generateId();
    set((state) => ({
      purchaseOrders: [...state.purchaseOrders, { ...order, id }]
    }));
    return id;
  },
  completePurchaseOrder: (id) => set((state) => {
    const order = state.purchaseOrders.find(o => o.id === id);
    if (!order || order.status === 'completed') return state;

    const newProducts = state.products.map(p => {
      const item = order.items.find(i => i.productId === p.id);
      if (item) {
        return { ...p, stock: p.stock + item.qty };
      }
      return p;
    });

    const newLogs: InventoryLog[] = order.items.map(item => ({
      id: 'LOG' + generateId(),
      type: 'inbound' as const,
      productId: item.productId,
      qty: item.qty,
      unitPrice: item.unitPrice,
      orderId: id,
      orderType: 'purchase' as const,
      date: new Date().toISOString(),
    }));

    return {
      purchaseOrders: state.purchaseOrders.map(o =>
        o.id === id ? { ...o, status: 'completed' as const } : o
      ),
      products: newProducts,
      inventoryLogs: [...state.inventoryLogs, ...newLogs],
    };
  }),

  // Sales order actions
  addSalesOrder: (order) => {
    const id = 'SO' + generateId();
    set((state) => ({
      salesOrders: [...state.salesOrders, { ...order, id }]
    }));
    return id;
  },
  completeSalesOrder: (id) => {
    const state = get();
    const order = state.salesOrders.find(o => o.id === id);
    if (!order || order.status === 'completed') {
      return { success: false, error: '订单不存在或已完成' };
    }

    // Check stock
    for (const item of order.items) {
      const product = state.products.find(p => p.id === item.productId);
      if (!product || product.stock < item.qty) {
        return { success: false, error: `库存不足，当前库存 ${product?.stock ?? 0} 件` };
      }
    }

    set((prevState) => {
      const newProducts = prevState.products.map(p => {
        const item = order.items.find(i => i.productId === p.id);
        if (item) {
          return { ...p, stock: p.stock - item.qty };
        }
        return p;
      });

      const newLogs: InventoryLog[] = order.items.map(item => ({
        id: 'LOG' + generateId(),
        type: 'outbound' as const,
        productId: item.productId,
        qty: item.qty,
        unitPrice: item.unitPrice,
        orderId: id,
        orderType: 'sale' as const,
        date: new Date().toISOString(),
      }));

      return {
        salesOrders: prevState.salesOrders.map(o =>
          o.id === id ? { ...o, status: 'completed' as const } : o
        ),
        products: newProducts,
        inventoryLogs: [...prevState.inventoryLogs, ...newLogs],
      };
    });

    return { success: true };
  },

  // Helpers
  getProduct: (id) => get().products.find(p => p.id === id),
  getSupplier: (id) => get().suppliers.find(s => s.id === id),
  getCustomer: (id) => get().customers.find(c => c.id === id),
}));
