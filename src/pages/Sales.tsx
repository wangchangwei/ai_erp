import { useState } from 'react';
import { useStore } from '../store';
import type { OrderItem } from '../types';

export function Sales() {
  const { customers, products, salesOrders, addSalesOrder, completeSalesOrder, getCustomer } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [error, setError] = useState('');

  const handleAddItem = (productId: string, qty: number, unitPrice: number) => {
    if (!productId || qty <= 0 || unitPrice <= 0) return;
    setItems([...items, { productId, qty, unitPrice }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || items.length === 0) {
      setError('请选择客户并添加商品');
      return;
    }
    const totalPrice = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    addSalesOrder({
      customerId,
      items,
      totalPrice,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setShowForm(false);
    setCustomerId('');
    setItems([]);
    setError('');
  };

  const handleComplete = (id: string) => {
    const result = completeSalesOrder(id);
    if (!result.success) {
      setError(result.error || '操作失败');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>销售订单</h1>
        <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#4ade80', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          新建销售订单
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
          <h3 style={{ marginTop: 0 }}>新建销售订单</h3>
          {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>客户</label>
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                required
                style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, width: '100%', maxWidth: 300 }}
              >
                <option value="">选择客户</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>添加商品</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  id="sale-product-select"
                  style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  defaultValue=""
                >
                  <option value="" disabled>选择商品</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (库存: {p.stock})</option>
                  ))}
                </select>
                <input type="number" id="sale-qty-input" placeholder="数量" min="1" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, width: 80 }} />
                <input type="number" id="sale-price-input" placeholder="销售单价" min="0" step="0.01" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4, width: 120 }} />
                <button
                  type="button"
                  onClick={() => {
                    const productSelect = document.getElementById('sale-product-select') as HTMLSelectElement;
                    const qtyInput = document.getElementById('sale-qty-input') as HTMLInputElement;
                    const priceInput = document.getElementById('sale-price-input') as HTMLInputElement;
                    handleAddItem(productSelect.value, parseInt(qtyInput.value) || 0, parseFloat(priceInput.value) || 0);
                    productSelect.value = '';
                    qtyInput.value = '';
                    priceInput.value = '';
                  }}
                  style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                >
                  添加
                </button>
              </div>
            </div>

            {items.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>商品</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>数量</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>单价</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>小计</th>
                    <th style={{ textAlign: 'center', padding: 8 }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 8 }}>{product?.name}</td>
                        <td style={{ textAlign: 'right', padding: 8 }}>{item.qty}</td>
                        <td style={{ textAlign: 'right', padding: 8 }}>¥{item.unitPrice.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', padding: 8 }}>¥{(item.qty * item.unitPrice).toFixed(2)}</td>
                        <td style={{ textAlign: 'center', padding: 8 }}>
                          <button type="button" onClick={() => handleRemoveItem(index)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                            移除
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'right', padding: 8, fontWeight: 'bold' }}>总计:</td>
                    <td style={{ textAlign: 'right', padding: 8, fontWeight: 'bold' }}>
                      ¥{items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '8px 16px', background: '#4ade80', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                创建订单
              </button>
              <button type="button" onClick={() => { setShowForm(false); setItems([]); setError(''); }} style={{ padding: '8px 16px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: 12 }}>订单号</th>
              <th style={{ textAlign: 'left', padding: 12 }}>客户</th>
              <th style={{ textAlign: 'right', padding: 12 }}>金额</th>
              <th style={{ textAlign: 'center', padding: 12 }}>日期</th>
              <th style={{ textAlign: 'center', padding: 12 }}>状态</th>
              <th style={{ textAlign: 'center', padding: 12 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map(order => {
              const customer = getCustomer(order.customerId);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>{order.id}</td>
                  <td style={{ padding: 12 }}>{customer?.name}</td>
                  <td style={{ textAlign: 'right', padding: 12 }}>¥{order.totalPrice.toFixed(2)}</td>
                  <td style={{ textAlign: 'center', padding: 12 }}>{order.date}</td>
                  <td style={{ textAlign: 'center', padding: 12 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: order.status === 'completed' ? '#dcfce7' : '#fef3c7',
                      color: order.status === 'completed' ? '#166534' : '#92400e'
                    }}>
                      {order.status === 'completed' ? '已完成' : '待出库'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: 12 }}>
                    {order.status === 'pending' && (
                      <button onClick={() => handleComplete(order.id)} style={{ padding: '4px 12px', background: '#4ade80', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        出库
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {salesOrders.length === 0 && <p style={{ textAlign: 'center', color: '#666', padding: 24 }}>暂无销售订单</p>}
      </div>
    </div>
  );
}
