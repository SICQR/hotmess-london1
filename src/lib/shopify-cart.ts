// HOTMESS LONDON - Shopify Storefront API Cart Integration
// Manages cart operations using Shopify's Cart API

import { SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from './env';

// GraphQL query and mutation strings
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                title
                handle
              }
              priceV2 {
                amount
                currencyCode
              }
              image {
                url
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_LINES_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_LINES_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_LINES_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

// Types
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
          };
          priceV2: {
            amount: string;
            currencyCode: string;
          };
          image: {
            url: string;
          } | null;
        };
      };
    }>;
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

// Helper function to make Shopify API requests
async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error(
      'Shopify is not configured. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN in your environment (Vercel Project Settings → Environment Variables, or local .env.local).'
    );
  }
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data;
}

/**
 * Create a new Shopify cart
 * Returns the cart ID which should be stored in localStorage
 */
export async function createCart(): Promise<ShopifyCart> {
  try {
    const data = await shopifyFetch<{
      cartCreate: {
        cart: ShopifyCart;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(CREATE_CART_MUTATION, {
      input: {
        lines: [],
      },
    });

    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }

    return data.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Get cart by ID
 * Returns null if cart is expired or not found
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>(GET_CART_QUERY, { cartId });
    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

/**
 * Add line item(s) to cart
 * If cartId is null or cart doesn't exist, creates a new cart
 */
export async function addToCart(
  cartId: string | null,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart> {
  try {
    // If no cart exists, create one
    if (!cartId) {
      const newCart = await createCart();
      cartId = newCart.id;
    }

    // Verify cart still exists
    const existingCart = await getCart(cartId);
    if (!existingCart) {
      // Cart expired, create new one
      const newCart = await createCart();
      cartId = newCart.id;
    }

    const data = await shopifyFetch<{
      cartLinesAdd: {
        cart: ShopifyCart;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(ADD_LINES_MUTATION, {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart line quantity
 */
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  try {
    const data = await shopifyFetch<{
      cartLinesUpdate: {
        cart: ShopifyCart;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(UPDATE_LINES_MUTATION, {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(data.cartLinesUpdate.userErrors[0].message);
    }

    return data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('Error updating cart line:', error);
    throw error;
  }
}

/**
 * Remove line item(s) from cart
 */
export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
  try {
    const data = await shopifyFetch<{
      cartLinesRemove: {
        cart: ShopifyCart;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(REMOVE_LINES_MUTATION, {
      cartId,
      lineIds: [lineId],
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      throw new Error(data.cartLinesRemove.userErrors[0].message);
    }

    return data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Get checkout URL for a cart
 */
export async function getCheckoutUrl(cartId: string): Promise<string | null> {
  try {
    const cart = await getCart(cartId);
    return cart?.checkoutUrl || null;
  } catch (error) {
    console.error('Error getting checkout URL:', error);
    return null;
  }
}

/**
 * Transform Shopify cart to CartItem array for CartContext
 */
export function transformShopifyCartToItems(cart: ShopifyCart | null): Array<{
  id: string;
  lineId: string;
  productId: string;
  variantId?: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  qty: number;
  size?: string;
  image: string;
}> {
  if (!cart || !cart.lines.edges.length) {
    return [];
  }

  return cart.lines.edges.map(({ node }) => ({
    id: node.id, // This is the line ID for cart operations
    lineId: node.id,
    productId: node.merchandise.product.id,
    variantId: node.merchandise.id, // Shopify variant ID for checkout
    slug: node.merchandise.product.handle,
    title: node.merchandise.product.title,
    category: 'shop', // Default category, could be extracted from tags
    price: parseFloat(node.merchandise.priceV2.amount) * 100, // Convert to pence
    qty: node.quantity,
    size: node.merchandise.title !== 'Default Title' ? node.merchandise.title : undefined,
    image: node.merchandise.image?.url || '',
  }));
}
