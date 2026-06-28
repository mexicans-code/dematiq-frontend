import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { User, Save, Loader2 } from 'lucide-react'

function Profile() {
  const toast = useToast()
  const { user, loading: authLoading, updateProfile, changePassword } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)

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
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-black dark:text-white uppercase tracking-wide">
              Mi perfil
            </h1>
            <p className="text-neutral-400 dark:text-gray-500 text-sm mt-0.5">
              Administra tu información personal
            </p>
          </div>
        </div>

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
      </div>
    </div>
  )
}

export default Profile