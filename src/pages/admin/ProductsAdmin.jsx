import { useState, useEffect } from 'react'
import { Plus, X, Search } from 'lucide-react'
import { productsApi, categoriesApi } from '../../services/api'

const statusLabels = { active: 'Activo', inactive: 'Inactivo' }

function ProductModal({ product, categories, onClose, onSave }) {
  const isEditing = Boolean(product)
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category_id: product?.category_id || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    description: product?.description || '',
    image_url: product?.image_url || '',
    specs: product?.specs ? JSON.stringify(product.specs, null, 2) : '[]',
    status: product?.status || 'active',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let specs
      try { specs = JSON.parse(form.specs) } catch { specs = [] }
      const payload = {
        name: form.name,
        sku: form.sku,
        category_id: form.category_id ? Number(form.category_id) : null,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        description: form.description,
        image_url: form.image_url || null,
        specs,
        status: form.status,
      }
      const saved = isEditing
        ? await productsApi.update(product.id, payload)
        : await productsApi.create(payload)
      onSave(saved)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-black uppercase tracking-wide">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-black transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre del producto</label>
              <input type="text" name="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">SKU</label>
              <input type="text" name="sku" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría</label>
              <select name="category_id" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Precio</label>
              <input type="number" name="price" required step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Stock</label>
              <input type="number" name="stock" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Estado</label>
              <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">URL de imagen</label>
              <input type="url" name="image_url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción</label>
              <textarea name="description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Especificaciones (JSON)</label>
              <textarea name="specs" rows={3} value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none font-mono text-xs" placeholder='["Característica 1", "Característica 2"]' />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-300">
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
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

function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState({ open: false, product: null })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      productsApi.getAll(),
      categoriesApi.getAll(),
    ]).then(([products, categories]) => {
      setProducts(products)
      setCategories(categories)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => setModal({ open: true, product: null })
  const openEdit = (product) => setModal({ open: true, product })
  const closeModal = () => setModal({ open: false, product: null })

  const handleSave = () => { closeModal(); load() }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await productsApi.delete(id)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-black uppercase tracking-wide">Productos</h1>
        <button onClick={openNew} className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Precio</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">Cargando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400">No hay productos</td>
                </tr>
              ) : filtered.map((product) => (
                <tr key={product.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="py-3 px-4 font-medium text-black">{product.name}</td>
                  <td className="py-3 px-4 text-neutral-500 font-mono text-xs">{product.sku}</td>
                  <td className="py-3 px-4 text-neutral-600">{product.category}</td>
                  <td className="py-3 px-4 font-medium text-black">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-neutral-600">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {statusLabels[product.status] || product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(product)} className="text-black hover:text-neutral-600 font-medium text-xs">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-600 font-medium text-xs">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <ProductModal
          product={modal.product}
          categories={categories}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default ProductsAdmin
