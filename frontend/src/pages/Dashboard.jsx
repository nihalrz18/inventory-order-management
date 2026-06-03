import { useEffect, useState } from 'react'
import { getDashboard } from '../api/endpoints'
import StatCard from '../components/StatCard'
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20 text-gray-400">Loading...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={data.total_products} icon={Package} color="indigo" />
        <StatCard label="Total Customers" value={data.total_customers} icon={Users} color="green" />
        <StatCard label="Total Orders" value={data.total_orders} icon={ShoppingCart} color="blue" />
        <StatCard label="Low Stock Items" value={data.low_stock_products.length} icon={AlertTriangle} color="red" />
      </div>

      {data.low_stock_products.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} /> Low Stock Products (≤10)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4">Name</th>
                  <th className="pb-2 pr-4">SKU</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2">Qty</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock_products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{p.sku}</td>
                    <td className="py-2 pr-4">${p.price.toFixed(2)}</td>
                    <td className="py-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        {p.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
