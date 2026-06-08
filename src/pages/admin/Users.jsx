import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { usersApi } from '../../services/api'

function UserModal({ user, onClose, onSave }) {
  const isEditing = Boolean(user)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company_name: user?.company_name || '',
    rfc: user?.rfc || '',
    role: user?.role_raw || 'customer',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await usersApi.update(user.id, form)
      onSave()
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide">Editar usuario</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Empresa</label>
            <input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">RFC</label>
            <input type="text" value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black max-w-[13ch]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Rol</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
              <option value="customer">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-300">
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold text-neutral-600 border border-neutral-200 hover:bg-neutral-50 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Users() {
  const [users, setUsers] = useState([])
  const [editUser, setEditUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    usersApi.getAll()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await usersApi.delete(id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-black mb-6 uppercase tracking-wide">Usuarios</h1>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Email</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Empresa</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Teléfono</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">Cargando...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">No hay usuarios</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="py-3 px-4 font-medium text-black">{user.name}</td>
                  <td className="py-3 px-4 text-neutral-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600">{user.company_name || '-'}</td>
                  <td className="py-3 px-4 text-neutral-600">{user.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setEditUser(user)} className="text-black hover:text-neutral-600 font-medium text-xs">Editar</button>
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-600 font-medium text-xs">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && (
        <UserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={load}
        />
      )}
    </div>
  )
}

export default Users
