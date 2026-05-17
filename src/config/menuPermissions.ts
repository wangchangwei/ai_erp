export interface MenuPermission {
  menuKey: string;
  requiredPermission: string;
}

export const menuPermissions: MenuPermission[] = [
  { menuKey: '/products', requiredPermission: 'product:read' },
  { menuKey: '/suppliers', requiredPermission: 'supplier:read' },
  { menuKey: '/customers', requiredPermission: 'customer:read' },
  { menuKey: '/purchase', requiredPermission: 'purchase:read' },
  { menuKey: '/sales', requiredPermission: 'sales:read' },
  { menuKey: '/inventory', requiredPermission: 'inventory:read' },
];
