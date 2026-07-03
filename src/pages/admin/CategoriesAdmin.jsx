import { useState, useEffect } from 'react'
import { Plus, X, Search, ChevronDown, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'
import { categoriesApi } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import ConfirmModal from '../../components/ui/ConfirmModal'

const statusLabels = { active: 'Activo', inactive: 'Inactivo' }

function CategoryModal({ category, parents, onClose, onSave }) {
  const toast = useToast()
  const isEditing = Boolean(category)
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    parent_id: category?.parent_id?.toString() || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.warning('El nombre es requerido')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
      }
      if (isEditing) {
        await categoriesApi.update(category.id, payload)
      } else {
        await categoriesApi.create(payload)
      }
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const filteredParents = parents.filter((p) => !isEditing || p.id !== category.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-black dark:text-white uppercase tracking-wide">
            {isEditing ? 'Editar categoría' : 'Nueva categoría'}
          </h2>
          <button onClick={onClose} className="p-1 text-neutral-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
              placeholder="Nombre de la categoría"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none bg-transparent dark:text-gray-200"
              placeholder="Descripción opcional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-1">Categoría padre</label>
            <select
              value={form.parent_id}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
              className="w-full px-3 py-2.5 border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
            >
              <option value="">— Es categoría principal —</option>
              {filteredParents.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-300 dark:disabled:bg-gray-600"
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear categoría'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-semibold text-neutral-600 dark:text-gray-300 border border-neutral-200 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CategoryRow({ cat, depth = 0, selectedCategory, onEdit, onToggleStatus }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = cat.subcategories && cat.subcategories.length > 0

  if (selectedCategory && depth === 0 && cat.id !== selectedCategory) return null

  return (
    <>
      <tr className="border-b border-neutral-50 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors">
        <td className="py-3 px-4">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 1.5}rem` }}>
            {hasChildren ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-0.5 text-neutral-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label={expanded ? 'Colapsar' : 'Expandir'}
                aria-expanded={expanded}
              >
                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-4" />
            )}
            <div className={`w-2 h-2 rounded-full ${depth === 0 ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-gray-600'}`} />
            <span className={`font-medium ${depth === 0 ? 'text-black dark:text-white' : 'text-neutral-600 dark:text-gray-300 text-sm'}`}>
              {cat.name}
            </span>
          </div>
        </td>
        <td className="py-3 px-4 text-neutral-400 dark:text-gray-500 text-xs font-mono">{cat.slug}</td>
        <td className="py-3 px-4 text-neutral-500 dark:text-gray-400 text-sm">{cat.description || '—'}</td>
        <td className="py-3 px-4">
          {depth === 0 ? (
            <span className="text-xs font-medium text-primary-500 uppercase">Principal</span>
          ) : (
            <span className="text-xs text-neutral-400 dark:text-gray-500">Subcategoría</span>
          )}
        </td>
        <td className="py-3 px-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
            {statusLabels[cat.status] || cat.status}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(cat)}
              className="text-black dark:text-white hover:text-neutral-600 dark:hover:text-gray-400 font-medium text-xs"
            >
              Editar
            </button>
            <button
              onClick={() => onToggleStatus(cat)}
              className={`inline-flex items-center gap-1 font-medium text-xs ${cat.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}
            >
              {cat.status === 'active' ? <><ToggleLeft className="w-3.5 h-3.5" /> Deshabilitar</> : <><ToggleRight className="w-3.5 h-3.5" /> Activar</>}
            </button>
          </div>
        </td>
      </tr>
      {hasChildren && expanded && cat.subcategories.map((sub) => (
        <CategoryRow
          key={sub.id}
          cat={sub}
          depth={depth + 1}
          selectedCategory={selectedCategory}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </>
  )
}

function CategoriesAdmin() {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [flatCategories, setFlatCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState({ open: false, category: null })
  const [confirm, setConfirm] = useState(null)
  const [filterParent, setFilterParent] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [tree, flat] = await Promise.all([
        categoriesApi.getTree(),
        categoriesApi.getAll(),
      ])
      setCategories(tree)
      setFlatCategories(flat)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openNew = () => setModal({ open: true, category: null })
  const openEdit = (category) => setModal({ open: true, category })
  const closeModal = () => setModal({ open: false, category: null })
  const handleSave = () => { closeModal(); load() }

  const handleToggleStatus = (category) => {
    const isActive = category.status === 'active'
    setConfirm({
      category,
      title: isActive ? 'Deshabilitar categoría' : 'Activar categoría',
      message: isActive
        ? `¿Estás seguro de deshabilitar "${category.name}"? Las subcategorías se conservarán.`
        : `¿Estás seguro de activar "${category.name}"?`,
      confirmLabel: isActive ? 'Deshabilitar' : 'Activar',
      type: isActive ? 'danger' : 'warning',
    })
  }

  const confirmToggle = async () => {
    if (!confirm) return
    const { category } = confirm
    const isActive = category.status === 'active'
    setConfirm(null)
    try {
      if (isActive) {
        await categoriesApi.delete(category.id)
      } else {
        await categoriesApi.update(category.id, { status: 'active' })
      }
      toast.success(isActive ? 'Categoría deshabilitada' : 'Categoría activada')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const allParents = flatCategories.filter((c) => !c.parent_id)

  const parentOptions = [
    { value: '', label: 'Todas las categorías' },
    ...allParents.map((p) => ({ value: p.id, label: p.name })),
  ]

  const filteredTree = search
    ? categories
        .map((parent) => ({
          ...parent,
          subcategories: parent.subcategories.filter((sub) =>
            sub.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((parent) =>
          parent.name.toLowerCase().includes(search.toLowerCase()) ||
          parent.subcategories.length > 0
        )
    : categories

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-black dark:text-white uppercase tracking-wide">Categorías</h1>
          <p className="text-neutral-500 dark:text-gray-400 text-sm mt-1">{flatCategories.length} categorías en total</p>
        </div>
        <button
          onClick={openNew}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
          />
        </div>
        <select
          value={filterParent}
          onChange={(e) => setFilterParent(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:text-gray-200"
        >
          {parentOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800">
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Slug</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-400 dark:text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-gray-500">Cargando...</td>
                </tr>
              ) : filteredTree.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400 dark:text-gray-500">
                    {search ? 'No se encontraron categorías' : 'No hay categorías. Crea la primera.'}
                  </td>
                </tr>
              ) : (
                filteredTree.map((cat) => (
                  <CategoryRow
                    key={cat.id}
                    cat={cat}
                    depth={0}
                    selectedCategory={filterParent ? Number(filterParent) : null}
                    onEdit={openEdit}
                    onToggleStatus={handleToggleStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <CategoryModal
          category={modal.category}
          parents={allParents}
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

export default CategoriesAdmin
