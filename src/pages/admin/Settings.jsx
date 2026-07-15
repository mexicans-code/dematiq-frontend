import { useState, useEffect, useRef } from 'react'
import { settingsApi, uploadImage } from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import { Save, Upload } from 'lucide-react'

function Settings() {
  const toast = useToast()
  const fileRef = useRef(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLogo()
  }, [])

  const loadLogo = async () => {
    try {
      const url = await settingsApi.get('logo_url')
      setLogoUrl(url)
      setPreview(url)
    } catch {
      // fallback
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!selectedFile) {
      toast.info('Selecciona una imagen primero')
      return
    }
    setLoading(true)
    try {
      const url = await uploadImage(selectedFile)
      await settingsApi.update('logo_url', url)
      setLogoUrl(url)
      setSelectedFile(null)
      toast.success('Logo actualizado correctamente')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Configuración</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-neutral-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Logo del sitio</h2>

        <div className="mb-6">
          <div className="w-48 h-24 bg-neutral-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-neutral-200 dark:border-gray-600">
            {preview ? (
              <img src={preview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-neutral-400 text-sm">Sin logo</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-200 dark:border-gray-600 rounded-lg text-neutral-600 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            {selectedFile ? selectedFile.name : 'Seleccionar imagen'}
          </button>

          <button
            onClick={handleSave}
            disabled={!selectedFile || loading}
            className="flex items-center gap-2 px-5 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors disabled:bg-neutral-300 dark:disabled:bg-gray-600"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default Settings
