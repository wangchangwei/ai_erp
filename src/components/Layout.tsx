import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/products', label: '商品' },
  { path: '/suppliers', label: '供应商' },
  { path: '/customers', label: '客户' },
  { path: '/purchase', label: '采购订单' },
  { path: '/sales', label: '销售订单' },
  { path: '/inventory', label: '库存' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: 200,
        background: '#1a1a2e',
        color: 'white',
        padding: '20px 0'
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #333', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>AI ERP</h2>
          <small style={{ color: '#888' }}>进销存 Demo</small>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  color: location.pathname === item.path ? '#4ade80' : '#ccc',
                  textDecoration: 'none',
                  background: location.pathname === item.path ? '#2d2d44' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main style={{ flex: 1, padding: 24, background: '#f5f5f5' }}>
        {children}
      </main>
    </div>
  );
}
