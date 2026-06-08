import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Store,
  Menu,
} from 'lucide-react'

const navLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/productos', label: 'Productos', icon: Package },
  { path: '/admin/ordenes', label: 'Ordenes', icon: ShoppingCart },
  { path: '/admin/usuarios', label: 'Usuarios', icon: Users },
]

function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-7 pt-10 pb-7">
        <Link
          to="/admin/dashboard"
          className="font-heading text-2xl font-bold uppercase tracking-wide text-white"
        >
          Dematiq
        </Link>
        <span className="block mt-1 text-neutral-500 text-xs uppercase tracking-widest">Panel de administración</span>
      </div>

      <div className="mx-5 border-t border-white/10" />

      <div className="px-7 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white text-sm font-bold uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-neutral-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-white/10" />

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-heading text-xs font-semibold uppercase tracking-widest">
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="mx-5 border-t border-white/10" />

      <div className="px-4 py-5 space-y-1.5">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <Store className="w-5 h-5" />
          <span className="font-heading text-xs font-semibold uppercase tracking-widest">Tienda</span>
        </Link>
        <button
          onClick={() => { logout(); onClose?.() }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-500 hover:text-red-400 hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-heading text-xs font-semibold uppercase tracking-widest">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-black z-40">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-black z-50 shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black flex items-center justify-between px-4 z-30">
        <Link to="/admin/dashboard" className="font-heading text-lg font-bold uppercase tracking-wide text-white">
          Dematiq
        </Link>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-white">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="md:pl-64 pt-14 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
