# Documentación de Diseño — Dematiq Frontend

> Este archivo describe el sistema de diseño del proyecto **Dematiq**, un ecommerce B2B de automatización industrial. Léelo completo antes de escribir o modificar cualquier componente.

---

## 1. Stack Tecnológico

- **Framework:** React 18
- **Bundler:** Vite 6
- **CSS:** Tailwind CSS 3 (utility-first, sin CSS modules ni styled-components)
- **Icons:** lucide-react
- **Routing:** react-router-dom v6
- **Estado global:** Context API + useReducer

---

## 2. Tipografía

| Uso | Font | Fallbacks |
|---|---|---|
| Body / general | Poppins | system-ui, sans-serif |
| Headings / títulos | Oswald | sans-serif |

**Cargas desde Google Fonts** (`index.html:10`):
- Poppins: 300, 400, 500, 600, 700, 800
- Oswald: 400, 500, 600, 700

**Clases utilitarias de Tailwind:**
- Títulos → `font-heading` + `uppercase tracking-wide`
- Body → `font-sans` (default)
- Badges / labels pequeños → `text-xs font-semibold uppercase tracking-widest`

**Regla:** Todo título principal lleva `font-heading text-4xl font-bold text-black uppercase tracking-wide`. Los subtítulos dentro de secciones llevan `font-heading text-lg font-bold text-black uppercase tracking-wide`.

---

## 3. Paleta de Colores

Definida en `tailwind.config.js`:

### Primarios (escala de negro a gris):

| Token | Hex | Uso |
|---|---|---|
| `primary-50` | `#f9f9f9` | Fondos muy claros |
| `primary-100` | `#eaeaea` | Bordes hover |
| `primary-200` | `#d4d4d4` | Bordes de inputs |
| `primary-300` | `#b4b4b4` | Placeholders |
| `primary-400` | `#8a8a8a` | Texto secundario / deshabilitado |
| `primary-500` | `#000000` | **Color principal — negro puro** |
| `primary-600` | `#1a1a1a` | Hover de fondos negros |
| `primary-700` | `#2e2e2e` | — |
| `primary-800` | `#3d3d3d` | — |
| `primary-900` | `#4a4a4a` | — |

### Secundarios (escala neutral):

| Token | Hex | Uso |
|---|---|---|
| `secondary-50` | `#fcfcfc` | — |
| `secondary-100` | `#f5f5f5` | Fondos de cards / secciones |
| `secondary-200` | `#e8e8e8` | Bordes de inputs |
| `secondary-300` | `#d1d1d1` | Bordes de cards |
| `secondary-400` | `#a3a3a3` | Texto secundario |
| `secondary-500` | `#737373` | — |
| `secondary-600` | `#525252` | — |
| `secondary-700` | `#404040` | — |
| `secondary-800` | `#262626` | — |
| `secondary-900` | `#171717` | Fondos oscuros alternos |

### Colores de estado (usados directamente con Tailwind):

| Propósito | Clase |
|---|---|
| Éxito | `text-green-500`, `bg-green-500` |
| Error | `text-red-500`, `bg-red-50` + `text-red-600` |
| Advertencia | `text-amber-500` |
| Info | `text-blue-500` |

### Industrial (azul manufactura / automatización):

| Token | Hex | Uso |
|---|---|---|
| `industrial-50` | `#eef4f8` | Fondos de secciones con acento azul metálico |
| `industrial-100` | `#d8e4ef` | Hover en fondos azules claros |
| `industrial-200` | `#b8cddf` | Bordes de acento |
| `industrial-300` | `#8dafc9` | — |
| `industrial-400` | `#5d8dae` | — |
| `industrial-500` | `#004B87` | **Azul metálico principal** — header, botones CTA, badges activos, contenedores de iconos |
| `industrial-600` | `#003d6f` | Hover de `industrial-500` |
| `industrial-700` | `#002f57` | Links de texto |
| `industrial-800` | `#002140` | — |
| `industrial-900` | `#00142a` | — |

**Regla:** El color hero del brand es **negro puro** (`#000000`). El **azul metálico** (`industrial-500`) es el color principal de la marca: header, botones primarios, estados activos, badges y contenedores decorativos. El header público usa fondo `bg-industrial-500` con texto blanco. El negro se reserva para fondos estructurales (footer, hero, admin header).

---

## 4. Componentes y Patrones Visuales

### Botones

| Variante | Clases |
|---|---|
| Primario (relleno azul metálico) | `bg-industrial-500 hover:bg-industrial-600 text-white px-5 py-2 rounded font-semibold transition-colors` |
| Inverso (blanco sobre azul) | `bg-white text-industrial-500 hover:bg-neutral-100 font-semibold rounded transition-colors` |
| Outline claro (sobre azul) | `text-white/80 border-white/20 hover:bg-white hover:text-industrial-500 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200` |
| Outline admin (fondo oscuro) | `text-white/70 hover:text-white hover:bg-white/10` |
| Deshabilitado | `bg-neutral-300 disabled:cursor-not-allowed` |

### Inputs y Formularios

- Borde: `border border-neutral-200`
- Foco: `focus:outline-none focus:ring-2 focus:ring-industrial-500 focus:border-transparent`
- Border radius: `rounded-lg` o `rounded-xl`
- Fondo: `bg-neutral-50` o `bg-white`
- Placeholder: `text-neutral-400`

### Cards / Contenedores

- Fondo: `bg-white`
- Borde: `border border-neutral-100`
- Radius: `rounded-2xl`
- Sombra hover: `hover:shadow-lg` o `hover:shadow-xl`
- Transición: `transition-all duration-300`

### Header (público)

- Fondo: `bg-industrial-500`
- Borde inferior: `border-b border-white/10`
- Logo: `font-heading text-2xl font-bold tracking-wide text-white uppercase`
- Sticky: `sticky top-0 z-50`
- Nav activo: `bg-white text-industrial-500 border-white`
- Nav hover: `hover:bg-white hover:text-industrial-500 hover:border-white`
- Badge carrito: `bg-white text-industrial-500`
- Botón Ingresar: `bg-white text-industrial-500 hover:bg-neutral-100`
- Icono carrito / menú hamburguesa: `text-white/80 hover:text-white`

### Footer

- Fondo: `bg-black`
- Texto: `text-white`
- Links: `text-neutral-400 hover:text-white transition-colors`
- Separador: `border-t border-neutral-800`

### Admin Layout

- Header admin: `bg-industrial-500 text-white`
- Nav links activos: `bg-white text-industrial-500`
- Nav links inactivos: `text-white/70 hover:text-white hover:bg-white/10`

### Secciones del Home

- Hero: `bg-gradient-to-br from-black via-neutral-900 to-black text-white`
- Secciones alternan: `bg-white` / `bg-neutral-50`
- Categorías: hover pasa de `bg-neutral-50` a `bg-industrial-500 text-white`
- Iconos de ventajas: `bg-industrial-500`
- CTA final sobre fondo negro: `bg-industrial-500 hover:bg-industrial-600 text-white`

---

## 5. Espaciado y Layout

- Contenedor máximo: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Separación entre secciones: `py-16`, `py-20` o `py-24`
- Gap en grillas: `gap-6` o `gap-8`
- Stack vertical en secciones: `space-y-8` o `space-y-5`

---

## 6. Iconos

Usamos **lucide-react**. Todos los iconos se importan directamente:

```jsx
import { ShoppingCart, Menu, X, Cpu, Search, ArrowRight } from 'lucide-react'
```

Tamaños estándar: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`, `w-7 h-7`, `w-16 h-16`

---

## 7. Animaciones y Transiciones

- Hover en botones: `transition-colors duration-200`
- Hover en cards: `transition-all duration-300`
- Hover en iconos dentro de cards: `group-hover:scale-110 transition-transform duration-300`
- Escala en imágenes de producto: `group-hover:scale-110 transition-transform duration-500`

---

## 8. Navegación y Rutas

```
/                    → Home
/productos           → Products (lista)
/productos/:id       → ProductDetail
/carrito             → Cart
/checkout            → Checkout
/iniciar-sesion      → Login
/registrarse         → Register
/contacto            → Contact
/admin/dashboard     → Dashboard
/admin/productos     → ProductsAdmin
/admin/productos/nuevo → ProductForm
/admin/productos/editar/:id → ProductForm
/admin/ordenes       → Orders
/admin/usuarios      → Users
```

Layout público: `PublicLayout` (Header + Outlet + Footer)
Layout admin: `AdminLayout` (Header admin + Outlet)

---

## 9. Convenciones de Código

- **Sin comentarios** en JSX/components.
- Nombres de componentes en PascalCase.
- Archivos en PascalCase con extensión `.jsx`.
- Contextos en `src/contexts/`, componentes en `src/components/`, páginas en `src/pages/`.
- Los estilos solo se aplican con clases de Tailwind. No hay CSS personalizado (el archivo `src/styles/index.css` solo contiene las directivas `@tailwind`).
- El idioma de la UI es **español (México)**.

---

## 10. Assets

- `src/assets/img/dematiq_login.png` — Imagen decorativa en Login
- `src/assets/img/dematiq_register.png` — Imagen decorativa en Register
- Favicon: `/favicon.svg`

---

## 11. Variables de Entorno y Config

No hay variables de entorno. Todo es mock/frontend-only.

- Autenticación: mock en `AuthContext` con usuario `admin@dematiq.com`
- Carrito: estado local con `useReducer` en `CartContext`
- Datos de productos mockeados directamente en cada página

---

## 12. Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "lucide-react": "^1.17.0",
  "tailwindcss": "^3.4.15",
  "vite": "^6.0.3"
}
```
