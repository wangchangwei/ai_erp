import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';

describe('Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useStore.setState({
      products: [
        { id: 'P001', name: '鼠标', price: 99.00, stock: 50, minStock: 10 },
        { id: 'P002', name: '键盘', price: 199.00, stock: 30, minStock: 5 },
        { id: 'P003', name: '显示器', price: 1299.00, stock: 8, minStock: 3 },
        { id: 'P004', name: '耳机', price: 299.00, stock: 2, minStock: 10 },
      ],
      suppliers: [
        { id: 'S001', name: '深圳电子厂', contact: '13800138001' },
        { id: 'S002', name: '广州配件商', contact: '13800138002' },
      ],
      customers: [
        { id: 'C001', name: '某某公司', contact: '13900139001' },
        { id: 'C002', name: '另一家公司', contact: '13900139002' },
      ],
      purchaseOrders: [],
      salesOrders: [],
      inventoryLogs: [],
      currentUser: {
        permissions: [
          'product:read',
          'supplier:read',
          'customer:read',
        ],
      },
    });
  });

  describe('hasPermission', () => {
    it('should return true for granted permission', () => {
      expect(useStore.getState().hasPermission('product:read')).toBe(true);
      expect(useStore.getState().hasPermission('supplier:read')).toBe(true);
    });

    it('should return false for non-granted permission', () => {
      expect(useStore.getState().hasPermission('purchase:read')).toBe(false);
      expect(useStore.getState().hasPermission('sales:read')).toBe(false);
      expect(useStore.getState().hasPermission('inventory:read')).toBe(false);
    });

    it('should return false for unknown permission', () => {
      expect(useStore.getState().hasPermission('admin:write')).toBe(false);
    });
  });

  describe('Product CRUD', () => {
    it('addProduct should add a new product with generated id', () => {
      const initialCount = useStore.getState().products.length;
      useStore.getState().addProduct({ name: '新商品', price: 199.00, stock: 20, minStock: 5 });

      const products = useStore.getState().products;
      expect(products.length).toBe(initialCount + 1);
      expect(products[products.length - 1].name).toBe('新商品');
      expect(products[products.length - 1].id).toMatch(/^P/);
    });

    it('updateProduct should update existing product', () => {
      useStore.getState().updateProduct('P001', { name: '更新后的鼠标', price: 89.00 });

      const product = useStore.getState().getProduct('P001');
      expect(product?.name).toBe('更新后的鼠标');
      expect(product?.price).toBe(89.00);
    });

    it('updateProduct should not affect other products', () => {
      useStore.getState().updateProduct('P001', { name: '更新的名称' });

      const p002 = useStore.getState().getProduct('P002');
      expect(p002?.name).toBe('键盘');
    });

    it('deleteProduct should remove product by id', () => {
      const initialCount = useStore.getState().products.length;
      useStore.getState().deleteProduct('P001');

      const products = useStore.getState().products;
      expect(products.length).toBe(initialCount - 1);
      expect(products.find(p => p.id === 'P001')).toBeUndefined();
    });

    it('deleteProduct should not affect other products', () => {
      useStore.getState().deleteProduct('P001');
      expect(useStore.getState().getProduct('P002')).toBeDefined();
    });

    it('getProduct should return product by id', () => {
      const product = useStore.getState().getProduct('P001');
      expect(product).toBeDefined();
      expect(product?.name).toBe('鼠标');
    });

    it('getProduct should return undefined for non-existent id', () => {
      const product = useStore.getState().getProduct('NONEXISTENT');
      expect(product).toBeUndefined();
    });
  });

  describe('Supplier CRUD', () => {
    it('addSupplier should add a new supplier with generated id', () => {
      const initialCount = useStore.getState().suppliers.length;
      useStore.getState().addSupplier({ name: '新供应商', contact: '13900000000' });

      const suppliers = useStore.getState().suppliers;
      expect(suppliers.length).toBe(initialCount + 1);
      expect(suppliers[suppliers.length - 1].name).toBe('新供应商');
      expect(suppliers[suppliers.length - 1].id).toMatch(/^S/);
    });

    it('updateSupplier should update existing supplier', () => {
      useStore.getState().updateSupplier('S001', { name: '更新的供应商', contact: '13911111111' });

      const supplier = useStore.getState().getSupplier('S001');
      expect(supplier?.name).toBe('更新的供应商');
      expect(supplier?.contact).toBe('13911111111');
    });

    it('deleteSupplier should remove supplier by id', () => {
      const initialCount = useStore.getState().suppliers.length;
      useStore.getState().deleteSupplier('S001');

      const suppliers = useStore.getState().suppliers;
      expect(suppliers.length).toBe(initialCount - 1);
      expect(suppliers.find(s => s.id === 'S001')).toBeUndefined();
    });

    it('getSupplier should return supplier by id', () => {
      const supplier = useStore.getState().getSupplier('S001');
      expect(supplier).toBeDefined();
      expect(supplier?.name).toBe('深圳电子厂');
    });

    it('getSupplier should return undefined for non-existent id', () => {
      const supplier = useStore.getState().getSupplier('NONEXISTENT');
      expect(supplier).toBeUndefined();
    });
  });

  describe('Customer CRUD', () => {
    it('addCustomer should add a new customer with generated id', () => {
      const initialCount = useStore.getState().customers.length;
      useStore.getState().addCustomer({ name: '新客户', contact: '13800000000' });

      const customers = useStore.getState().customers;
      expect(customers.length).toBe(initialCount + 1);
      expect(customers[customers.length - 1].name).toBe('新客户');
      expect(customers[customers.length - 1].id).toMatch(/^C/);
    });

    it('updateCustomer should update existing customer', () => {
      useStore.getState().updateCustomer('C001', { name: '更新的客户', contact: '13922222222' });

      const customer = useStore.getState().getCustomer('C001');
      expect(customer?.name).toBe('更新的客户');
      expect(customer?.contact).toBe('13922222222');
    });

    it('deleteCustomer should remove customer by id', () => {
      const initialCount = useStore.getState().customers.length;
      useStore.getState().deleteCustomer('C001');

      const customers = useStore.getState().customers;
      expect(customers.length).toBe(initialCount - 1);
      expect(customers.find(c => c.id === 'C001')).toBeUndefined();
    });

    it('getCustomer should return customer by id', () => {
      const customer = useStore.getState().getCustomer('C001');
      expect(customer).toBeDefined();
      expect(customer?.name).toBe('某某公司');
    });

    it('getCustomer should return undefined for non-existent id', () => {
      const customer = useStore.getState().getCustomer('NONEXISTENT');
      expect(customer).toBeUndefined();
    });
  });

  describe('Purchase Order', () => {
    it('addPurchaseOrder should add a new purchase order with generated id', () => {
      const initialCount = useStore.getState().purchaseOrders.length;
      const orderId = useStore.getState().addPurchaseOrder({
        supplierId: 'S001',
        items: [{ productId: 'P001', qty: 10, unitPrice: 80.00 }],
        totalPrice: 800.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const orders = useStore.getState().purchaseOrders;
      expect(orders.length).toBe(initialCount + 1);
      expect(orderId).toMatch(/^PO/);
      expect(orders.find(o => o.id === orderId)?.supplierId).toBe('S001');
    });

    it('completePurchaseOrder should update order status and increase stock', () => {
      const orderId = useStore.getState().addPurchaseOrder({
        supplierId: 'S001',
        items: [{ productId: 'P001', qty: 10, unitPrice: 80.00 }],
        totalPrice: 800.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const initialStock = useStore.getState().getProduct('P001')?.stock;
      useStore.getState().completePurchaseOrder(orderId);

      const order = useStore.getState().purchaseOrders.find(o => o.id === orderId);
      expect(order?.status).toBe('completed');

      const updatedStock = useStore.getState().getProduct('P001')?.stock;
      expect(updatedStock).toBe(initialStock! + 10);
    });

    it('completePurchaseOrder should create inventory logs', () => {
      const orderId = useStore.getState().addPurchaseOrder({
        supplierId: 'S001',
        items: [{ productId: 'P001', qty: 10, unitPrice: 80.00 }],
        totalPrice: 800.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const initialLogCount = useStore.getState().inventoryLogs.length;
      useStore.getState().completePurchaseOrder(orderId);

      const logs = useStore.getState().inventoryLogs;
      expect(logs.length).toBe(initialLogCount + 1);

      const newLog = logs[logs.length - 1];
      expect(newLog.type).toBe('inbound');
      expect(newLog.productId).toBe('P001');
      expect(newLog.qty).toBe(10);
      expect(newLog.orderType).toBe('purchase');
    });

    it('completePurchaseOrder should not affect already completed orders', () => {
      const orderId = useStore.getState().addPurchaseOrder({
        supplierId: 'S001',
        items: [{ productId: 'P001', qty: 10, unitPrice: 80.00 }],
        totalPrice: 800.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const initialStock = useStore.getState().getProduct('P001')?.stock;
      useStore.getState().completePurchaseOrder(orderId);
      useStore.getState().completePurchaseOrder(orderId);

      expect(useStore.getState().getProduct('P001')?.stock).toBe(initialStock! + 10);
    });

    it('completePurchaseOrder should handle non-existent order gracefully', () => {
      const initialStock = useStore.getState().getProduct('P001')?.stock;
      useStore.getState().completePurchaseOrder('NONEXISTENT');
      expect(useStore.getState().getProduct('P001')?.stock).toBe(initialStock);
    });

    it('completePurchaseOrder should not affect other orders', () => {
      const orderId1 = useStore.getState().addPurchaseOrder({
        supplierId: 'S001',
        items: [{ productId: 'P001', qty: 10, unitPrice: 80.00 }],
        totalPrice: 800.00,
        date: '2026-05-17',
        status: 'pending',
      });
      const orderId2 = useStore.getState().addPurchaseOrder({
        supplierId: 'S001',
        items: [{ productId: 'P002', qty: 5, unitPrice: 150.00 }],
        totalPrice: 750.00,
        date: '2026-05-17',
        status: 'pending',
      });

      useStore.getState().completePurchaseOrder(orderId1);

      const order2 = useStore.getState().purchaseOrders.find(o => o.id === orderId2);
      expect(order2?.status).toBe('pending');
    });
  });

  describe('Sales Order', () => {
    it('addSalesOrder should add a new sales order with generated id', () => {
      const initialCount = useStore.getState().salesOrders.length;
      const orderId = useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P001', qty: 5, unitPrice: 99.00 }],
        totalPrice: 495.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const orders = useStore.getState().salesOrders;
      expect(orders.length).toBe(initialCount + 1);
      expect(orderId).toMatch(/^SO/);
      expect(orders.find(o => o.id === orderId)?.customerId).toBe('C001');
    });

    it('completeSalesOrder should update order status and decrease stock', () => {
      const orderId = useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P001', qty: 5, unitPrice: 99.00 }],
        totalPrice: 495.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const initialStock = useStore.getState().getProduct('P001')?.stock;
      const result = useStore.getState().completeSalesOrder(orderId);

      expect(result.success).toBe(true);
      const order = useStore.getState().salesOrders.find(o => o.id === orderId);
      expect(order?.status).toBe('completed');

      const updatedStock = useStore.getState().getProduct('P001')?.stock;
      expect(updatedStock).toBe(initialStock! - 5);
    });

    it('completeSalesOrder should fail when stock is insufficient', () => {
      useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P001', qty: 1000, unitPrice: 99.00 }],
        totalPrice: 99000.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const orderId = useStore.getState().salesOrders[useStore.getState().salesOrders.length - 1].id;
      const result = useStore.getState().completeSalesOrder(orderId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('库存不足');
    });

    it('completeSalesOrder should create inventory logs', () => {
      const orderId = useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P001', qty: 5, unitPrice: 99.00 }],
        totalPrice: 495.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const initialLogCount = useStore.getState().inventoryLogs.length;
      useStore.getState().completeSalesOrder(orderId);

      const logs = useStore.getState().inventoryLogs;
      expect(logs.length).toBe(initialLogCount + 1);

      const newLog = logs[logs.length - 1];
      expect(newLog.type).toBe('outbound');
      expect(newLog.productId).toBe('P001');
      expect(newLog.qty).toBe(5);
      expect(newLog.orderType).toBe('sale');
    });

    it('completeSalesOrder should not affect already completed orders', () => {
      const orderId = useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P001', qty: 5, unitPrice: 99.00 }],
        totalPrice: 495.00,
        date: '2026-05-17',
        status: 'pending',
      });

      const initialStock = useStore.getState().getProduct('P001')?.stock;
      useStore.getState().completeSalesOrder(orderId);
      const result = useStore.getState().completeSalesOrder(orderId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('订单不存在或已完成');
      expect(useStore.getState().getProduct('P001')?.stock).toBe(initialStock! - 5);
    });

    it('completeSalesOrder should fail for non-existent order', () => {
      const result = useStore.getState().completeSalesOrder('NONEXISTENT');
      expect(result.success).toBe(false);
      expect(result.error).toBe('订单不存在或已完成');
    });

    it('completeSalesOrder should fail when product does not exist', () => {
      // Manually add an order with non-existent product to bypass validation at add time
      useStore.setState((state) => ({
        salesOrders: [...state.salesOrders, {
          id: 'SO_TEST',
          customerId: 'C001',
          items: [{ productId: 'NONEXISTENT', qty: 10, unitPrice: 99.00 }],
          totalPrice: 990.00,
          date: '2026-05-17',
          status: 'pending',
        }],
      }));

      const result = useStore.getState().completeSalesOrder('SO_TEST');
      expect(result.success).toBe(false);
      expect(result.error).toContain('库存不足');
    });

    it('completeSalesOrder should not affect other orders', () => {
      const orderId1 = useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P001', qty: 5, unitPrice: 99.00 }],
        totalPrice: 495.00,
        date: '2026-05-17',
        status: 'pending',
      });
      const orderId2 = useStore.getState().addSalesOrder({
        customerId: 'C001',
        items: [{ productId: 'P002', qty: 3, unitPrice: 199.00 }],
        totalPrice: 597.00,
        date: '2026-05-17',
        status: 'pending',
      });

      useStore.getState().completeSalesOrder(orderId1);

      const order2 = useStore.getState().salesOrders.find(o => o.id === orderId2);
      expect(order2?.status).toBe('pending');
    });
  });
});
