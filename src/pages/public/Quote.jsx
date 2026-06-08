import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuote } from '../../contexts/QuoteContext'
import { ClipboardList, Minus, Plus, Trash2, Send, ShoppingCart } from 'lucide-react'

const categories = ['Controladores', 'Sensores', 'Variadores', 'HMI', 'Cableado', 'Fuentes']

function Quote() {
  const { items, removeItem, updateQuantity, clearQuote, totalItems } = useQuote()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    empresa: '',
    contacto: '',
    telefono: '',
    email: '',
    notas: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    clearQuote()
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-black mb-4 uppercase tracking-wide">
            Cotización enviada
          </h1>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            Hemos recibido tu solicitud de cotización. Nuestro equipo te contactará pronto con los precios y disponibilidad.
          </p>
          <Link
            to="/productos"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Seguir explorando
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="w-10 h-10 text-neutral-300" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-black mb-3 uppercase tracking-wide">
            Lista de cotización vacía
          </h1>
          <p className="text-neutral-500 mb-8 max-w-md mx-auto">
            Explora nuestro catálogo y agrega productos para solicitar una cotización personalizada.
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors mb-12"
          >
            <ShoppingCart className="w-4 h-4" />
            Explorar catálogo
          </Link>

          <div className="border-t border-neutral-100 pt-10">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-5">
              Explora por categoría
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/productos?categoria=${cat.toLowerCase()}`}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-black uppercase tracking-wide">
            Solicitar cotización
          </h1>
          <p className="text-neutral-500 mt-2">
            {totalItems} producto{totalItems !== 1 ? 's' : ''} seleccionado{totalItems !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/productos"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Agregar más productos
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-center gap-4"
              >
                <div className="bg-neutral-100 rounded-xl w-16 h-16 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/productos/${item.id}`}
                    className="font-heading text-sm font-bold text-black hover:text-neutral-500 transition-colors uppercase tracking-wide"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-neutral-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <Link
              to="/productos"
              className="sm:hidden flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors py-3 border border-dashed border-neutral-200 rounded-2xl"
            >
              <ShoppingCart className="w-4 h-4" />
              Agregar más productos
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-fit space-y-5">
            <h2 className="font-heading text-lg font-bold text-black uppercase tracking-wide">
              Tus datos
            </h2>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Empresa *</label>
              <input
                type="text"
                name="empresa"
                required
                value={form.empresa}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Contacto *</label>
              <input
                type="text"
                name="contacto"
                required
                value={form.contacto}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                required
                value={form.telefono}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 mb-1">Notas</label>
              <textarea
                name="notas"
                rows={3}
                value={form.notas}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Quote
