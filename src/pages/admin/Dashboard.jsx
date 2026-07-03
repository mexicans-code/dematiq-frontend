import { useState, useEffect } from 'react'
import { DollarSign, Package, Users, Clock, TrendingUp, ShoppingBag, RefreshCw } from 'lucide-react'
import { productsApi, ordersApi, usersApi } from '../../services/api'

const statusLabels = {
  pending: 'Pendiente',
  processing: 'Procesando',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const statusColors = {
  pending: 'text-amber-600',
  processing: 'text-blue-600',
  confirmed: 'text-indigo-600',
  shipped: 'text-purple-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
}

const statusBgColors = {
  pending: 'bg-amber-100',
  processing: 'bg-blue-100',
  confirmed: 'bg-indigo-100',
  shipped: 'bg-purple-100',
  delivered: 'bg-green-100',
  cancelled: 'bg-red-100',
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productsApi.getAll(),
      ordersApi.getAll({ limit: 100 }),
      usersApi.getAll(),
    ]).then(([products, result, users]) => {
      const allOrders = Array.isArray(result) ? result : result.orders
      const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0)
      const pendingOrders = allOrders.filter((o) => o.status === 'pending' || o.status === 'processing')
      setStats({
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
        pendingOrders: pendingOrders.length,
      })
      setRecentOrders(allOrders.slice(0, 5))
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Ventas totales', value: `$${(stats.totalRevenue ?? 0).toFixed(2)}`, change: '+0%', positive: true, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Productos', value: String(stats.totalProducts), change: 'Total', positive: true, icon: Package, color: 'bg-blue-500' },
    { label: 'Usuarios', value: String(stats.totalUsers), change: 'Registrados', positive: true, icon: Users, color: 'bg-purple-500' },
    { label: 'Ordenes pendientes', value: String(stats.pendingOrders), change: 'Pendientes', positive: false, icon: Clock, color: 'bg-amber-500' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-black dark:text-white uppercase tracking-wide">Dashboard</h1>
          <p className="text-neutral-500 dark:text-gray-400 text-sm mt-1">Resumen general del {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4" />
          <span>Actualizado ahora</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900 transition-shadow">
              <div className={`h-1 ${stat.color}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-400 dark:text-gray-500 font-medium">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon className={`w-4 h-4 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-black dark:text-white">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">{stat.change}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-black dark:text-white uppercase tracking-wide">Ordenes recientes</h2>
          <ShoppingBag className="w-5 h-5 text-neutral-400 dark:text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-50 dark:border-gray-700">
                <th className="text-left py-3.5 px-6 font-semibold text-neutral-400 dark:text-gray-500 text-xs uppercase tracking-wider">Orden</th>
                <th className="text-left py-3.5 px-6 font-semibold text-neutral-400 dark:text-gray-500 text-xs uppercase tracking-wider">Cliente</th>
                <th className="text-left py-3.5 px-6 font-semibold text-neutral-400 dark:text-gray-500 text-xs uppercase tracking-wider">Items</th>
                <th className="text-left py-3.5 px-6 font-semibold text-neutral-400 dark:text-gray-500 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left py-3.5 px-6 font-semibold text-neutral-400 dark:text-gray-500 text-xs uppercase tracking-wider">Fecha</th>
                <th className="text-left py-3.5 px-6 font-semibold text-neutral-400 dark:text-gray-500 text-xs uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-gray-500">No hay órdenes recientes</td>
                </tr>
              )}
              {recentOrders.map((order, i) => (
                <tr key={order.id} className={`${i !== recentOrders.length - 1 ? 'border-b border-neutral-50 dark:border-gray-700' : ''} hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors`}>
                  <td className="py-3.5 px-6 font-medium text-black dark:text-white">{order.order_id}</td>
                  <td className="py-3.5 px-6 text-neutral-600 dark:text-gray-300">{order.customer}</td>
                  <td className="py-3.5 px-6 text-neutral-600 dark:text-gray-300">{order.itemCount}</td>
                  <td className="py-3.5 px-6 font-medium text-black dark:text-white">${order.total.toFixed(2)}</td>
                  <td className="py-3.5 px-6 text-neutral-400 dark:text-gray-500">{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBgColors[order.status] || 'bg-neutral-100 dark:bg-gray-700'} ${statusColors[order.status] || 'text-neutral-600 dark:text-gray-300'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
