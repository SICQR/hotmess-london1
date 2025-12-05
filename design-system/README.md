# HOTMESS Design System

Production-ready UX writing system for HOTMESS LONDON.

## Structure

```
/design-system/
├── tokens.ts           # All microcopy tokens (buttons, notifications, etc.)
├── accessibility.ts    # ARIA labels, alt text, screen reader copy
├── legal.ts           # Legal documents (Privacy, Terms, DMCA, Care)
├── components.mdx     # Component documentation
└── README.md          # This file
```

## Usage

### In React Components

```tsx
import { BUTTONS, NOTIFICATIONS, XP } from '../design-system/tokens';

// Use directly
<button>{BUTTONS.primary.scanBeacon}</button>

// Use with hook
import { useCopy } from '../hooks/useCopy';

function MyComponent() {
  const copy = useCopy();
  return <p>{copy.xp.earned}</p>;
}
```

### With Variables

```tsx
import { replaceVars } from '../hooks/useCopy';
import { XP } from '../design-system/tokens';

const message = replaceVars(XP.earned, { amount: 50 });
// Result: "+50 XP — earned in sweat."
```

### Accessibility

```tsx
import { ARIA_LABELS } from '../design-system/accessibility';

<button aria-label={ARIA_LABELS.actions.scanBeacon}>
  Scan
</button>
```

## Principles

1. **Never hardcode copy.** Always use tokens.
2. **States matter.** Every component has loading, error, empty states.
3. **Accessibility first.** ARIA labels and alt text are mandatory.
4. **Tone consistency.** Masc, sweaty, care-first.
5. **Legal is sacred.** Don't modify without approval.

## Token Categories

- **TONE_TOKENS** - Reusable phrases (sweat, held, loud, etc.)
- **BUTTONS** - All button labels (primary, secondary, tertiary)
- **FORMS** - Form labels, helpers, errors
- **NOTIFICATIONS** - Toast messages (success, warning, error)
- **CONSENT** - Age gates, consent checkboxes
- **CARE** - Hand N Hand copy
- **MAP** - MessMap interface
- **XP** - XP system microcopy
- **RADIO** - Radio interface
- **SHOP** - Shop categories and states
- **DROPS** - Drop countdowns and states
- **PROFILE** - User profile
- **REWARDS** - Rewards interface
- **COMMUNITY** - Community guidelines
- **AUTH** - Login/signup
- **EMPTY_STATES** - Empty state messages
- **ERRORS** - Error messages
- **LEGAL** - Legal page intro text
- **VENDOR** - Vendor portal
- **AFFILIATE** - Affiliate program
- **ADMIN** - Admin dashboard
- **FINALE** - Global finale line

## Voice Guidelines

### Do
- Short, punchy, rhythmic
- Bold verbs: enter, scan, move, hold
- Masculine, present, sweaty
- Care-first under the heat
- Humour is dry, never mocking

### Don't
- Exclamation marks (unless ironic)
- Infantilising language
- "Babes", "hun", etc.
- Tech jargon in user-facing text
- Glamorize substance use
- Give medical advice

## Word Bank (Approved)

heat • pulse • held • loud • scan • sweat • rite • roam • drop • unlock • streak • surge • zone • flare • hum • tether • night body

## Figma Integration

Tokens in `/design-system/tokens.ts` map directly to Figma variables:

```
[token.sweat] = "earned in sweat"
[token.held] = "stay held"
[token.loud] = "stay loud"
```

Use these in Figma text layers for automatic sync.

## Contributing

1. Never modify tokens without reviewing voice guidelines
2. Test all changes across multiple components
3. Update `components.mdx` if adding new patterns
4. Run accessibility checks on new copy
5. Get approval for legal changes

## Support

Questions? Email: design-system@hotmess.london

---

**HOTMESS — care dressed as kink, built for the men who survived enough to want more.**
