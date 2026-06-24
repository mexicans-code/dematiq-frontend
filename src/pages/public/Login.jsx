import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

import dematiq_logo from '../../assets/img/dematiq_login.png'

function Login() {
  const navigate = useNavigate()
  const toast = useToast()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-gray-900 border border-neutral-100 dark:border-gray-700 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-black dark:text-white uppercase tracking-wide">
              Bienvenido
            </h1>
            <p className="text-neutral-400 dark:text-gray-500 mt-2 text-sm">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="usuario@dematiq.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50 dark:bg-gray-700 dark:text-gray-200"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:bg-neutral-300 dark:disabled:bg-gray-600 tracking-wide"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 dark:text-gray-500 mt-8">
            ¿No tienes cuenta?{' '}
            <Link to="/registrarse" className="text-primary-500 hover:text-primary-600 font-semibold underline underline-offset-2">
              Registrarse
            </Link>
          </p>
        </div>

        <div className="relative hidden md:block min-h-[500px] bg-neutral-900">
          <img
            src={dematiq_logo}
            alt="Dematiq"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-500/70 via-primary-500/20 to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default Login
