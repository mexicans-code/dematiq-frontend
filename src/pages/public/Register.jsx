import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import dematiq_register from '../../assets/img/dematiq_register.png'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)




  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const result = await register({ name: form.name, email: form.email, password: form.password })
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
  }
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-neutral-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-black uppercase tracking-wide">
              Crear cuenta
            </h1>
            <p className="text-neutral-400 mt-2 text-sm">
              Únete a la comunidad Dematiq
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-neutral-50"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-all disabled:bg-neutral-300 tracking-wide"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-8">
            ¿Ya tienes cuenta?{' '}
            <Link to="/iniciar-sesion" className="text-primary-500 hover:text-primary-600 font-semibold underline underline-offset-2">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <div className="relative hidden md:block min-h-[500px] bg-neutral-900 order-1 md:order-2">
          <img
            src={dematiq_register}
            alt="Dematiq"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-500/70 via-primary-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="font-heading text-2xl text-white uppercase tracking-wide">
              Dematiq
            </h2>
            <p className="text-white/70 text-sm mt-1">
              Partes PLC y automatización industrial. Calidad certificada para la industria.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
