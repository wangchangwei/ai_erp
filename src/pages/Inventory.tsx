import { useStore } from '../store';

export function Inventory() {
  const { products, inventoryLogs } = useStore();

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>库存查询</h1>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>商品库存</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: 12 }}>商品</th>
              <th style={{ textAlign: 'right', padding: 12 }}>单价</th>
              <th style={{ textAlign: 'right', padding: 12 }}>当前库存</th>
              <th style={{ textAlign: 'right', padding: 12 }}>预警库存</th>
              <th style={{ textAlign: 'center', padding: 12 }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{product.name}</td>
                <td style={{ textAlign: 'right', padding: 12 }}>¥{product.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: 12, color: product.stock < product.minStock ? '#ef4444' : 'inherit', fontWeight: product.stock < product.minStock ? 'bold' : 'normal' }}>
                  {product.stock}
                </td>
                <td style={{ textAlign: 'right', padding: 12 }}>{product.minStock}</td>
                <td style={{ textAlign: 'center', padding: 12 }}>
                  {product.stock < product.minStock ? (
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#fee2e2', color: '#991b1b' }}>
                      库存不足
                    </span>
                  ) : (
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: '#dcfce7', color: '#166534' }}>
                      正常
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{ textAlign: 'center', color: '#666', padding: 24 }}>暂无商品</p>}
      </div>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>库存流水</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: 12 }}>时间</th>
              <th style={{ textAlign: 'left', padding: 12 }}>类型</th>
              <th style={{ textAlign: 'left', padding: 12 }}>商品</th>
              <th style={{ textAlign: 'right', padding: 12 }}>数量</th>
              <th style={{ textAlign: 'right', padding: 12 }}>单价</th>
              <th style={{ textAlign: 'left', padding: 12 }}>订单</th>
            </tr>
          </thead>
          <tbody>
            {inventoryLogs.map(log => {
              const product = products.find(p => p.id === log.productId);
              return (
                <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>{new Date(log.date).toLocaleString()}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: log.type === 'inbound' ? '#dcfce7' : '#fee2e2',
                      color: log.type === 'inbound' ? '#166534' : '#991b1b'
                    }}>
                      {log.type === 'inbound' ? '入库' : '出库'}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>{product?.name}</td>
                  <td style={{ textAlign: 'right', padding: 12 }}>{log.qty}</td>
                  <td style={{ textAlign: 'right', padding: 12 }}>¥{log.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: 12 }}>{log.orderId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inventoryLogs.length === 0 && <p style={{ textAlign: 'center', color: '#666', padding: 24 }}>暂无库存流水记录</p>}
      </div>
    </div>
  );
}
