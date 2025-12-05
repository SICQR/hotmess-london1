import { supabase } from './supabase';
import { getSession } from './auth';

// CartItem interface matching the existing one
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

// Fetch user's cart from database
export async function fetchCart(): Promise<CartItem[]> {
  const session = await getSession();
  if (!session?.user) return [];

  // For now, return empty cart since we don't have a products table
  // Cart items are managed client-side with localStorage
  // Database cart sync can be added later when products table is created
  
  console.log('Cart fetch: Using localStorage (no products table in DB yet)');
  return [];
  
  // TODO: Uncomment when products table with foreign key is set up
  // const { data, error } = await supabase
  //   .from('cart_items')
  //   .select(`
  //     id,
  //     product_id,
  //     size,
  //     quantity,
  //     products (
  //       shopify_id,
  //       title,
  //       collection,
  //       price,
  //       image_url
  //     )
  //   `)
  //   .eq('user_id', session.user.id);
  //
  // if (error) {
  //   console.error('Error fetching cart:', error);
  //   return [];
  // }
  //
  // return data.map((item: any) => ({
  //   id: item.id,
  //   productId: item.product_id,
  //   slug: item.products.shopify_id,
  //   title: item.products.title,
  //   category: item.products.collection,
  //   price: parseFloat(item.products.price),
  //   qty: item.quantity,
  //   size: item.size,
  //   image: item.products.image_url,
  // }));
}

// Add item to cart
export async function addToCart(
  productId: string,
  size: string,
  quantity: number = 1
): Promise<void> {
  const session = await getSession();
  if (!session?.user) {
    // For non-authenticated users, cart is managed in localStorage by CartContext
    console.log('Add to cart: User not authenticated, using localStorage');
    return;
  }

  // Database cart sync disabled until products table is set up
  console.log('Add to cart: Database sync disabled, using localStorage');
  return;

  // TODO: Uncomment when products table is ready
  // Check if item already exists
  // const { data: existing } = await supabase
  //   .from('cart_items')
  //   .select('id, quantity')
  //   .eq('user_id', session.user.id)
  //   .eq('product_id', productId)
  //   .eq('size', size)
  //   .single();
  //
  // if (existing) {
  //   // Update quantity
  //   const { error } = await supabase
  //     .from('cart_items')
  //     .update({ quantity: existing.quantity + quantity })
  //     .eq('id', existing.id);
  //
  //   if (error) throw error;
  // } else {
  //   // Insert new item
  //   const { error } = await supabase
  //     .from('cart_items')
  //     .insert({
  //       user_id: session.user.id,
  //       product_id: productId,
  //       size,
  //       quantity,
  //     });
  //
  //   if (error) throw error;
  // }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<void> {
  const session = await getSession();
  if (!session?.user) {
    console.log('Update cart: User not authenticated, using localStorage');
    return;
  }

  // Database cart sync disabled until products table is set up
  console.log('Update cart: Database sync disabled, using localStorage');
  return;

  // TODO: Uncomment when products table is ready
  // if (quantity <= 0) {
  //   // Remove item if quantity is 0
  //   await removeFromCart(cartItemId);
  //   return;
  // }
  //
  // const { error } = await supabase
  //   .from('cart_items')
  //   .update({ quantity })
  //   .eq('id', cartItemId)
  //   .eq('user_id', session.user.id);
  //
  // if (error) throw error;
}

// Remove item from cart
export async function removeFromCart(cartItemId: string): Promise<void> {
  const session = await getSession();
  if (!session?.user) {
    console.log('Remove from cart: User not authenticated, using localStorage');
    return;
  }

  // Database cart sync disabled until products table is set up
  console.log('Remove from cart: Database sync disabled, using localStorage');
  return;

  // TODO: Uncomment when products table is ready
  // const { error } = await supabase
  //   .from('cart_items')
  //   .delete()
  //   .eq('id', cartItemId)
  //   .eq('user_id', session.user.id);
  //
  // if (error) throw error;
}

// Clear entire cart
export async function clearCart(): Promise<void> {
  const session = await getSession();
  if (!session?.user) {
    console.log('Clear cart: User not authenticated, using localStorage');
    return;
  }

  // Database cart sync disabled until products table is set up
  console.log('Clear cart: Database sync disabled, using localStorage');
  return;

  // TODO: Uncomment when products table is ready
  // const { error } = await supabase
  //   .from('cart_items')
  //   .delete()
  //   .eq('user_id', session.user.id);
  //
  // if (error) throw error;
}

// Sync local cart to database on login
export async function syncLocalCartToDatabase(localCart: CartItem[]): Promise<void> {
  const session = await getSession();
  if (!session?.user) return;

  // Database cart sync disabled until products table is set up
  console.log('Sync cart: Database sync disabled, keeping localStorage cart');
  return;

  // TODO: Uncomment when products table is ready
  // for (const item of localCart) {
  //   try {
  //     await addToCart(item.productId, item.size, item.qty);
  //   } catch (error) {
  //     console.error('Error syncing cart item:', error);
  //   }
  // }
}