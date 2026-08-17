import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(
        i => i.productId === action.item.productId && i.variantId === action.item.variantId
      );
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.item.productId && i.variantId === action.item.variantId
              ? { ...i, quantity: i.quantity + (action.item.quantity || 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: action.item.quantity || 1 }] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.productId === action.productId && i.variantId === action.variantId)
        ),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.productId && i.variantId === action.variantId
            ? { ...i, quantity: action.quantity }
            : i
        ).filter(i => i.quantity > 0),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = 'bushra_cart';

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
