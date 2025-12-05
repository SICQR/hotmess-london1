import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import { fetchCart, addToCart as apiAddToCart, updateCartItemQuantity, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, syncLocalCartToDatabase } from '../lib/cart-api';
import { getSession } from '../lib/auth';

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  qty: number;
  size?: string;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status and load cart
  const refreshCart = async () => {
    try {
      const session = await getSession();
      setIsAuthenticated(!!session?.user);

      // Always use localStorage for cart (database sync disabled)
      const saved = localStorage.getItem('hotmess_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setItems(parsed);
        } catch (e) {
          console.error('Failed to parse cart from localStorage');
        }
      }

      // TODO: Enable database cart sync when products table is ready
      // if (session?.user) {
      //   // Load cart from Supabase
      //   const dbCart = await fetchCart();
      //   if (dbCart.length > 0) {
      //     setItems(dbCart);
      //   }
      // }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  // Initial load
  useEffect(() => {
    refreshCart();
  }, []);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('hotmess_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    try {
      if (isAuthenticated) {
        // Add to Supabase
        await apiAddToCart(newItem.productId, newItem.size || 'M', newItem.qty);
        await refreshCart();
        toast.success('Added to cart');
      } else {
        // Add to local state
        setItems(prev => {
          const existingIndex = prev.findIndex(
            item => item.productId === newItem.productId && item.size === newItem.size
          );

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex].qty += newItem.qty;
            toast.success('Added to cart');
            return updated;
          }

          const item: CartItem = {
            ...newItem,
            id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          toast.success('Added to cart');
          return [...prev, item];
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (isAuthenticated) {
        await apiRemoveFromCart(id);
        await refreshCart();
        toast.success('Removed from cart');
      } else {
        setItems(prev => prev.filter(item => item.id !== id));
        toast.success('Removed from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(id);
      return;
    }

    try {
      if (isAuthenticated) {
        await updateCartItemQuantity(id, qty);
        await refreshCart();
      } else {
        setItems(prev =>
          prev.map(item => (item.id === id ? { ...item, qty } : item))
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await apiClearCart();
        await refreshCart();
      } else {
        setItems([]);
        localStorage.removeItem('hotmess_cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}