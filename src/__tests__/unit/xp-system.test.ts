import { describe, it, expect } from 'vitest';
import {
  calculateXP,
  calculateLevel,
  getNextLevelXP,
  hasReachedScanLimit,
  XP_VALUES,
  MEMBERSHIP_MULTIPLIERS,
} from '../../lib/xp-system';

describe('XP System', () => {
  describe('calculateXP', () => {
    it('calculates XP for beacon scan with free tier', () => {
      const xp = calculateXP('beacon-scan', 'free');
      expect(xp).toBe(10); // 10 * 1 * 1
    });

    it('applies membership multiplier for member tier', () => {
      const xp = calculateXP('beacon-scan', 'member');
      expect(xp).toBe(20); // 10 * 2 * 1
    });

    it('applies membership multiplier for plus tier', () => {
      const xp = calculateXP('beacon-scan', 'plus');
      expect(xp).toBe(30); // 10 * 3 * 1
    });

    it('applies membership multiplier for pro tier', () => {
      const xp = calculateXP('beacon-scan', 'pro');
      expect(xp).toBe(50); // 10 * 5 * 1
    });

    it('applies bonus multiplier', () => {
      const xp = calculateXP('beacon-scan', 'free', 2);
      expect(xp).toBe(20); // 10 * 1 * 2
    });

    it('applies both membership and bonus multipliers', () => {
      const xp = calculateXP('beacon-scan', 'member', 2);
      expect(xp).toBe(40); // 10 * 2 * 2
    });

    it('calculates XP for different actions', () => {
      expect(calculateXP('purchase-shop', 'free')).toBe(50);
      expect(calculateXP('profile-complete', 'free')).toBe(100);
      expect(calculateXP('referral', 'free')).toBe(200);
    });

    it('rounds fractional XP values', () => {
      const xp = calculateXP('track-stream', 'free', 1.5);
      expect(xp).toBe(8); // Math.round(5 * 1 * 1.5) = 8
    });
  });

  describe('calculateLevel', () => {
    it('calculates level 0 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(0);
    });

    it('calculates level 1 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(1);
    });

    it('calculates level 2 for 400 XP', () => {
      expect(calculateLevel(400)).toBe(2);
    });

    it('calculates level 10 for 10000 XP', () => {
      expect(calculateLevel(10000)).toBe(10);
    });

    it('handles partial level progress', () => {
      expect(calculateLevel(250)).toBe(1); // Between level 1 and 2
      expect(calculateLevel(399)).toBe(1); // Just before level 2
    });
  });

  describe('getNextLevelXP', () => {
    it('calculates XP needed for level 1', () => {
      expect(getNextLevelXP(0)).toBe(100); // 1 * 1 * 100
    });

    it('calculates XP needed for level 2', () => {
      expect(getNextLevelXP(1)).toBe(400); // 2 * 2 * 100
    });

    it('calculates XP needed for level 3', () => {
      expect(getNextLevelXP(2)).toBe(900); // 3 * 3 * 100
    });

    it('calculates XP needed for level 10', () => {
      expect(getNextLevelXP(9)).toBe(10000); // 10 * 10 * 100
    });
  });

  describe('hasReachedScanLimit', () => {
    it('returns false for free tier with scans under limit', () => {
      expect(hasReachedScanLimit(5, 'free')).toBe(false);
      expect(hasReachedScanLimit(9, 'free')).toBe(false);
    });

    it('returns true for free tier at limit', () => {
      expect(hasReachedScanLimit(10, 'free')).toBe(true);
    });

    it('returns true for free tier over limit', () => {
      expect(hasReachedScanLimit(15, 'free')).toBe(true);
    });

    it('returns false for member tier with scans under limit', () => {
      expect(hasReachedScanLimit(50, 'member')).toBe(false);
      expect(hasReachedScanLimit(99, 'member')).toBe(false);
    });

    it('returns true for member tier at limit', () => {
      expect(hasReachedScanLimit(100, 'member')).toBe(true);
    });

    it('returns false for plus tier (unlimited)', () => {
      expect(hasReachedScanLimit(0, 'plus')).toBe(false);
      expect(hasReachedScanLimit(1000, 'plus')).toBe(false);
      expect(hasReachedScanLimit(999999, 'plus')).toBe(false);
    });

    it('returns false for pro tier (unlimited)', () => {
      expect(hasReachedScanLimit(0, 'pro')).toBe(false);
      expect(hasReachedScanLimit(1000, 'pro')).toBe(false);
      expect(hasReachedScanLimit(999999, 'pro')).toBe(false);
    });
  });

  describe('Constants', () => {
    it('has correct XP values for all sources', () => {
      expect(XP_VALUES['beacon-scan']).toBe(10);
      expect(XP_VALUES['purchase-shop']).toBe(50);
      expect(XP_VALUES['purchase-market']).toBe(30);
      expect(XP_VALUES['profile-complete']).toBe(100);
      expect(XP_VALUES['referral']).toBe(200);
      expect(XP_VALUES['quest-complete']).toBe(500);
    });

    it('has correct membership multipliers', () => {
      expect(MEMBERSHIP_MULTIPLIERS.free).toBe(1);
      expect(MEMBERSHIP_MULTIPLIERS.member).toBe(2);
      expect(MEMBERSHIP_MULTIPLIERS.plus).toBe(3);
      expect(MEMBERSHIP_MULTIPLIERS.pro).toBe(5);
    });
  });
});
