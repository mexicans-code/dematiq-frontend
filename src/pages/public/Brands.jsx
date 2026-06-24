import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Search } from 'lucide-react'
import { brandsApi } from '../../services/api'

function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    brandsApi.getAll({ status: 'active' })
      .then(setBrands)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl text-neutral-900 dark:text-white font-medium tracking-tight">Marcas</h1>
        <p className="text-neutral-400 dark:text-gray-500 text-sm mt-2">
          Trabajamos con las mejores marcas del sector industrial
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-neutral-50 dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
              <div className="h-32 bg-neutral-200 dark:bg-gray-700" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-32 bg-neutral-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-neutral-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-3/4 bg-neutral-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-neutral-300 dark:text-gray-600" />
          </div>
          <p className="text-neutral-500 dark:text-gray-400 font-medium">No hay marcas disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              id={brand.slug || brand.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-100 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900 transition-shadow duration-300"
            >
              <div className="h-32 bg-neutral-50 dark:bg-gray-700 flex items-center justify-center p-6">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xl font-bold text-neutral-300 dark:text-gray-600">{brand.name}</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-black dark:text-white uppercase tracking-wide mb-2">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-sm text-neutral-600 dark:text-gray-300 leading-relaxed mb-4">
                    {brand.description}
                  </p>
                )}
                {brand.website_url && (
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visitar sitio web
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Brands
