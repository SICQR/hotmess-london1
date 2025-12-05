# HOTMESS London - Copilot Instructions

## Critical Rules

**Navigation:** Query params (`?route=page&slug=value`) NOT file-based routing  
**Images:** Use `ImageWithFallback` component for all new images  
**Routing:** `?route=messmessMarket`, `?route=sellerDashboard`, `?route=adminModeration`  
**Typography:** NEVER use Tailwind font classes (text-xl, font-bold, etc.) - defined in globals.css  
**Protected:** NEVER edit kv_store.tsx, info.tsx, ImageWithFallback.tsx  

## Tech Stack
React + TypeScript, Tailwind v4, Supabase (klbmalzhmxnelyuabawk), Stripe Connect, Custom routing

## Marketplace
- "Listings" not "products"
- "Sellers" not "merchants"  
- Platform fees: 12% standard, 20% White-Label
- Stock reservation system prevents overselling
- Edge Functions: `market-checkout-create`, `stripe-webhook`

## Tone
Bold, masculine, care-first. NEVER: "babes", "Amazon of Underworld"

## Compliance
- 18+ men-only, age gate required
- Consent prompts for UGC/uploads
- Care disclaimer: "Information not medical advice"
- GDPR: explicit opt-in, DSAR at `?route=accountPrivacy`

## Key Routes
Public: home, messmessMarket, radio, care, legal  
Auth: account, myTickets, recordsLibrary  
Seller: sellerDashboard, sellerListings, sellerOrders, sellerPayouts  
Admin: adminModeration, adminSellers, adminReports  
System: diagnostics

## Accessibility
Semantic HTML, ARIA labels, keyboard nav, focus states, alt text required

## Style
Dark neon (red/pink on black): bg-black, text-red-500, border-pink-600
