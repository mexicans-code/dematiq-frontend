import { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [count, setCount] = useState(5)

  const orderId = searchParams.get('order_id')
  const paymentId = searchParams.get('payment_id')

  useEffect(() => {
    if (paymentId) {
      fetch(`${API_URL}/payments/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId, order_id: orderId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.data?.status === 'approved' ? 'approved' : 'pending')
        })
        .catch(() => setStatus('error'))
    } else {
      setStatus('approved')
    }
  }, [paymentId, orderId])

  useEffect(() => {
    if (status !== 'verifying' && count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (status !== 'verifying' && count === 0) {
      navigate('/')
    }
  }, [status, count, navigate])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="max-w-md mx-auto">
        {status === 'verifying' ? (
          <>
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-black uppercase tracking-wide mb-2">
              Verificando pago...
            </h1>
            <p className="text-neutral-500">Espera un momento mientras confirmamos tu pago.</p>
          </>
        ) : status === 'approved' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-black uppercase tracking-wide mb-2">
              Pago exitoso
            </h1>
            <p className="text-neutral-500 mb-2">
              Tu orden{orderId ? ` #${orderId}` : ''} ha sido confirmada.
            </p>
            <p className="text-sm text-neutral-400 mb-8">
              Recibirás un correo con los detalles de tu compra.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Seguir comprando <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-black uppercase tracking-wide mb-2">
              Pago pendiente
            </h1>
            <p className="text-neutral-500 mb-8">
              El pago está en proceso. Te notificaremos cuando se confirme.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Volver a la tienda <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}

        {status !== 'verifying' && (
          <p className="text-xs text-neutral-400 mt-4">
            Redirigiendo al inicio en {count} segundos...
          </p>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess
