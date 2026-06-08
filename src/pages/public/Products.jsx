import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useQuote } from '../../contexts/QuoteContext'
import { Search, ShoppingCart, ClipboardList, Check, ChevronDown } from 'lucide-react'
import { productsApi } from '../../services/api'

const categories = ['Todas', 'Controladores', 'Sensores', 'Variadores', 'HMI', 'Cableado', 'Fuentes']

function Products() {
  const { addItem } = useCart()
  const { addItem: addQuote } = useQuote()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [recentlyAdded, setRecentlyAdded] = useState(null)
  const [recentlyAddedQuote, setRecentlyAddedQuote] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearchTerm(q)
  }, [searchParams])

  useEffect(() => {
    if (recentlyAdded) {
      const timer = setTimeout(() => setRecentlyAdded(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [recentlyAdded])

  useEffect(() => {
    if (recentlyAddedQuote) {
      const timer = setTimeout(() => setRecentlyAddedQuote(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [recentlyAddedQuote])

  useEffect(() => {
    productsApi.getAll().then(setProducts).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setRecentlyAdded(product.id)
  }

  const handleAddToQuote = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    addQuote(product, 1)
    setRecentlyAddedQuote(product.id)
  }

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === 'Todas' || p.category === selectedCategory
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl text-neutral-900 font-medium tracking-tight">Catálogo</h1>
          <p className="text-neutral-400 text-sm mt-1">{filtered.length} productos encontrados</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-56 pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-colors"
          />
        </div>
      </div>

      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm border border-neutral-200 rounded-lg text-neutral-600"
        >
          Categorías
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-neutral-50 rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-neutral-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-neutral-200 rounded" />
                <div className="h-4 w-32 bg-neutral-200 rounded" />
                <div className="h-5 w-20 bg-neutral-200 rounded" />
                <div className="h-9 w-full bg-neutral-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((product, index) => (
            <Link
              key={product.id}
              to={`/productos/${product.id}`}
              className="group bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-md hover:border-neutral-200 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-neutral-50 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold text-neutral-800 leading-snug mb-2 group-hover:text-neutral-900 transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-neutral-900 mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      recentlyAdded === product.id
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
                    }`}
                  >
                    {recentlyAdded === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Carrito
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => handleAddToQuote(product, e)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      recentlyAddedQuote === product.id
                        ? 'bg-green-600 text-white'
                        : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-400 active:scale-[0.98]'
                    }`}
                  >
                    {recentlyAddedQuote === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Agregado
                      </>
                    ) : (
                      <>
                        <ClipboardList className="w-3.5 h-3.5" />
                        Cotizar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-neutral-300" />
          </div>
          <p className="text-neutral-500 font-medium">No encontramos productos</p>
          <p className="text-neutral-400 text-sm mt-1">Intenta con otros filtros o búsqueda</p>
        </div>
      )}
    </div>
  )
}

export default Products
