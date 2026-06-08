import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react'

function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
        <h1 className="font-heading text-3xl font-bold text-black mb-2 uppercase tracking-wide">Tu carrito está vacío</h1>
        <p className="text-neutral-400 mb-8">Agrega productos para comenzar a cotizar</p>
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Ver productos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-4xl font-bold text-black mb-8 uppercase tracking-wide">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-center gap-4"
            >
              <div className="bg-neutral-100 rounded-xl w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/productos/${item.id}`}
                  className="font-heading font-bold text-neutral-800 hover:text-black transition-colors uppercase tracking-wide"
                >
                  {item.name}
                </Link>
                <p className="text-black font-bold mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-neutral-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors mt-1 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-fit">
          <h2 className="font-heading text-lg font-bold text-black mb-4 uppercase tracking-wide">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Envío</span>
              <span>Grátis</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-neutral-800 text-base">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors mt-6"
          >
            Proceder al pago <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
