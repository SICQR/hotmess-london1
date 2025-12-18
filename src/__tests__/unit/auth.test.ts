import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAuthenticated, getAccessToken } from '../../lib/auth';

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('returns null when no token exists', () => {
      expect(getAccessToken()).toBeNull();
    });

    it('retrieves token from legacy key', () => {
      const testToken = 'test-token-123';
      localStorage.setItem('supabase.auth.token', testToken);
      expect(getAccessToken()).toBe(testToken);
    });

    it('retrieves token from Supabase session key with access_token', () => {
      const testToken = 'test-token-456';
      const sessionKey = 'sb-test-auth-token';
      localStorage.setItem(sessionKey, JSON.stringify({ access_token: testToken }));
      expect(getAccessToken()).toBe(testToken);
    });

    it('retrieves token from Supabase session key with accessToken', () => {
      const testToken = 'test-token-789';
      const sessionKey = 'sb-test-auth-token';
      localStorage.setItem(sessionKey, JSON.stringify({ accessToken: testToken }));
      expect(getAccessToken()).toBe(testToken);
    });

    it('retrieves token from nested currentSession structure', () => {
      const testToken = 'test-token-nested';
      const sessionKey = 'sb-test-auth-token';
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          currentSession: {
            access_token: testToken,
          },
        })
      );
      expect(getAccessToken()).toBe(testToken);
    });

    it('handles invalid JSON gracefully', () => {
      const sessionKey = 'sb-test-auth-token';
      localStorage.setItem(sessionKey, 'invalid-json{');
      expect(getAccessToken()).toBeNull();
    });

    it('returns null when session data has no token', () => {
      const sessionKey = 'sb-test-auth-token';
      localStorage.setItem(sessionKey, JSON.stringify({ user: { id: '123' } }));
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns true when token exists', () => {
      localStorage.setItem('supabase.auth.token', 'test-token');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns true when Supabase session exists', () => {
      const sessionKey = 'sb-test-auth-token';
      localStorage.setItem(sessionKey, JSON.stringify({ access_token: 'test-token' }));
      expect(isAuthenticated()).toBe(true);
    });
  });
});
