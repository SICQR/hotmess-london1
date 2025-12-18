export const mockUser = {
  id: 'test-user-id',
  email: 'test@hotmess.london',
  role: 'user' as const,
};

export const mockBeacon = {
  id: 'test-beacon-id',
  title: 'Test Event',
  type: 'event',
  xp: 50,
  active: true,
};

export const mockProduct = {
  id: 'test-product-id',
  name: 'Test Product',
  price: 25,
  collection: 'raw',
};

// Shopify API mock responses
export const mockShopifyCart = {
  id: 'test-cart-id',
  checkoutUrl: 'https://test-store.myshopify.test/checkout/test-cart-id',
  lines: { edges: [] },
};

export const mockShopifyCartWithItems = {
  id: 'test-cart-id',
  checkoutUrl: 'https://test-store.myshopify.test/checkout/test-cart-id',
  lines: {
    edges: [
      {
        node: {
          id: 'line-1',
          quantity: 1,
          merchandise: {
            id: 'variant-1',
            product: {
              title: 'Test Product',
              featuredImage: { url: 'https://test-store.myshopify.test/image.jpg' },
            },
            price: { amount: '25.00' },
          },
        },
      },
    ],
  },
};

export const mockCartItem = {
  id: 'line-1',
  lineId: 'line-1',
  productId: 'product-1',
  variantId: 'variant-1',
  slug: 'test-product',
  title: 'Test Product',
  category: 'raw',
  price: 25,
  qty: 1,
  image: 'https://test-store.myshopify.test/image.jpg',
};
