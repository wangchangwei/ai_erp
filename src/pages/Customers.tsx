import { useState } from 'react';
import { useStore } from '../store';
import type { Customer } from '../types';

export function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', contact: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCustomer(editingId, form);
      setEditingId(null);
    } else {
      addCustomer(form);
    }
    setForm({ name: '', contact: '' });
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({ name: customer.name, contact: customer.contact });
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除该客户？')) {
      deleteCustomer(id);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>客户管理</h1>

      <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>{editingId ? '编辑客户' : '新增客户'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
          <input
            placeholder="客户名称"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input
            placeholder="联系电话"
            value={form.contact}
            onChange={e => setForm({ ...form, contact: e.target.value })}
            required
            style={{ width: 150, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#4ade80', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            {editingId ? '保存' : '添加'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', contact: '' }); }} style={{ padding: '8px 16px', background: '#9ca3af', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
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
              <th style={{ textAlign: 'left', padding: 12 }}>联系电话</th>
              <th style={{ textAlign: 'center', padding: 12 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{customer.id}</td>
                <td style={{ padding: 12 }}>{customer.name}</td>
                <td style={{ padding: 12 }}>{customer.contact}</td>
                <td style={{ textAlign: 'center', padding: 12 }}>
                  <button onClick={() => handleEdit(customer)} style={{ marginRight: 8, padding: '4px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    编辑
                  </button>
                  <button onClick={() => handleDelete(customer.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p style={{ textAlign: 'center', color: '#666', padding: 24 }}>暂无客户</p>}
      </div>
    </div>
  );
}
