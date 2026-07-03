import { useState, useEffect, useRef } from 'react'
import { Plus, X, Search, ToggleLeft, ToggleRight, Upload as UploadIcon, Trash2 } from 'lucide-react'
import { productsApi, categoriesApi, brandsApi, uploadImage } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import ConfirmModal from '../../components/ui/ConfirmModal'

const statusLabels = { active: 'Activo', inactive: 'Inactivo' }

function flattenTree(tree, depth = 0) {
  const result = []
  tree.forEach((cat) => {
    result.push({ ...cat, depth })
    if (cat.subcategories && cat.subcategories.length > 0) {
      result.push(...flattenTree(cat.subcategories, depth + 1))
    }
  })
  return result
}

function ProductModal({ product, categories, brands, onClose, onSave }) {
  const toast = useToast()
  const isEditing = Boolean(product)
  const flatCategories = flattenTree(categories)
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    category_id: product?.category_id?.toString() || '',
    brand_id: product?.brand_id?.toString() || '',
    price: product?.price?.toString() || '',
    stock: product?.stock?.toString() || '0',
    description: product?.description || '',
    image_url: product?.image_url || '',
    specs: product?.specs ? JSON.stringify(product.specs, null, 2) : '[]',
    status: product?.status || 'active',
  })
  const [pendingFile, setPendingFile] = useState(null)
  const [preview, setPreview] = useState(product?.image_url || '')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    if (preview && !form.image_url) URL.revokeObjectURL(preview)
    setPendingFile(null)
    setPreview('')
    setForm((prev) => ({ ...prev, image_url: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl = form.image_url
      if (pendingFile) {
        imageUrl = await uploadImage(pendingFile)
      }
      if (preview && !form.image_url) URL.revokeObjectURL(preview)

      let specs
      try { specs = JSON.parse(form.specs) } catch { specs = [] }
      const payload = {
        name: form.name,
        sku: form.sku,
        category_id: form.category_id ? Number(form.category_id) : null,
        brand_id: form.brand_id || null,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        description: form.description,
        image_url: imageUrl || null,
        specs,
        status: form.status,
      }
      const saved = isEditing
        ? await productsApi.update(product.id, payload)
        : await productsApi.create(payload)
      onSave(saved)
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-black dark:text-white uppercase tracking-wide">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="p-1 text-neutral-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Nombre del producto</label>
              <input type="text" name="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">SKU</label>
              <input type="text" name="sku" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Categoría</label>
              <select name="category_id" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200">
                <option value="">Sin categoría</option>
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {'\u00A0'.repeat(cat.depth * 4)}{cat.depth > 0 ? '— ' : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Marca</label>
              <select name="brand_id" value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200">
                <option value="">Sin marca</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Precio</label>
              <input type="number" name="price" required step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Stock</label>
              <input type="number" name="stock" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Estado</label>
              <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Imagen</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center gap-2 px-4 py-2.5 border border-dashed border-neutral-200 dark:border-gray-600 rounded-lg text-sm text-neutral-400 dark:text-gray-500 hover:text-neutral-600 dark:hover:text-gray-300 hover:border-neutral-300 dark:hover:border-gray-500 cursor-pointer transition-colors">
                  <UploadIcon className="w-4 h-4" />
                  {preview ? 'Cambiar imagen' : 'Subir imagen'}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
                {pendingFile && <span className="text-xs text-neutral-400 dark:text-gray-500">(sin guardar)</span>}
                {preview && (
                  <button type="button" onClick={clearImage} className="p-2 text-neutral-300 dark:text-gray-600 hover:text-red-500 transition-colors" aria-label="Eliminar imagen">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {preview && (
                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-gray-600">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea name="description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none bg-transparent dark:text-gray-200" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Especificaciones (JSON)</label>
              <textarea name="specs" rows={3} value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none font-mono text-xs bg-transparent dark:text-gray-200" placeholder='["Característica 1", "Característica 2"]' />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-300 dark:disabled:bg-gray-600">
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold text-neutral-600 dark:text-gray-300 border border-neutral-200 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const LIMIT = 10

function ProductsAdmin() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [modal, setModal] = useState({ open: false, product: null })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [confirm, setConfirm] = useState(null)
  const searchTimer = useRef(null)

  const load = (opts = {}) => {
    setLoading(true)
    const params = {
      page: opts.page ?? page,
      limit: LIMIT,
      search: opts.search ?? search,
      status: opts.status ?? statusFilter,
    }
    Promise.all([
      productsApi.getAll(params),
      categoriesApi.getTree(),
      brandsApi.getAll(),
    ]).then(([res, categories, brands]) => {
      setProducts(res.products)
      setPagination(res.pagination)
      setCategories(categories)
      setBrands(brands)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearchChange = (value) => {
    setSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setPage(1)
      load({ search: value, page: 1 })
    }, 400)
  }

  const handleStatusFilter = (value) => {
    setStatusFilter(value)
    setPage(1)
    load({ status: value, page: 1 })
  }

  const goToPage = (p) => {
    setPage(p)
    load({ page: p })
  }

  const openNew = () => setModal({ open: true, product: null })
  const openEdit = (product) => setModal({ open: true, product })
  const closeModal = () => setModal({ open: false, product: null })

  const handleSave = () => { closeModal(); load({ page }) }

  const handleToggleStatus = async (product) => {
    const isActive = product.status === 'active'
    setConfirm({
      product,
      title: isActive ? 'Deshabilitar producto' : 'Activar producto',
      message: isActive
        ? `¿Estás seguro de deshabilitar "${product.name}"?`
        : `¿Estás seguro de activar "${product.name}"?`,
      confirmLabel: isActive ? 'Deshabilitar' : 'Activar',
      type: isActive ? 'danger' : 'warning',
    })
  }

  const confirmToggle = async () => {
    if (!confirm) return
    const { product } = confirm
    const isActive = product.status === 'active'
    setConfirm(null)
    try {
      if (isActive) {
        await productsApi.delete(product.id)
      } else {
        await productsApi.update(product.id, { status: 'active' })
      }
      load({ page })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-black dark:text-white uppercase tracking-wide">Productos</h1>
        <button onClick={openNew} className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800">
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Marca</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Precio</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400 dark:text-gray-500">Cargando...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400 dark:text-gray-500">No hay productos</td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="border-b border-neutral-50 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-black dark:text-white">{product.name}</td>
                  <td className="py-3 px-4 text-neutral-500 dark:text-gray-400 font-mono text-xs">{product.sku}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-gray-300">{product.category}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-gray-300">{product.brand || '—'}</td>
                  <td className="py-3 px-4 font-medium text-black dark:text-white">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-neutral-600 dark:text-gray-300">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                      {statusLabels[product.status] || product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(product)} className="text-black dark:text-white hover:text-neutral-600 dark:hover:text-gray-400 font-medium text-xs">Editar</button>
                      <button onClick={() => handleToggleStatus(product)} className={`inline-flex items-center gap-1 font-medium text-xs ${product.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}>
                        {product.status === 'active' ? <><ToggleLeft className="w-3.5 h-3.5" /> Deshabilitar</> : <><ToggleRight className="w-3.5 h-3.5" /> Activar</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-neutral-500 dark:text-gray-400">
          <span>Página {pagination.page} de {pagination.pages} ({pagination.total} productos)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-gray-600 disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= pagination.pages}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-gray-600 disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {modal.open && (
        <ProductModal
          product={modal.product}
          categories={categories}
          brands={brands}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel="Cancelar"
          type={confirm.type}
          onConfirm={confirmToggle}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

export default ProductsAdmin
