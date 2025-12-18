import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../../contexts/CartContext';

// Mock the Shopify cart API
// Note: Mock values are inlined to avoid hoisting issues with vi.mock
vi.mock('../../lib/shopify-cart', () => ({
  createCart: vi.fn().mockResolvedValue({
    id: 'test-cart-id',
    checkoutUrl: 'https://test-store.myshopify.test/checkout/test-cart-id',
    lines: { edges: [] },
  }),
  getCart: vi.fn().mockResolvedValue(null),
  addToCart: vi.fn().mockResolvedValue({
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
  }),
  updateCartLine: vi.fn(),
  removeFromCart: vi.fn(),
  transformShopifyCartToItems: vi.fn().mockReturnValue([
    {
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
    },
  ]),
}));

// Test component that uses the cart context
function TestCartComponent() {
  const { items, itemCount, loading } = useCart();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Item Count: {itemCount}</div>
      <div>Items: {items.length}</div>
      {items.map((item) => (
        <div key={item.id} data-testid="cart-item">
          {item.title} - ${item.price} x {item.qty}
        </div>
      ))}
    </div>
  );
}

describe('Cart Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders cart provider with no items initially', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Item Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Items: 0')).toBeInTheDocument();
  });

  it('provides cart context to children', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Cart context should be available
    expect(screen.getByText(/Item Count:/)).toBeInTheDocument();
  });

  it('cart context can handle loading state', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    // Wait for component to settle
    await waitFor(() => {
      expect(screen.getByText(/Item Count:/)).toBeInTheDocument();
    });

    // Cart should have loaded successfully
    expect(screen.getByText('Item Count: 0')).toBeInTheDocument();
    expect(screen.getByText('Items: 0')).toBeInTheDocument();
  });
});
