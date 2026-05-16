import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Products } from './pages/Products'
import { Suppliers } from './pages/Suppliers'
import { Customers } from './pages/Customers'
import { Purchase } from './pages/Purchase'
import { Sales } from './pages/Sales'
import { Inventory } from './pages/Inventory'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Layout>
  )
}

export default App
