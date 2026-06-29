import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuote } from '../../contexts/QuoteContext'
import { ClipboardList, Minus, Plus, Trash2, Send, ShoppingCart, Upload, Image as ImageIcon, Loader } from 'lucide-react'
import { quotationsApi } from '../../services/api'

function Quote() {
  const { items, removeItem, updateQuantity, clearQuote, totalItems, customProducts, addCustomProduct, removeCustomProduct } = useQuote()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    empresa: '',
    contacto: '',
    telefono: '',
    email: '',
    notas: '',
  })
  const [customProduct, setCustomProduct] = useState({ name: '', image: '' })
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!submitting) {
      setProgress(0)
      return
    }
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer)
          return 90
        }
        const increment = Math.max(1, Math.floor((90 - prev) / 10))
        return Math.min(90, prev + increment)
      })
    }, 400)
    return () => clearInterval(timer)
  }, [submitting])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const compressImage = (file, maxWidth = 200) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ratio = Math.min(maxWidth / img.width, 1)
          canvas.width = Math.round(img.width * ratio)
          canvas.height = Math.round(img.height * ratio)
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/jpeg', 0.6))
        }
        img.src = ev.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleCustomImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file)
    setCustomProduct((prev) => ({ ...prev, image: compressed }))
  }

  const handleAddCustomProduct = () => {
    if (!customProduct.name.trim()) return
    addCustomProduct({ name: customProduct.name.trim(), image: customProduct.image || null })
    setCustomProduct({ name: '', image: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await quotationsApi.send({
        ...form,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          image: i.image || null,
          sku: i.sku,
        })),
        customProducts: customProducts.map((p) => ({
          name: p.name,
          image: p.image || null,
        })),
      })
      clearQuote()
      setSubmitting(false)
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Error al enviar la cotización. Intenta de nuevo.')
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-black dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-black dark:text-white mb-4 uppercase tracking-wide">
            Cotización enviada
          </h1>
          <p className="text-neutral-500 dark:text-gray-400 mb-8 leading-relaxed">
            Hemos recibido tu solicitud de cotización. Nuestro equipo te contactará pronto con los precios y disponibilidad.
          </p>
          <Link
            to="/productos"
            className="inline-block bg-black dark:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-gray-500 transition-colors"
          >
            Seguir explorando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-black dark:text-white uppercase tracking-wide">
            Solicitar cotización
          </h1>
          <p className="text-neutral-500 dark:text-gray-400 mt-2">
            {items.length > 0
              ? `${totalItems} producto${totalItems !== 1 ? 's' : ''} seleccionado${totalItems !== 1 ? 's' : ''}`
              : 'Agrega productos del catálogo o personalizados'}
          </p>
        </div>
        <Link
          to="/productos"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Explorar catálogo
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 p-4 flex items-center gap-4"
                >
                  <div className="bg-neutral-100 dark:bg-gray-700 rounded-xl w-16 h-16 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/productos/${item.id}`}
                      className="font-heading text-sm font-bold text-black dark:text-white hover:text-neutral-500 dark:hover:text-gray-400 transition-colors uppercase tracking-wide"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-neutral-400 dark:text-gray-500 uppercase tracking-wider">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-neutral-200 dark:border-gray-600 rounded-lg">
                      <button
                        type="button"
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-neutral-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold dark:text-gray-200">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-neutral-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-neutral-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-neutral-300 dark:text-gray-600" />
                </div>
                <h2 className="font-heading text-xl font-bold text-black dark:text-white mb-2 uppercase tracking-wide">
                  Lista vacía
                </h2>
                <p className="text-sm text-neutral-500 dark:text-gray-400 max-w-sm mx-auto">
                  Aún no has agregado productos del catálogo. Puedes explorar o agregar un producto personalizado abajo.
                </p>
                <Link
                  to="/productos"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Explorar catálogo
                </Link>
              </div>
            )}

            <Link
              to="/productos"
              className="sm:hidden flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors py-3 border border-dashed border-neutral-200 dark:border-gray-600 rounded-2xl"
            >
              <ShoppingCart className="w-4 h-4" />
              Agregar más productos
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 p-5 space-y-4">
              <h3 className="font-heading text-sm font-bold text-black dark:text-white uppercase tracking-wide flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Producto personalizado
              </h3>
              <p className="text-xs text-neutral-400 dark:text-gray-500">
                ¿No encuentras el producto que buscas? Agrégalo manualmente para que te cotice.
              </p>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Nombre del producto *</label>
                <input
                  type="text"
                  value={customProduct.name}
                  onChange={(e) => setCustomProduct((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder='Ej: Válvula hidráulica 2"'
                  className="w-full border border-neutral-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Imagen del producto</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-200 dark:border-gray-600 rounded-lg text-sm text-neutral-400 dark:text-gray-500 hover:text-neutral-600 dark:hover:text-gray-300 hover:border-neutral-300 dark:hover:border-gray-500 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    {customProduct.image ? 'Cambiar imagen' : 'Subir imagen'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageUpload}
                      className="hidden"
                    />
                  </label>
                  {customProduct.image && (
                    <button
                      type="button"
                      onClick={() => setCustomProduct((prev) => ({ ...prev, image: '' }))}
                      className="p-2 text-neutral-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                      aria-label="Eliminar imagen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {customProduct.image && (
                  <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 dark:border-gray-600">
                    <img src={customProduct.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddCustomProduct}
                disabled={!customProduct.name.trim()}
                className="w-full bg-neutral-100 dark:bg-gray-700 text-neutral-700 dark:text-gray-200 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar producto
              </button>

              {customProducts.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-neutral-400 dark:text-gray-500 uppercase tracking-wider">
                    Productos agregados ({customProducts.length})
                  </p>
                  {customProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 bg-neutral-50 dark:bg-gray-700 rounded-xl p-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-gray-600 flex items-center justify-center shrink-0 overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-neutral-400 dark:text-gray-500" />
                        )}
                      </div>
                      <span className="flex-1 text-sm font-medium text-neutral-700 dark:text-gray-200 truncate">
                        {p.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCustomProduct(p.id)}
                        className="p-1.5 text-neutral-300 dark:text-gray-600 hover:text-red-500 transition-colors"
                        aria-label="Eliminar producto personalizado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-neutral-100 dark:border-gray-700 p-6 h-fit space-y-5">
            <h2 className="font-heading text-lg font-bold text-black dark:text-white uppercase tracking-wide">
              Tus datos
            </h2>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Empresa *</label>
              <input
                type="text"
                name="empresa"
                required
                value={form.empresa}
                onChange={handleChange}
                className="w-full border border-neutral-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Contacto *</label>
              <input
                type="text"
                name="contacto"
                required
                value={form.contacto}
                onChange={handleChange}
                className="w-full border border-neutral-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                required
                value={form.telefono}
                onChange={handleChange}
                className="w-full border border-neutral-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border border-neutral-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-gray-300 mb-1">Notas</label>
              <textarea
                name="notas"
                rows={3}
                value={form.notas}
                onChange={handleChange}
                className="w-full border border-neutral-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none bg-transparent dark:text-gray-200"
              />
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black dark:bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-gray-500 transition-colors disabled:bg-neutral-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </div>
      </form>

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center space-y-5">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-black dark:text-white uppercase tracking-wide">
                Enviando cotización
              </h3>
              <p className="text-sm text-neutral-500 dark:text-gray-400 mt-1">
                Estamos procesando tu solicitud...
              </p>
            </div>
            <div className="space-y-2">
              <div className="h-2.5 bg-neutral-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 dark:text-gray-500">
                Aproximadamente 5-10 segundos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Quote
