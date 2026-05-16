import { useStore } from '../store';

export function Dashboard() {
  const { products, salesOrders, purchaseOrders, inventoryLogs } = useStore();

  const today = new Date().toISOString().split('T')[0];

  const todaySales = salesOrders
    .filter(o => o.date.startsWith(today) && o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingPurchases = purchaseOrders.filter(o => o.status === 'pending').length;
  const pendingSales = salesOrders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < p.minStock).length;

  const stats = [
    { label: '今日销售额', value: `¥${todaySales.toFixed(2)}`, color: '#4ade80' },
    { label: '待处理采购单', value: pendingPurchases, color: '#f59e0b' },
    { label: '待处理销售单', value: pendingSales, color: '#3b82f6' },
    { label: '库存预警商品', value: lowStockProducts, color: '#ef4444' },
  ];

  const recentLogs = inventoryLogs.slice(-5).reverse();

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>首页 Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            padding: 24,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ color: '#666', marginBottom: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>库存预警</h3>
        {lowStockProducts === 0 ? (
          <p style={{ color: '#666' }}>暂无库存预警商品</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>商品</th>
                <th style={{ textAlign: 'right', padding: 8 }}>当前库存</th>
                <th style={{ textAlign: 'right', padding: 8 }}>预警阈值</th>
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.stock < p.minStock).map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{product.name}</td>
                  <td style={{ textAlign: 'right', padding: 8, color: '#ef4444' }}>{product.stock}</td>
                  <td style={{ textAlign: 'right', padding: 8 }}>{product.minStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>最近库存变动</h3>
        {recentLogs.length === 0 ? (
          <p style={{ color: '#666' }}>暂无库存变动记录</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>时间</th>
                <th style={{ textAlign: 'left', padding: 8 }}>类型</th>
                <th style={{ textAlign: 'left', padding: 8 }}>商品</th>
                <th style={{ textAlign: 'right', padding: 8 }}>数量</th>
                <th style={{ textAlign: 'left', padding: 8 }}>订单</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map(log => {
                const product = products.find(p => p.id === log.productId);
                return (
                  <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{new Date(log.date).toLocaleString()}</td>
                    <td style={{ padding: 8 }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: log.type === 'inbound' ? '#dcfce7' : '#fee2e2',
                        color: log.type === 'inbound' ? '#166534' : '#991b1b'
                      }}>
                        {log.type === 'inbound' ? '入库' : '出库'}
                      </span>
                    </td>
                    <td style={{ padding: 8 }}>{product?.name}</td>
                    <td style={{ textAlign: 'right', padding: 8 }}>{log.qty}</td>
                    <td style={{ padding: 8 }}>{log.orderId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
