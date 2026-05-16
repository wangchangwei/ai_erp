import { useState } from 'react';
import { useStore } from '../store';
import type { Product } from '../types';

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', price: 0, stock: 0, minStock: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, form);
      setEditingId(null);
    } else {
      addProduct(form);
    }
    setForm({ name: '', price: 0, stock: 0, minStock: 0 });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({ name: product.name, price: product.price, stock: product.stock, minStock: product.minStock });
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该商品？')) {
      deleteProduct(id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', price: 0, stock: 0, minStock: 0 });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>商品管理</h1>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? '编辑商品' : '新增商品'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12 }}>
          <input
            placeholder="商品名称"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input
            type="number"
            placeholder="单价"
            value={form.price || ''}
            onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input
            type="number"
            placeholder="库存"
            value={form.stock || ''}
            onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input
            type="number"
            placeholder="预警库存"
            value={form.minStock || ''}
            onChange={e => setForm({ ...form, minStock: parseInt(e.target.value) || 0 })}
            required
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#4ade80', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {editingId ? '保存' : '添加'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} style={{ padding: '8px 16px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              取消
            </button>
          )}
        </form>
      </div>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
              <th style={{ textAlign: 'left', padding: 12 }}>名称</th>
              <th style={{ textAlign: 'right', padding: 12 }}>单价</th>
              <th style={{ textAlign: 'right', padding: 12 }}>库存</th>
              <th style={{ textAlign: 'right', padding: 12 }}>预警库存</th>
              <th style={{ textAlign: 'center', padding: 12 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{product.id}</td>
                <td style={{ padding: 12 }}>{product.name}</td>
                <td style={{ textAlign: 'right', padding: 12 }}>¥{product.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: 12, color: product.stock < product.minStock ? '#ef4444' : 'inherit' }}>
                  {product.stock}
                </td>
                <td style={{ textAlign: 'right', padding: 12 }}>{product.minStock}</td>
                <td style={{ textAlign: 'center', padding: 12 }}>
                  <button onClick={() => handleEdit(product)} style={{ marginRight: 8, padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    编辑
                  </button>
                  <button onClick={() => handleDelete(product.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{ textAlign: 'center', color: '#666', padding: 24 }}>暂无商品</p>}
      </div>
    </div>
  );
}
