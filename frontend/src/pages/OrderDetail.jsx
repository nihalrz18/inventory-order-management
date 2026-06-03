import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getOrder } from '../api/endpoints'
import { ArrowLeft } from 'lucide-react'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrder(id)
      .then((r) => setOrder(r.data))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/orders" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">{order.status}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-700">Customer</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Name:</span> {order.customer?.full_name}</p>
          <p><span className="font-medium">Email:</span> {order.customer?.email}</p>
          <p><span className="font-medium">Phone:</span> {order.customer?.phone || '—'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-700">Items</h3>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left border-b">
            <tr>
              <th className="pb-2">Product</th>
              <th className="pb-2">SKU</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Unit Price</th>
              <th className="pb-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-2 pr-3 font-medium">{item.product?.name}</td>
                <td className="py-2 pr-3 text-gray-400">{item.product?.sku}</td>
                <td className="py-2 pr-3">{item.quantity}</td>
                <td className="py-2 pr-3">${item.unit_price.toFixed(2)}</td>
                <td className="py-2 text-right font-semibold">${(item.quantity * item.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end pt-2 border-t">
          <span className="text-lg font-bold">Total: ${order.total_amount.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Placed on {new Date(order.created_at).toLocaleString()}
      </p>
    </div>
  )
}
