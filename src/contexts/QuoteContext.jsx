import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

const QuoteContext = createContext(null)

const STORAGE_KEY = 'dematiq_quote'

function loadQuote() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      return {
        items: Array.isArray(data.items) ? data.items : [],
        customProducts: Array.isArray(data.customProducts) ? data.customProducts : [],
      }
    }
  } catch {}
  return { items: [], customProducts: [] }
}

let nextCustomId = Date.now()

function nextId() {
  nextCustomId++
  return nextCustomId
}

const quoteReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    case 'ADD_CUSTOM_PRODUCT':
      return {
        ...state,
        customProducts: [
          ...state.customProducts,
          { ...action.payload, id: nextId() },
        ],
      }
    case 'REMOVE_CUSTOM_PRODUCT':
      return {
        ...state,
        customProducts: state.customProducts.filter((p) => p.id !== action.payload),
      }
    case 'CLEAR_QUOTE':
      return { ...state, items: [], customProducts: [] }
    default:
      return state
  }
}

export function QuoteProvider({ children }) {
  const [state, dispatch] = useReducer(quoteReducer, null, loadQuote)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } })
  }, [])

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }, [])

  const addCustomProduct = useCallback((product) => {
    dispatch({ type: 'ADD_CUSTOM_PRODUCT', payload: product })
  }, [])

  const removeCustomProduct = useCallback((id) => {
    dispatch({ type: 'REMOVE_CUSTOM_PRODUCT', payload: id })
  }, [])

  const clearQuote = useCallback(() => {
    dispatch({ type: 'CLEAR_QUOTE' })
  }, [])

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <QuoteContext.Provider
      value={{
        items: state.items,
        customProducts: state.customProducts,
        addItem,
        removeItem,
        updateQuantity,
        addCustomProduct,
        removeCustomProduct,
        clearQuote,
        totalItems,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote debe usarse dentro de QuoteProvider')
  }
  return context
}
