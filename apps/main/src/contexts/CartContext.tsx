/**
 * HOTMESS LONDON - Shopping Cart Context
 * 
 * ARCHITECTURE:
 * - Single source of truth: Shopify Cart API
 * - Persistence: localStorage stores only Shopify cart ID
 * - Data flow: UI → CartContext → Shopify API → UI
 * 
 * CART LIFECYCLE:
 * 1. User adds item → Create Shopify cart (if doesn't exist)
 * 2. Shopify returns cart ID + checkout URL
 * 3. Store cart ID in localStorage (key: 'hotmess_shopify_cart_id')
 * 4. Fetch cart data on page load using stored cart ID
 * 5. Cart expires after ~10 days (Shopify managed)
 * 
 * NO DATABASE CART:
 * - Cart items are NOT stored in Supabase
 * - All cart operations go directly to Shopify
 * - No database sync needed
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { 
  createCart, 
  getCart, 
  addToCart as shopifyAddToCart, 
  updateCartLine, 
  removeFromCart as shopifyRemoveFromCart,
  transformShopifyCartToItems,
  ShopifyCart
} from '../lib/shopify-cart';

export interface CartItem {
  id: string;
  lineId?: string; // Shopify line ID for updates/removals
  productId: string;
  variantId?: string; // Shopify variant ID
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
  addItem: (item: Omit<CartItem, 'id' | 'lineId'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  checkoutUrl: string | null;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'hotmess_shopify_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load cart from Shopify
  const refreshCart = async () => {
    try {
      setLoading(true);
      const savedCartId = localStorage.getItem(CART_ID_KEY);
      
      if (savedCartId) {
        // Try to fetch existing cart
        const cart = await getCart(savedCartId);
        
        if (cart) {
          // Cart exists and is valid
          setCartId(cart.id);
          setCheckoutUrl(cart.checkoutUrl);
          const cartItems = transformShopifyCartToItems(cart);
          setItems(cartItems);
        } else {
          // Cart expired or not found, create new one
          if (import.meta.env.DEV) {
            console.log('[Cart] Cart expired, creating new cart');
          }
          localStorage.removeItem(CART_ID_KEY);
          setCartId(null);
          setCheckoutUrl(null);
          setItems([]);
        }
      } else {
        // No cart exists yet
        setItems([]);
        setCheckoutUrl(null);
      }
    } catch (error) {
      console.error('[Cart] Error refreshing cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshCart();
  }, []);

  const addItem = async (newItem: Omit<CartItem, 'id' | 'lineId'>) => {
    try {
      if (!newItem.variantId) {
        toast.error('Product variant not found');
        return;
      }

      setLoading(true);
      
      // Add to Shopify cart
      const updatedCart = await shopifyAddToCart(cartId, newItem.variantId, newItem.qty);
      
      // Update local state
      setCartId(updatedCart.id);
      setCheckoutUrl(updatedCart.checkoutUrl);
      localStorage.setItem(CART_ID_KEY, updatedCart.id);
      
      const cartItems = transformShopifyCartToItems(updatedCart);
      setItems(cartItems);
      
      toast.success('Added to cart');
    } catch (error) {
      console.error('[Cart] Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    try {
      if (!cartId) {
        toast.error('Cart not found');
        return;
      }

      setLoading(true);
      
      // Remove from Shopify cart
      const updatedCart = await shopifyRemoveFromCart(cartId, lineId);
      
      // Update local state
      setCheckoutUrl(updatedCart.checkoutUrl);
      const cartItems = transformShopifyCartToItems(updatedCart);
      setItems(cartItems);
      
      toast.success('Removed from cart');
    } catch (error) {
      console.error('[Cart] Error removing from cart:', error);
      toast.error('Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, qty: number) => {
    if (qty <= 0) {
      await removeItem(lineId);
      return;
    }

    try {
      if (!cartId) {
        toast.error('Cart not found');
        return;
      }

      setLoading(true);
      
      // Update in Shopify cart
      const updatedCart = await updateCartLine(cartId, lineId, qty);
      
      // Update local state
      setCheckoutUrl(updatedCart.checkoutUrl);
      const cartItems = transformShopifyCartToItems(updatedCart);
      setItems(cartItems);
    } catch (error) {
      console.error('[Cart] Error updating quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      // Create a new empty cart
      const newCart = await createCart();
      
      setCartId(newCart.id);
      setCheckoutUrl(newCart.checkoutUrl);
      localStorage.setItem(CART_ID_KEY, newCart.id);
      setItems([]);
      
      toast.success('Cart cleared');
    } catch (error) {
      console.error('[Cart] Error clearing cart:', error);
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
        checkoutUrl,
        loading,
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