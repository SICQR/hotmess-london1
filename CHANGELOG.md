# Changelog

All notable changes to HOTMESS LONDON will be documented in this file.

## [Unreleased]

### Phase 1 - GDPR/Privacy Hub ✅ COMPLETE
- ✅ Complete GDPR compliance interface at `/privacy-hub`
- ✅ Data Subject Access Request (DSAR) - Article 15
- ✅ Right to Deletion - Article 17  
- ✅ Data Portability - Article 20
- ✅ Consent withdrawal - Article 7(3)
- ✅ Third-party service management
- ✅ Privacy preferences API (`/api/privacy/*`)
- ✅ One-click data export (complete JSON package)
- ✅ Account deletion with audit trail

### Beacon OS - Complete Specification & Implementation
- ✅ Complete Beacon OS specification (`/docs/BEACONS.md`)
- ✅ API contract documentation (`/docs/API_BEACONS.md`)
- ✅ Developer quick start guide (`/docs/BEACON_OS_QUICK_START.md`)
- ✅ Universal scan pipeline for `/l/:code` and `/x/:payload.:sig`
- ✅ 4 master beacon types: `presence`, `transaction`, `social`, `care`
- ✅ Type-specific handlers: check-ins, tickets, resale, products, drops, person QRs, rooms, care
- ✅ XP engine with tier multipliers and daily caps
- ✅ Signed beacon payload system for secure hook-ups and ticket resale
- ✅ Geo modes: none, venue, city, exact_fuzzed
- ✅ Safety & privacy compliance built into scan pipeline
- ✅ **Runnable demo backend** (`/beacon-backend/`) - Complete TypeScript/Express implementation with in-memory data
- ✅ **Frontend integration system** - Reusable hook + shell + renderer pattern for scan UX

### Phase 2 - Systematic Consent Gates
- Location permission flows
- Data usage consent gates
- Privacy-first onboarding

## [0.1.0] - 2024-12-06

### ✅ Fixed - Critical Auth Issues
- Fixed all "AuthSessionMissingError" issues across the application
- Created proper server-side Supabase client implementation in `/utils/supabase/server.ts`
- Implemented complete auth forms (login, register, password reset)
- Added missing `/seller/dashboard` route
- Created branded 404 page with HOTMESS aesthetic

### ✅ Completed - Domain Migration
- Migrated all domain references from `hotmess.london` to `hotmessldn.com`
- Updated all server-side code with new domain
- Updated configuration files

### ✅ Completed - Last.fm Integration
- Implemented Last.fm API OAuth flow
- Created OAuth callback handlers
- Added scrobbling functionality
- Integrated real-time listener tracking

### ✅ Verified - Commerce Systems
- Confirmed Shopify integration pulling real products
- Verified Records music distribution platform (100% operational)
- Tested Stripe Connect seller onboarding
- Validated MessMarket detail pages

### 🎯 System Status
- **122+ API routes** fully operational
- **6 beacon types** implemented and tested
- **4 QR code styles** (RAW, HOTMESS, CHROME, STEALTH)
- **Two-engine commerce** (Shopify + Supabase marketplace)
- **C2C ticket resale** marketplace active
- **Trust & safety** features (block, mute, report)
- **Content moderation** dashboard operational

## [0.0.9] - 2024-12-05

### Added
- MessMarket listing detail pages
- Seller dashboard with Stripe Connect integration
- Trust & safety action sheets
- Content moderation queue

### Fixed
- Auth session handling improvements
- Supabase client initialization

## [0.0.8] - 2024-12-04

### Added
- Last.fm Radio integration
- OAuth callback system
- Music scrobbling functionality
- Real-time listener counts

### Improved
- Radio player UI/UX
- Audio streaming performance

## [0.0.7] - 2024-12-03

### Added
- Records music distribution platform
- Track upload and management
- SoundCloud preview integration
- Download tracking system

### Improved
- Audio player controls
- Queue management

## [0.0.6] - 2024-12-02

### Added
- C2C ticket resale marketplace
- Ticket listing creation
- Thread-based negotiation system
- Proof upload functionality

### Improved
- Ticket purchase flow
- Seller verification

## [0.0.5] - 2024-12-01

### Added
- Trust & safety features
- Block and mute functionality
- Report modal and moderation queue
- Admin moderation dashboard

### Improved
- User safety controls
- Content moderation tools

## [0.0.4] - 2024-11-30

### Added
- Real-time messaging system
- Thread attachments
- Message status indicators
- Thread safety menu

### Improved
- Message delivery reliability
- Real-time updates

## [0.0.3] - 2024-11-29

### Added
- Seller dashboard
- Stripe Connect onboarding
- Listing management
- Analytics tracking

### Improved
- Payment flow
- Seller experience

## [0.0.2] - 2024-11-28

### Added
- HOTMESS QR Engine with 4 styles
- Beacon system (6 types)
- QR generation API
- Beacon scanner

### Improved
- QR code design
- Scanning performance

## [0.0.1] - 2024-11-27

### Added
- Initial project setup
- Night Pulse 3D globe
- Mapbox GL JS integration
- Basic navigation
- Authentication system
- User profiles

---

## Version Naming

- **Major versions** (1.0.0): Complete platform launches or major architectural changes
- **Minor versions** (0.1.0): New feature sets or significant improvements
- **Patch versions** (0.0.1): Bug fixes and minor improvements

## Support

For issues, questions, or feature requests, please contact the HOTMESS LONDON development team.

---

**Built with care for the queer nightlife community** 🖤💗