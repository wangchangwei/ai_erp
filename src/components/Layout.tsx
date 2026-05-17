import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';

const navItems = [
  { path: '/', label: '首页', requiredPermission: null },
  { path: '/products', label: '商品', requiredPermission: 'product:read' },
  { path: '/suppliers', label: '供应商', requiredPermission: 'supplier:read' },
  { path: '/customers', label: '客户', requiredPermission: 'customer:read' },
  { path: '/purchase', label: '采购订单', requiredPermission: 'purchase:read' },
  { path: '/sales', label: '销售订单', requiredPermission: 'sales:read' },
  { path: '/inventory', label: '库存', requiredPermission: 'inventory:read' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hasPermission = useStore((state) => state.hasPermission);

  const visibleNavItems = navItems.filter(
    (item) => item.requiredPermission === null || hasPermission(item.requiredPermission)
  );

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
          {visibleNavItems.map(item => (
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
