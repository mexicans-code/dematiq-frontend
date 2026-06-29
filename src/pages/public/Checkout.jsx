import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { ordersApi, paymentsApi } from '../../services/api'
import { CreditCard, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react'

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    company: '',
    contact: '',
    address: '',
    city: '',
    zip: '',
    notes: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Debes iniciar sesión para realizar un pedido')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const order = await ordersApi.create({
        user_id: user.id,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          company: form.company,
          contact: form.contact,
          street: form.address,
          city: form.city,
          zip: form.zip,
        },
        notes: form.notes || undefined,
      })

      const data = await paymentsApi.createPreference(order.id)
      clearCart()
      window.location.href = data.init_point
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    navigate('/carrito')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-bold text-black mb-8 uppercase tracking-wide">Checkout</h1>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Debes <a href="/iniciar-sesion" className="underline font-semibold">iniciar sesión</a> para completar tu pedido
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-100 p-6">
            <h2 className="font-heading text-lg font-bold text-black mb-4 uppercase tracking-wide">Información de envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Empresa</label>
                <input type="text" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Contacto</label>
                <input type="text" required value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Dirección</label>
                <input type="text" required value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Ciudad</label>
                <input type="text" required value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Código postal</label>
                <input type="text" required value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Notas del pedido</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-6">
            <h2 className="font-heading text-lg font-bold text-black mb-4 uppercase tracking-wide">Método de pago</h2>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center gap-3">
                <ExternalLink className="w-6 h-6 text-primary-500" />
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Mercado Pago</p>
                  <p className="text-xs text-neutral-500">Paga con tarjeta, transferencia o efectivo</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !user}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {submitting ? 'Redirigiendo a Mercado Pago...' : `Pagar $${(totalPrice * 1.16).toFixed(2)} con Mercado Pago`}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-fit">
          <h2 className="font-heading text-lg font-bold text-black mb-4 uppercase tracking-wide">Resumen</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-600 truncate">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-neutral-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-neutral-600 text-sm mb-1">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-sm mb-1">
              <span>IVA (16%)</span>
              <span>${(totalPrice * 0.16).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 text-sm mb-1">
              <span>Envío</span>
              <span>Grátis</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-800 text-lg mt-2">
              <span>Total</span>
              <span>${(totalPrice * 1.16).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout
