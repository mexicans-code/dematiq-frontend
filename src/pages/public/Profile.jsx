import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { ordersApi } from '../../services/api'
import { User, Save, Loader2, X, Package, Eye } from 'lucide-react'

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

function OrderDetailModal({ order, onClose }) {
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
              <span className="text-neutral-400 dark:text-gray-500">Fecha</span>
              <p className="font-medium text-black dark:text-white mt-0.5">{new Date(order.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <span className="text-neutral-400 dark:text-gray-500">Estado</span>
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
        </div>
      </div>
    </div>
  )
}

function Profile() {
  const toast = useToast()
  const { user, loading: authLoading, updateProfile, changePassword } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('perfil')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    setOrdersLoading(true)
    ordersApi.getAll({ page, limit: 10 })
      .then((res) => {
        setOrders(res.orders)
        setPagination(res.pagination)
      })
      .catch(console.error)
      .finally(() => setOrdersLoading(false))
  }, [page])

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/iniciar-sesion" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const result = await updateProfile({ name: form.name, email: form.email })
    setSaving(false)
    if (result.success) {
      toast.success('Cambios guardados exitosamente')
    } else {
      toast.error(result.error || 'Error al guardar')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (passwordForm.newPass.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setSaving(true)
    const result = await changePassword(passwordForm.current, passwordForm.newPass)
    setSaving(false)
    if (result.success) {
      setPasswordForm({ current: '', newPass: '', confirm: '' })
      toast.success('Contraseña actualizada exitosamente')
    } else {
      toast.error(result.error || 'Error al cambiar contraseña')
    }
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-black dark:text-white uppercase tracking-wide">
              Mi cuenta
            </h1>
            <p className="text-neutral-400 dark:text-gray-500 text-sm mt-0.5">
              {tab === 'perfil' ? 'Administra tu información personal' : 'Historial de tus compras'}
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-neutral-100 dark:border-gray-700">
          <button
            onClick={() => setTab('perfil')}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === 'perfil'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Mi Perfil
          </button>
          <button
            onClick={() => setTab('pedidos')}
            className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === 'pedidos'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-neutral-400 dark:text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Mis Pedidos
          </button>
        </div>

        {tab === 'perfil' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-black dark:text-white uppercase tracking-wide mb-6">
                Información personal
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:bg-neutral-300 dark:disabled:bg-gray-600 active:scale-[0.98]"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Guardar cambios
                </button>
              </div>
            </form>

            <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-black dark:text-white uppercase tracking-wide mb-6">
                Cambiar contraseña
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1.5">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1.5">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1.5">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-gray-700">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-gray-600 hover:bg-neutral-800 dark:hover:bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  Actualizar contraseña
                </button>
              </div>
            </form>
          </div>
        )}

        {tab === 'pedidos' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800">
                    <th className="text-left py-3 px-4 sm:px-6 font-medium text-neutral-400 dark:text-gray-500">Orden</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-400 dark:text-gray-500">Cargando pedidos...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-neutral-400 dark:text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        No tienes pedidos aún
                      </td>
                    </tr>
                  ) : orders.map((order) => (
                    <tr key={order.id} className="border-b border-neutral-50 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 sm:px-6 font-medium text-black dark:text-white">{order.order_id}</td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-gray-300">{order.itemCount}</td>
                      <td className="py-3 px-4 font-medium text-black dark:text-white">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4 text-neutral-400 dark:text-gray-500">{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBgColors[order.status] || 'bg-neutral-100 dark:bg-gray-700'} ${statusColors[order.status] || 'text-neutral-600 dark:text-gray-300'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-1 text-black dark:text-white hover:text-neutral-600 dark:hover:text-gray-400 font-medium text-xs" aria-label="Ver detalle del pedido">
                          <Eye className="w-3.5 h-3.5" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-neutral-100 dark:border-gray-700">
                <p className="text-sm text-neutral-400 dark:text-gray-500">
                  Página {pagination.page} de {pagination.pages} ({pagination.total} pedidos)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-200 dark:border-gray-600 text-neutral-600 dark:text-gray-300 hover:border-black dark:hover:border-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page >= pagination.pages}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-200 dark:border-gray-600 text-neutral-600 dark:text-gray-300 hover:border-black dark:hover:border-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

export default Profile