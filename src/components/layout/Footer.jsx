import { Link } from 'react-router-dom'
import { Cpu } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 dark:bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-accent-400" />
              <h3 className="font-heading text-xl font-bold uppercase tracking-wide">Dematiq</h3>
            </div>
            <p className="text-primary-200 text-sm">
              Partes PLC y automatización industrial. Calidad certificada para la industria.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3 text-white uppercase tracking-wider text-sm">Enlaces</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/productos" className="hover:text-accent-300 transition-colors">Productos</Link></li>
              <li><Link to="/carrito" className="hover:text-accent-300 transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3 text-white uppercase tracking-wider text-sm">Soporte</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><a href="#" className="hover:text-accent-300 transition-colors">Contacto técnico</a></li>
              <li><a href="#" className="hover:text-accent-300 transition-colors">Catálogo PDF</a></li>
              <li><a href="#" className="hover:text-accent-300 transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-accent-300 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-3 text-white uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><a href="#" className="hover:text-accent-300 transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-accent-300 transition-colors">Política de privacidad</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-300 text-sm">
          &copy; {currentYear} Dematiq. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer
