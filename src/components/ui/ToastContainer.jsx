import { useToast } from '../../contexts/ToastContext'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const typeStyles = {
  success: {
    bg: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-800 dark:text-green-200',
  },
  error: {
    bg: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700',
    icon: AlertCircle,
    iconColor: 'text-red-500 dark:text-red-400',
    textColor: 'text-red-700 dark:text-red-200',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700',
    icon: AlertTriangle,
    iconColor: 'text-amber-500 dark:text-amber-400',
    textColor: 'text-amber-700 dark:text-amber-200',
  },
  info: {
    bg: 'bg-primary-50 border-primary-200 dark:bg-primary-800/40 dark:border-primary-600',
    icon: Info,
    iconColor: 'text-primary-500 dark:text-primary-300',
    textColor: 'text-primary-700 dark:text-primary-200',
  },
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const style = typeStyles[toast.type] || typeStyles.info
        const Icon = style.icon
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in ${style.bg}`}
          >
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
            <p className={`text-sm font-medium flex-1 ${style.textColor}`}>{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 ${style.textColor} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer