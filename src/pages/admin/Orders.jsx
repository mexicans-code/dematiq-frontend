import { useState, useEffect } from 'react'
import { X, ChevronDown, RefreshCw } from 'lucide-react'
import { ordersApi } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

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

const nextStatuses = {
  pending: ['processing', 'cancelled'],
  processing: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
}

const filterStatuses = ['Todas', 'pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled']

function OrderDetail({ order, onClose, onStatusChange, onReverify }) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-black dark:text-white uppercase tracking-wide">
            Orden {order.order_id}
          </h2>
          <button onClick={onClose} className="p-1 text-neutral-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors" aria-label="Cerrar detalle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-400 dark:text-gray-500">Cliente</span>
              <p className="font-medium text-black dark:text-white mt-0.5">{order.customer}</p>
            </div>
            <div>
              <span className="text-neutral-400 dark:text-gray-500">Email</span>
              <p className="font-medium text-black dark:text-white mt-0.5">{order.customer_email}</p>
            </div>
            <div>
              <span className="text-neutral-400 dark:text-gray-500">Fecha</span>
              <p className="font-medium text-black dark:text-white mt-0.5">{new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <span className="text-neutral-400 dark:text-gray-500">Estado actual</span>
              <p className="mt-0.5">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBgColors[order.status] || 'bg-neutral-100 dark:bg-gray-700'} ${statusColors[order.status] || 'text-neutral-600 dark:text-gray-300'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </p>
            </div>
          </div>

          {order.notes && (
            <div>
              <span className="text-sm text-neutral-400 dark:text-gray-500">Notas</span>
              <p className="text-sm text-neutral-700 dark:text-gray-300 mt-0.5">{order.notes}</p>
            </div>
          )}

          {order.shipping_address && (
            <div>
              <h3 className="font-heading text-sm font-bold text-black dark:text-white uppercase tracking-wide mb-2">Dirección de envío</h3>
              <div className="text-sm text-neutral-600 dark:text-gray-300 space-y-0.5 bg-neutral-50 dark:bg-gray-700 rounded-xl p-3">
                {order.shipping_address.street && <p>{order.shipping_address.street}</p>}
                {(order.shipping_address.city || order.shipping_address.state) && (
                  <p>{[order.shipping_address.city, order.shipping_address.state].filter(Boolean).join(', ')}</p>
                )}
                <p>{order.shipping_address.zip}{order.shipping_address.country ? `, ${order.shipping_address.country}` : ''}</p>
                {order.shipping_address.contact_name && <p className="mt-1 text-neutral-400 dark:text-gray-500">Attn: {order.shipping_address.contact_name}</p>}
                {order.shipping_address.company_name && <p className="text-neutral-400 dark:text-gray-500">{order.shipping_address.company_name}</p>}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-heading text-sm font-bold text-black dark:text-white uppercase tracking-wide mb-3">Productos</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-gray-700">
                  <th className="text-left py-2 font-medium text-neutral-400 dark:text-gray-500">Producto</th>
                  <th className="text-center py-2 font-medium text-neutral-400 dark:text-gray-500">Cantidad</th>
                  <th className="text-right py-2 font-medium text-neutral-400 dark:text-gray-500">Precio unitario</th>
                  <th className="text-right py-2 font-medium text-neutral-400 dark:text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-50 dark:border-gray-700">
                    <td className="py-2 text-left text-neutral-700 dark:text-gray-200 font-medium">{item.product_name}</td>
                    <td className="py-2 text-center text-neutral-600 dark:text-gray-300">{item.quantity}</td>
                    <td className="py-2 text-right text-neutral-600 dark:text-gray-300">${Number(item.unit_price).toFixed(2)}</td>
                    <td className="py-2 text-right font-medium text-black dark:text-white">${(item.quantity * Number(item.unit_price)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right py-3 font-semibold text-neutral-700 dark:text-gray-300">Total</td>
                  <td className="text-right py-3 font-bold text-black dark:text-white">${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {nextStatuses[order.status]?.length > 0 && (
            <div className="border-t dark:border-gray-700 pt-4">
              <h3 className="font-heading text-sm font-bold text-black dark:text-white uppercase tracking-wide mb-3">Cambiar estado</h3>
              <div className="flex gap-2 flex-wrap">
                {nextStatuses[order.status].map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(order.id, s)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusBgColors[s]} ${statusColors[s]} hover:opacity-80`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {order.status === 'pending' && order.mp_order_id && (
            <div className="border-t dark:border-gray-700 pt-4">
              <h3 className="font-heading text-sm font-bold text-black dark:text-white uppercase tracking-wide mb-3">Pago con Mercado Pago</h3>
              <button
                onClick={() => onReverify(order.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Verificar pago en MP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Orders() {
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('Todas')
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    ordersApi.getAll()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await ordersApi.updateStatus(id, status)
      setDetail(null)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleReverify = async (orderId) => {
    try {
      setDetail(null)
      const res = await fetch(`${API_URL}/payments/reverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Error al verificar el pago')
      } else {
        const msg = data.data?.status === 'approved'
          ? 'Pago aprobado — La orden se actualizó a Confirmado'
          : `Pago verificado: ${data.data?.status || 'Desconocido'}`
        toast.success(msg)
      }
      load()
    } catch (err) {
      toast.error('Error al conectar con el servidor: ' + err.message)
    }
  }

  const filtered = filter === 'Todas'
    ? orders
    : orders.filter((o) => o.status === filter)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-black dark:text-white mb-6 uppercase tracking-wide">Ordenes</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filterStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-black dark:bg-gray-600 text-white'
                : 'bg-white dark:bg-gray-800 text-neutral-600 dark:text-gray-300 border border-neutral-200 dark:border-gray-600 hover:border-black dark:hover:border-white'
            }`}
          >
            {s === 'Todas' ? 'Todas' : statusLabels[s] || s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800">
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Orden</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Items</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Total</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 dark:text-gray-500">Cargando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 dark:text-gray-500">No hay órdenes</td>
                </tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="border-b border-neutral-50 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-black dark:text-white">{order.order_id}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-gray-300">{order.customer}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-gray-300">{order.itemCount}</td>
                  <td className="py-3 px-4 font-medium text-black dark:text-white">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-neutral-400 dark:text-gray-500">{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBgColors[order.status] || 'bg-neutral-100 dark:bg-gray-700'} ${statusColors[order.status] || 'text-neutral-600 dark:text-gray-300'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setDetail(order)} className="text-black dark:text-white hover:text-neutral-600 dark:hover:text-gray-400 font-medium text-xs">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <OrderDetail
          order={detail}
          onClose={() => setDetail(null)}
          onStatusChange={handleStatusChange}
          onReverify={handleReverify}
        />
      )}
    </div>
  )
}

export default Orders
