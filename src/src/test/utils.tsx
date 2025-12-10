/**
 * Test utilities and custom render functions
 */
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import { UserProvider } from '../contexts/UserContext'
import { CartProvider } from '../contexts/CartContext'
import { RadioProvider } from '../contexts/RadioContext'

/**
 * Custom render with all providers
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <CartProvider>
          <RadioProvider>{children}</RadioProvider>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

/**
 * Mock Supabase client for tests
 */
export const createMockSupabaseClient = () => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { session: null, user: null },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null,
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
  channel: vi.fn().mockReturnValue({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn(),
    send: vi.fn().mockResolvedValue('ok'),
  }),
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      download: vi.fn().mockResolvedValue({ data: null, error: null }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      createSignedUrl: vi.fn().mockResolvedValue({
        data: { signedUrl: 'https://example.com/signed' },
        error: null,
      }),
    }),
  },
})

/**
 * Mock authenticated user session
 */
export const mockAuthUser = {
  id: 'test-user-id',
  email: 'test@hotmess.london',
  user_metadata: {
    username: 'testuser',
  },
}

export const mockAuthSession = {
  access_token: 'mock-jwt-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockAuthUser,
}

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Accessibility test helper
 */
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe } = await import('axe-core')
  const results = await axe(container)
  return results.violations
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
