/**
 * React hook for accessing UX copy tokens
 * Provides type-safe access to all microcopy
 */

import * as tokens from '../design-system/tokens';
import * as accessibility from '../design-system/accessibility';
import * as legal from '../design-system/legal';

export function useCopy() {
  return {
    // All token categories
    tone: tokens.TONE_TOKENS,
    buttons: tokens.BUTTONS,
    forms: tokens.FORMS,
    notifications: tokens.NOTIFICATIONS,
    consent: tokens.CONSENT,
    care: tokens.CARE,
    map: tokens.MAP,
    xp: tokens.XP,
    radio: tokens.RADIO,
    shop: tokens.SHOP,
    drops: tokens.DROPS,
    profile: tokens.PROFILE,
    rewards: tokens.REWARDS,
    community: tokens.COMMUNITY,
    auth: tokens.AUTH,
    emptyStates: tokens.EMPTY_STATES,
    errors: tokens.ERRORS,
    legal: tokens.LEGAL,
    vendor: tokens.VENDOR,
    affiliate: tokens.AFFILIATE,
    admin: tokens.ADMIN,
    finale: tokens.FINALE,
    
    // Accessibility
    aria: accessibility.ARIA_LABELS,
    altText: accessibility.ALT_TEXT,
    announcements: accessibility.ANNOUNCEMENTS,
    
    // Legal (full documents)
    legalDocs: {
      privacy: legal.PRIVACY_POLICY,
      terms: legal.TERMS_OF_SERVICE,
      dmca: legal.DMCA_POLICY,
      careDisclaimer: legal.CARE_DISCLAIMER,
      ageVerification: legal.AGE_VERIFICATION,
    },
  };
}

/**
 * Helper to replace template variables in strings
 * Example: replaceVars("+{amount} XP", { amount: 50 }) => "+50 XP"
 */
export function replaceVars(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template
  );
}
