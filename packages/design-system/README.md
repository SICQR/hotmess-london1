# @hotmess/design-system

Brand tokens, colors, and typography for the HOTMESS platform.

## Usage

```typescript
import { DESIGN_TOKENS, BUTTONS, XP } from '@hotmess/design-system';

// Use colors
const hotColor = DESIGN_TOKENS.colors.hot; // #E70F3C

// Use typography
const displayStyle = DESIGN_TOKENS.typography.display;

// Use UX writing tokens
const buttonText = BUTTONS.primary.scanBeacon; // "Scan Beacon"
const xpMessage = XP.earned; // "+{amount} XP — earned in sweat."
```

## Exports

- `DESIGN_TOKENS` - Colors, typography, spacing, radius, shadows, motion
- `TONE_TOKENS` - Global tone tokens
- `BUTTONS` - Button microcopy
- `FORMS` - Form labels and helpers
- `NOTIFICATIONS` - Success, warning, error messages
- `CONSENT` - Consent checkboxes and notices
- `CARE` - Hand N Hand care messages
- `MAP` - Map UI text
- `XP` - XP system messages
- `RADIO` - Radio UI text
- `SHOP` - Shop UI text
- `DROPS` - Drops UI text
- `PROFILE` - Profile UI text
- `REWARDS` - Rewards UI text
- `COMMUNITY` - Community rules
- `AUTH` - Authentication UI text
- `EMPTY_STATES` - Empty state messages
- `ERRORS` - Error messages
- `LEGAL` - Legal text
- `VENDOR` - Vendor UI text
- `AFFILIATE` - Affiliate UI text
- `ADMIN` - Admin messages
- `FINALE` - Global tagline
- `WORD_BANK` - Approved vocabulary
