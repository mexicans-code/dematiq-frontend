import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Cpu, Activity, Zap, Monitor, Cable, Battery, Shield, Truck, Clock, Headphones, ClipboardList } from 'lucide-react'
import { productsApi } from '../../services/api'

const categoryData = [
  { name: 'Controladores', count: 120, icon: Cpu },
  { name: 'Sensores', count: 85, icon: Activity },
  { name: 'Variadores', count: 60, icon: Zap },
  { name: 'HMI / Pantallas', count: 45, icon: Monitor },
  { name: 'Cableado', count: 200, icon: Cable },
  { name: 'Fuentes de Poder', count: 75, icon: Battery },
]

const stats = [
  { value: '3,200+', label: 'Productos' },
  { value: '850+', label: 'Clientes' },
  { value: '99.5%', label: 'Disponibilidad' },
  { value: '24h', label: 'Envío' },
]

const benefits = [
  { icon: Shield, title: 'Calidad Garantizada', desc: 'Productos originales con certificación' },
  { icon: Truck, title: 'Envío Rápido', desc: 'Entrega en 24 horas hábiles' },
  { icon: Headphones, title: 'Soporte Técnico', desc: 'Ingenieros listos para ayudarte' },
  { icon: Clock, title: 'Stock Permanente', desc: 'Más de 3,200 productos en inventario' },
]

function Home() {
  const [search, setSearch] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    productsApi.getAll().then((products) => {
      setFeaturedProducts(products.slice(0, 4))
    }).catch(console.error)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/productos?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <div>
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">
                  Automatización industrial
                </span>
                <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight uppercase">
                  Partes PLC
                  <br />
                  <span className="text-white/70">y control</span>
                </h1>
              </div>
              <p className="text-lg text-white/60 max-w-md leading-relaxed">
              Los mejores productos para automatización, control y mantenimiento industrial. Equipos de alta calidad con la mejor relación precio-rendimiento.
              </p>

              <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar productos industriales..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary-300 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors whitespace-nowrap"
                >
                  Buscar
                </button>
              </form>

              <div className="flex gap-6 pt-4">
                <Link
                  to="/productos"
                  className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                  Explorar catálogo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                <div className="absolute inset-4 border border-white/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Cpu className="w-24 h-24 mx-auto text-white/30" />
                    <p className="text-white/40 text-sm uppercase tracking-widest">Dematiq</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-black">{stat.value}</p>
                <p className="text-sm text-neutral-500 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Categorías</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-black mt-2 uppercase">Explora por categoría</h2>
            <p className="text-neutral-500 mt-3 max-w-md mx-auto">Encuentra el componente que necesitas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryData.slice(0, 6).map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  to="/productos"
                  className="group relative bg-neutral-50 rounded-2xl p-8 hover:bg-primary-500 hover:text-white transition-all duration-300 text-center"
                >
                  <Icon className="w-10 h-10 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-heading text-lg font-bold mb-1 uppercase tracking-wide">{cat.name}</h3>
                  <p className="text-sm text-neutral-400 group-hover:text-white/60 transition-colors">{cat.count} productos</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Destacados</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-black mt-2 uppercase">Productos destacados</h2>
            </div>
            <Link to="/productos" className="hidden sm:flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-500 transition-colors">
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/productos/${product.id}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-neutral-100 h-56 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {product.category}
                  </p>
                  <h3 className="font-heading text-lg font-bold text-neutral-800 group-hover:text-black transition-colors uppercase tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-extrabold text-black">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link to="/productos" className="inline-flex items-center gap-1 text-sm font-medium text-black hover:text-neutral-500 transition-colors">
              Ver todos los productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Por qué elegirnos</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-black mt-2 uppercase">Ventajas Dematiq</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="text-center p-6">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-black mb-1 uppercase tracking-wide">{b.title}</h3>
                  <p className="text-sm text-neutral-500">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Contacto</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-2 uppercase">¿Necesitas asesoría?</h2>
          <p className="text-white/60 mt-3 max-w-md mx-auto">
            Habla con nuestro equipo de ingenieros para encontrar la solución que necesitas.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link
              to="/cotizar"
              className="flex-1 px-8 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-5 h-5" />
              Solicitar cotización
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
