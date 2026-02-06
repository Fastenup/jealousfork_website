import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem } from '@/services/squareService';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string | number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string | number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_DELIVERY_FEE'; payload: number };

const TAX_RATE = 0.075; // 7.5% Miami-Dade tax rate

function calculateTotals(items: CartItem[], deliveryFee: number = 0) {
  const subtotal = items.reduce((sum, item) => {
    // Include modifier prices in item total
    const modifierTotal = (item.modifiers || []).reduce((m, mod) => m + mod.price, 0);
    return sum + ((item.price + modifierTotal) * item.quantity);
  }, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + deliveryFee;
  return { subtotal, tax, total };
}

// Get cart line ID for matching - uses cartLineId if available, otherwise falls back to id
function getCartLineKey(item: CartItem | Omit<CartItem, 'quantity'>): string {
  return item.cartLineId || String(item.id);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Match on cartLineId to support same item with different modifiers as separate entries
      const payloadKey = getCartLineKey(action.payload);
      const existingItem = state.items.find(item => getCartLineKey(item) === payloadKey);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map(item =>
          getCartLineKey(item) === payloadKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const totals = calculateTotals(newItems, state.deliveryFee);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }
    
    case 'REMOVE_ITEM': {
      const payloadKey = String(action.payload);
      const newItems = state.items.filter(item => getCartLineKey(item) !== payloadKey);
      const totals = calculateTotals(newItems, state.deliveryFee);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }

      const payloadKey = String(id);
      const newItems = state.items.map(item =>
        getCartLineKey(item) === payloadKey ? { ...item, quantity } : item
      );
      const totals = calculateTotals(newItems, state.deliveryFee);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        subtotal: 0,
        tax: 0,
        total: state.deliveryFee,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      };
    
    case 'SET_DELIVERY_FEE': {
      const totals = calculateTotals(state.items, action.payload);
      return {
        ...state,
        deliveryFee: action.payload,
        ...totals,
      };
    }
    
    default:
      return state;
  }
}

const STORAGE_KEY = 'jealous-fork-cart';

const getInitialState = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        const totals = calculateTotals(parsed.items || [], parsed.deliveryFee || 0);
        return {
          items: parsed.items || [],
          isOpen: false,
          deliveryFee: parsed.deliveryFee || 0,
          ...totals,
        };
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
  
  return {
    items: [],
    isOpen: false,
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    total: 0,
  };
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setDeliveryFee: (fee: number) => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // Save to localStorage whenever cart state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          items: state.items,
          deliveryFee: state.deliveryFee,
        }));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items, state.deliveryFee]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string | number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open });
  };

  const setDeliveryFee = (fee: number) => {
    dispatch({ type: 'SET_DELIVERY_FEE', payload: fee });
  };

  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        setDeliveryFee,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}