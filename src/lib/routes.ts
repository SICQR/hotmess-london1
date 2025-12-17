// lib/routes.ts
// HOTMESS LONDON - Single Source of Truth Route Registry
// Prevents drift between Tickets/Connect/Records/Beacons
// Includes nav groups, access gates, and legacy redirect map

// ============================================================================
// TYPES
// ============================================================================

export type NavGroup = "primary" | "utility" | "hidden" | "admin";

export type RouteId =
  // Core Navigation
  | "home"
  | "scan" // NEW: Scan/Enter code page
  // Arrival Flow
  | "enter" // NEW: Eligibility gate
  | "system" // NEW: System definition
  | "boundaries" // NEW: Boundaries notice
  | "carePosition" // NEW: Care position
  | "arrivalPrivacy" // NEW: Privacy position (arrival flow)
  | "beacons"
  | "beaconCreate" // NEW: Create new beacon
  | "navHub" // NEW: Navigation hub for testing
  | "tickets"
  | "ticketsBeacon"
  | "ticketsListing"
  | "ticketsPurchase"
  | "ticketOrderConfirmation" // NEW: P0 ticket order confirmation
  | "myTickets"
  | "messmarket"
  | "messmessMarketProduct"
  | "messmarketOrder"
  | "messmarketCheckout"
  | "vendorProfile" // NEW: P0 seller/vendor profile
  | "records"
  | "recordsReleases"
  | "recordsRelease"
  | "recordsLibrary"
  // RAW Convict
  | "rawManager"
  | "artistPage"
  | "shop"
  | "shopRaw"
  | "shopHung"
  | "shopHigh"
  | "shopSuper"
  | "shopProduct"
  | "shopCart"
  | "shopCheckout"
  | "shopPurchase"
  | "shopOrder"
  // Connect (Dating/Hookup Module) - PRODUCTION READY
  | "connect"
  | "connectCreate" // NEW: Create intent at venue
  | "connectThreads" // NEW: View all threads
  | "connectThread" // NEW: View specific thread/chat
  | "connectDiscovery"
  | "connectProfile"
  | "connectMatches"
  | "connectMessages"
  | "connectMessageThread"
  // Unified Threads (legacy)
  | "threads"
  | "thread"
  // Utility
  | "radio"
  | "radioNowPlaying" // NEW: P0 now playing full page
  | "radioSchedule"
  | "radioShow"
  | "radioEpisode"
  | "care"
  | "community"
  | "communityPost"
  | "communityNew"
  | "communityWhyRooms" // NEW: Why Rooms educational page
  | "rooms" // NEW: Rooms Directory (Telegram bridge)
  | "hnhMess"
  // Map & Beacons
  | "map"
  | "nightPulse" // NEW: Night Pulse 3D globe heat map
  | "city" // NEW: City page template
  | "cityHome" // NEW: P0 city home
  | "beaconScan"
  | "beaconsGlobe"
  | "earth"
  | "beaconsEarth3d"
  // Account
  | "account"
  | "accountProfile"
  | "accountOrders"
  | "accountConsents"
  | "accountTickets"
  | "profile"
  | "settings" // User settings
  | "saved" // NEW: Saved content dashboard
  | "notifications" // NEW: Notifications center
  | "search" // NEW: Global search
  // Auth
  | "login"
  | "register"
  | "welcome"
  | "logout" // NEW: Logout route
  | "qrLogin"
  | "qrApprove"
  | "passwordReset"
  | "setNewPassword"
  // Legal
  | "legal"
  | "legalTerms"
  | "legalPrivacy"
  | "legalCookies"
  | "legalGuidelines"
  | "legalSafety"
  | "legalAccessibility"
  | "legalAdvertising"
  | "legalAffiliates"
  | "legalCareDisclaimer"
  | "legal18Plus"
  | "dataPrivacy"
  | "dataPrivacyDsar"
  | "dataPrivacyDelete"
  | "dataPrivacyExport"
  | "ugcModeration"
  | "abuseReporting"
  | "dmca"
  | "accessibility"
  | "pressRoom"
  // Admin
  | "admin"
  | "adminModeration"
  | "adminBeacons"
  | "adminGlobeView" // NEW: 3D globe view of beacons
  | "adminRecords"
  | "adminRecordsReleases"
  | "adminRecordsRelease"
  | "adminRecordsUpload" // NEW: Upload MP3s and covers
  | "adminOrders"
  | "adminOrdersNew"
  | "adminProducts"
  | "adminVendors"
  | "adminUsers"
  | "adminReports"
  | "adminContent"
  | "adminDsar"
  | "adminAudit"
  | "adminOverview"
  | "adminMarketSellers"
  // Seller
  | "sellerDashboard"
  | "sellerOnboarding"
  | "sellerListings"
  | "sellerListingsNew"
  | "sellerListingCreate"
  | "sellerListingEdit"
  | "sellerOrders"
  | "sellerPayouts"
  | "sellerSettings"
  | "sellerAnalytics"
  // Other
  | "drops"
  | "hookupScan"
  | "hookupCreate"
  | "hookupDashboard"
  | "globalOS" // NEW: 3D Globe global intelligence
  | "cityOS" // NEW: Per-city intelligence view
  | "rewards"
  | "trending"
  | "vendor"
  | "affiliate"
  | "editorial"
  | "components"
  | "diagnostics"
  | "beaconsManage"
  | "beaconAnalytics" // NEW: Beacon analytics page
  | "applyHost"
  | "pricing"
  | "membership" // Alias for pricing
  | "architectureHub"
  | "xpProfile" // NEW: XP gamification profile
  | "creatorOnboarding" // Creator onboarding flow
  // Club Mode
  | "clubDashboard"
  | "clubSettings"
  | "clubDoorScanner"
  | "clubEventCreate"
  | "clubEventDetail"
  | "clubEventEdit"
  // Beacon Scan Result
  | "beaconScanResult"
  // Quick Test Account Setup
  | "quickTestSetup"
  // Test pages
  | "testCart"
  | "authDebug"; // Debug auth state

export interface RouteDef {
  id: RouteId;
  label: string;
  href: string;
  group: NavGroup;
  auth?: boolean;
  admin?: boolean;
  description?: string;
}

// ============================================================================
// ROUTE REGISTRY (Single Source of Truth)
// ============================================================================

export const ROUTES: Record<RouteId, RouteDef> = {
  // ---- PRIMARY NAV ----
  home: {
    id: "home",
    label: "Home",
    href: "/",
    group: "primary",
  },
  scan: {
    id: "scan",
    label: "Scan",
    href: "/scan",
    group: "primary",
  },
  
  // ---- ARRIVAL FLOW ----
  enter: {
    id: "enter",
    label: "Enter",
    href: "/enter",
    group: "hidden",
    description: "Eligibility gate - age confirmation",
  },
  system: {
    id: "system",
    label: "System",
    href: "/system",
    group: "hidden",
    description: "System definition page",
  },
  boundaries: {
    id: "boundaries",
    label: "Boundaries",
    href: "/boundaries",
    group: "hidden",
    description: "Boundaries notice",
  },
  carePosition: {
    id: "carePosition",
    label: "Care Position",
    href: "/care-position",
    group: "hidden",
    description: "Care position statement",
  },
  arrivalPrivacy: {
    id: "arrivalPrivacy",
    label: "Privacy",
    href: "/arrival-privacy",
    group: "hidden",
    description: "Privacy position (arrival flow)",
  },
  
  beacons: {
    id: "beacons",
    label: "Beacons",
    href: "/beacons",
    group: "primary",
  },
  beaconCreate: {
    id: "beaconCreate",
    label: "Create Beacon",
    href: "/beacons/create",
    group: "hidden",
    auth: true,
    description: "Create a new QR beacon",
  },
  navHub: {
    id: "navHub",
    label: "Nav Hub",
    href: "/nav-hub",
    group: "hidden",
    description: "Navigation hub for testing",
  },
  tickets: {
    id: "tickets",
    label: "Tickets",
    href: "/tickets",
    group: "primary",
    description: "Buy & sell event tickets",
  },
  messmarket: {
    id: "messmarket",
    label: "MessMarket",
    href: "/messmarket",
    group: "primary",
  },
  records: {
    id: "records",
    label: "Records",
    href: "/records",
    group: "primary",
    description: "Label releases + SoundCloud previews",
  },
  shop: {
    id: "shop",
    label: "Shop",
    href: "/shop",
    group: "primary",
  },

  // ---- UTILITY NAV ----
  radio: {
    id: "radio",
    label: "Radio",
    href: "/radio",
    group: "utility",
  },
  care: {
    id: "care",
    label: "Care",
    href: "/care",
    group: "utility",
  },
  community: {
    id: "community",
    label: "Community",
    href: "/community",
    group: "utility",
  },
  communityWhyRooms: {
    id: "communityWhyRooms",
    label: "Why Rooms?",
    href: "/community/why-rooms",
    group: "hidden",
    description: "Educational page explaining Telegram rooms ecosystem",
  },
  rooms: {
    id: "rooms",
    label: "Rooms",
    href: "/rooms",
    group: "hidden",
    description: "Rooms Directory - Web to Telegram bridge",
  },
  hnhMess: {
    id: "hnhMess",
    label: "Hand N Hand",
    href: "/hnh-mess",
    group: "utility",
  },
  myTickets: {
    id: "myTickets",
    label: "My Tickets",
    href: "/my-tickets",
    group: "utility",
    auth: true,
    description: "Seller dashboard (was /tickets/me)",
  },
  account: {
    id: "account",
    label: "Account",
    href: "/account",
    group: "utility",
    auth: true,
  },

  // ---- TICKETS (Dynamic Routes) ----
  ticketsBeacon: {
    id: "ticketsBeacon",
    label: "Beacon Listings",
    href: "/tickets/:beaconId",
    group: "hidden",
  },
  ticketsListing: {
    id: "ticketsListing",
    label: "Listing Detail",
    href: "/tickets/listing/:listingId",
    group: "hidden",
  },
  ticketsPurchase: {
    id: "ticketsPurchase",
    label: "Purchase Ticket",
    href: "/tickets/purchase",
    group: "hidden",
    description: "Stripe checkout for event tickets",
  },
  ticketOrderConfirmation: {
    id: "ticketOrderConfirmation",
    label: "Order Confirmation",
    href: "/tickets/order/:orderId",
    group: "hidden",
    description: "Ticket order confirmation page",
  },

  // ---- CONNECT (Dating/Hookup Module) ---- PRODUCTION READY ✅
  connect: {
    id: "connect",
    label: "Connect",
    href: "/connect",
    group: "primary",
    auth: true,
    description: "Consent-first dating & hookup module for queer men 18+",
  },
  connectCreate: {
    id: "connectCreate",
    label: "Create Intent",
    href: "/connect/create",
    group: "hidden",
    auth: true,
    description: "Create an anonymous intent at a venue",
  },
  connectThreads: {
    id: "connectThreads",
    label: "Threads",
    href: "/connect/threads",
    group: "hidden",
    auth: true,
    description: "View all your Connect threads",
  },
  connectThread: {
    id: "connectThread",
    label: "Thread",
    href: "/connect/thread/:threadId",
    group: "hidden",
    auth: true,
    description: "View a specific Connect thread with real-time chat",
  },
  connectDiscovery: {
    id: "connectDiscovery",
    label: "Discovery",
    href: "/connect/discovery",
    group: "hidden",
    auth: true,
    description: "Discover new profiles",
  },
  connectProfile: {
    id: "connectProfile",
    label: "Profile",
    href: "/connect/profile/:profileId",
    group: "hidden",
    auth: true,
    description: "View a user's Connect profile",
  },
  connectMatches: {
    id: "connectMatches",
    label: "Matches",
    href: "/connect/matches",
    group: "hidden",
    auth: true,
    description: "View your matches",
  },
  connectMessages: {
    id: "connectMessages",
    label: "Messages",
    href: "/connect/messages",
    group: "hidden",
    auth: true,
    description: "View all message threads",
  },
  connectMessageThread: {
    id: "connectMessageThread",
    label: "Thread",
    href: "/connect/messages/:threadId",
    group: "hidden",
    auth: true,
    description: "View a specific message conversation",
  },

  // ---- UNIFIED THREADS ----
  threads: {
    id: "threads",
    label: "Threads",
    href: "/threads",
    group: "hidden",
    auth: true,
    description: "Unified messaging (tickets + connect)",
  },
  thread: {
    id: "thread",
    label: "Thread",
    href: "/threads/:threadId",
    group: "hidden",
    auth: true,
    description: "Single thread view with templates + proof upload",
  },

  // ---- RECORDS ----
  recordsReleases: {
    id: "recordsReleases",
    label: "Releases",
    href: "/records/releases",
    group: "hidden",
  },
  recordsRelease: {
    id: "recordsRelease",
    label: "Release Detail",
    href: "/records/releases/:slug",
    group: "hidden",
    description: "SoundCloud preview + HQ downloads",
  },
  recordsLibrary: {
    id: "recordsLibrary",
    label: "My Library",
    href: "/records/library",
    group: "hidden",
    auth: true,
    description: "Your saved releases and downloads",
  },

  // ---- RAW CONVICT ----
  rawManager: {
    id: "rawManager",
    label: "RAW Manager",
    href: "/raw/manager",
    group: "admin",
    description: "RAW Convict drop manager dashboard",
  },
  artistPage: {
    id: "artistPage",
    label: "Artist Profile",
    href: "/raw/artist/:artistId",
    group: "hidden",
    description: "Dynamic artist profile page",
  },

  // ---- SHOP ----
  shopRaw: {
    id: "shopRaw",
    label: "Raw",
    href: "/shop/raw",
    group: "hidden",
  },
  shopHung: {
    id: "shopHung",
    label: "Hung",
    href: "/shop/hung",
    group: "hidden",
  },
  shopHigh: {
    id: "shopHigh",
    label: "High",
    href: "/shop/high",
    group: "hidden",
  },
  shopSuper: {
    id: "shopSuper",
    label: "Super",
    href: "/shop/super",
    group: "hidden",
  },
  shopProduct: {
    id: "shopProduct",
    label: "Product",
    href: "/shop/product/:slug",
    group: "hidden",
  },
  shopCart: {
    id: "shopCart",
    label: "Cart",
    href: "/shop/cart",
    group: "hidden",
  },
  shopCheckout: {
    id: "shopCheckout",
    label: "Checkout",
    href: "/shop/checkout",
    group: "hidden",
  },
  shopPurchase: {
    id: "shopPurchase",
    label: "Purchase",
    href: "/shop/purchase",
    group: "hidden",
    description: "Shop checkout with Stripe",
  },
  shopOrder: {
    id: "shopOrder",
    label: "Order",
    href: "/shop/order/:id",
    group: "hidden",
  },

  // ---- MESSMARKET ----
  messmessMarketProduct: {
    id: "messmessMarketProduct",
    label: "Product",
    href: "/messmarket/product/:slug",
    group: "hidden",
  },
  messmarketOrder: {
    id: "messmarketOrder",
    label: "Order Confirmation",
    href: "/messmarket/orders/:orderId",
    group: "hidden",
  },
  messmarketCheckout: {
    id: "messmarketCheckout",
    label: "Checkout",
    href: "/messmarket/checkout",
    group: "hidden",
    description: "MessMarket checkout with Stripe",
  },

  // NEW P0 ROUTES
  vendorProfile: {
    id: "vendorProfile",
    label: "Vendor Profile",
    href: "/messmarket/vendor/:username",
    group: "hidden",
    description: "Vendor/seller profile page",
  },

  // ---- RADIO ----
  radioSchedule: {
    id: "radioSchedule",
    label: "Schedule",
    href: "/radio/schedule",
    group: "hidden",
  },
  radioShow: {
    id: "radioShow",
    label: "Show",
    href: "/radio/shows/:slug",
    group: "hidden",
  },
  radioEpisode: {
    id: "radioEpisode",
    label: "Episode",
    href: "/radio/episodes/:slug",
    group: "hidden",
  },
  radioNowPlaying: {
    id: "radioNowPlaying",
    label: "Now Playing",
    href: "/radio/now-playing",
    group: "hidden",
    description: "Full page now playing view",
  },

  // ---- COMMUNITY ----
  communityPost: {
    id: "communityPost",
    label: "Post",
    href: "/community/post/:id",
    group: "hidden",
  },
  communityNew: {
    id: "communityNew",
    label: "New Post",
    href: "/community/new",
    group: "hidden",
    auth: true,
  },

  // ---- MAP & BEACONS ----
  map: {
    id: "map",
    label: "MessMap",
    href: "/map",
    group: "utility",
  },
  nightPulse: {
    id: "nightPulse",
    label: "Night Pulse",
    href: "/night-pulse",
    group: "primary",
    description: "3D globe heat map of nightlife activity",
  },
  city: {
    id: "city",
    label: "City",
    href: "/city/:cityId",
    group: "hidden",
    description: "City-specific nightlife dashboard",
  },
  beaconScan: {
    id: "beaconScan",
    label: "Scan Beacon",
    href: "/beacon-scan",
    group: "hidden",
  },
  beaconsGlobe: {
    id: "beaconsGlobe",
    label: "Beacons Globe",
    href: "/beacons/globe",
    group: "hidden",
  },
  earth: {
    id: "earth",
    label: "Google Earth",
    href: "/earth",
    group: "hidden",
  },
  beaconsEarth3d: {
    id: "beaconsEarth3d",
    label: "Beacons Earth 3D",
    href: "/beacons/earth-3d",
    group: "hidden",
  },
  cityHome: {
    id: "cityHome",
    label: "City Home",
    href: "/city-home",
    group: "hidden",
    description: "City home page with beacon map",
  },

  // ---- ACCOUNT ----
  accountProfile: {
    id: "accountProfile",
    label: "Profile",
    href: "/account/profile",
    group: "hidden",
    auth: true,
  },
  accountOrders: {
    id: "accountOrders",
    label: "Orders",
    href: "/account/orders",
    group: "hidden",
    auth: true,
  },
  accountConsents: {
    id: "accountConsents",
    label: "Consents",
    href: "/account/consents",
    group: "hidden",
    auth: true,
  },
  accountTickets: {
    id: "accountTickets",
    label: "Support Tickets",
    href: "/account/tickets",
    group: "hidden",
    auth: true,
  },
  profile: {
    id: "profile",
    label: "Profile",
    href: "/profile",
    group: "hidden",
    auth: true,
  },
  settings: {
    id: "settings",
    label: "Settings",
    href: "/settings",
    group: "hidden",
    auth: true,
    description: "User settings and preferences",
  },
  saved: {
    id: "saved",
    label: "Saved",
    href: "/saved",
    group: "hidden",
    auth: true,
    description: "Saved content dashboard",
  },
  notifications: {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    group: "hidden",
    auth: true,
    description: "Activity feed and notifications",
  },
  search: {
    id: "search",
    label: "Search",
    href: "/search",
    group: "utility",
    description: "Search everything on HOTMESS",
  },

  // ---- AUTH ----
  login: {
    id: "login",
    label: "Login",
    href: "/login",
    group: "hidden",
  },
  register: {
    id: "register",
    label: "Register",
    href: "/register",
    group: "hidden",
  },
  welcome: {
    id: "welcome",
    label: "Welcome",
    href: "/welcome",
    group: "hidden",
    // No auth required - new users need to access this after registration
  },
  logout: {
    id: "logout",
    label: "Logout",
    href: "/logout",
    group: "hidden",
    auth: true,
    description: "Logout of your account",
  },
  qrLogin: {
    id: "qrLogin",
    label: "QR Login",
    href: "/qr-login",
    group: "hidden",
  },
  qrApprove: {
    id: "qrApprove",
    label: "QR Approve",
    href: "/qr-approve",
    group: "hidden",
  },
  passwordReset: {
    id: "passwordReset",
    label: "Reset Password",
    href: "/password-reset",
    group: "hidden",
  },
  setNewPassword: {
    id: "setNewPassword",
    label: "Set New Password",
    href: "/reset-password",
    group: "hidden",
  },

  // ---- LEGAL ----
  legal: {
    id: "legal",
    label: "Legal",
    href: "/legal",
    group: "hidden",
  },
  legalTerms: {
    id: "legalTerms",
    label: "Terms",
    href: "/legal/terms",
    group: "hidden",
  },
  legalPrivacy: {
    id: "legalPrivacy",
    label: "Privacy",
    href: "/legal/privacy",
    group: "hidden",
  },
  legalCookies: {
    id: "legalCookies",
    label: "Cookies",
    href: "/legal/cookies",
    group: "hidden",
  },
  legalGuidelines: {
    id: "legalGuidelines",
    label: "Community Guidelines",
    href: "/legal/guidelines",
    group: "hidden",
  },
  legalSafety: {
    id: "legalSafety",
    label: "Safety",
    href: "/legal/safety",
    group: "hidden",
  },
  legalAccessibility: {
    id: "legalAccessibility",
    label: "Accessibility",
    href: "/legal/accessibility",
    group: "hidden",
  },
  legalAdvertising: {
    id: "legalAdvertising",
    label: "Advertising",
    href: "/legal/advertising",
    group: "hidden",
  },
  legalAffiliates: {
    id: "legalAffiliates",
    label: "Affiliates",
    href: "/legal/affiliates",
    group: "hidden",
  },
  legalCareDisclaimer: {
    id: "legalCareDisclaimer",
    label: "Care Disclaimer",
    href: "/legal/care-disclaimer",
    group: "hidden",
  },
  legal18Plus: {
    id: "legal18Plus",
    label: "18+ Age Policy",
    href: "/legal/18-plus",
    group: "hidden",
  },
  dataPrivacy: {
    id: "dataPrivacy",
    label: "Data & Privacy",
    href: "/data-privacy",
    group: "hidden",
  },
  dataPrivacyDsar: {
    id: "dataPrivacyDsar",
    label: "DSAR Request",
    href: "/data-privacy/dsar",
    group: "hidden",
  },
  dataPrivacyDelete: {
    id: "dataPrivacyDelete",
    label: "Delete Account",
    href: "/data-privacy/delete",
    group: "hidden",
  },
  dataPrivacyExport: {
    id: "dataPrivacyExport",
    label: "Export Data",
    href: "/data-privacy/export",
    group: "hidden",
  },
  ugcModeration: {
    id: "ugcModeration",
    label: "UGC Moderation",
    href: "/ugc-moderation",
    group: "hidden",
  },
  abuseReporting: {
    id: "abuseReporting",
    label: "Report Abuse",
    href: "/abuse-reporting",
    group: "hidden",
  },
  dmca: {
    id: "dmca",
    label: "DMCA",
    href: "/dmca",
    group: "hidden",
  },
  accessibility: {
    id: "accessibility",
    label: "Accessibility",
    href: "/accessibility",
    group: "hidden",
  },
  pressRoom: {
    id: "pressRoom",
    label: "Press Room",
    href: "/press",
    group: "hidden",
  },

  // ---- ADMIN ----
  admin: {
    id: "admin",
    label: "Admin",
    href: "/admin",
    group: "admin",
    admin: true,
  },
  adminModeration: {
    id: "adminModeration",
    label: "Moderation",
    href: "/admin/moderation",
    group: "admin",
    admin: true,
  },
  adminBeacons: {
    id: "adminBeacons",
    label: "Beacons",
    href: "/admin/beacons",
    group: "admin",
    admin: true,
  },
  adminGlobeView: {
    id: "adminGlobeView",
    label: "3D Globe View",
    href: "/admin/globe",
    group: "admin",
    admin: true,
    description: "3D globe view of beacons",
  },
  adminMarketSellers: {
    id: "adminMarketSellers",
    label: "Market Sellers",
    href: "/admin/commerce/sellers",
    group: "admin",
    admin: true,
    description: "Approve/reject/suspend MessMarket sellers",
  },
  adminRecords: {
    id: "adminRecords",
    label: "Records",
    href: "/admin/records",
    group: "admin",
    admin: true,
  },
  adminRecordsReleases: {
    id: "adminRecordsReleases",
    label: "Records Releases",
    href: "/admin/records/releases",
    group: "admin",
    admin: true,
  },
  adminRecordsRelease: {
    id: "adminRecordsRelease",
    label: "Records Release",
    href: "/admin/records/releases/:id",
    group: "admin",
    admin: true,
  },
  adminRecordsUpload: {
    id: "adminRecordsUpload",
    label: "Upload MP3s and Covers",
    href: "/admin/records/upload",
    group: "admin",
    admin: true,
    description: "Upload MP3s and cover art for records",
  },
  adminOrders: {
    id: "adminOrders",
    label: "Orders",
    href: "/admin/orders",
    group: "admin",
    admin: true,
  },
  adminOrdersNew: {
    id: "adminOrdersNew",
    label: "New Order",
    href: "/admin/orders/new",
    group: "admin",
    admin: true,
  },
  adminProducts: {
    id: "adminProducts",
    label: "Products",
    href: "/admin/products",
    group: "admin",
    admin: true,
  },
  adminVendors: {
    id: "adminVendors",
    label: "Vendors",
    href: "/admin/vendors",
    group: "admin",
    admin: true,
  },
  adminUsers: {
    id: "adminUsers",
    label: "Users",
    href: "/admin/users",
    group: "admin",
    admin: true,
  },
  adminReports: {
    id: "adminReports",
    label: "Reports",
    href: "/admin/reports",
    group: "admin",
    admin: true,
  },
  adminContent: {
    id: "adminContent",
    label: "Content",
    href: "/admin/content",
    group: "admin",
    admin: true,
  },
  adminDsar: {
    id: "adminDsar",
    label: "DSAR",
    href: "/admin/dsar",
    group: "admin",
    admin: true,
  },
  adminAudit: {
    id: "adminAudit",
    label: "Audit Log",
    href: "/admin/audit",
    group: "admin",
    admin: true,
  },
  adminOverview: {
    id: "adminOverview",
    label: "Overview",
    href: "/admin/overview",
    group: "admin",
    admin: true,
  },

  // ---- SELLER ----
  sellerDashboard: {
    id: "sellerDashboard",
    label: "Dashboard",
    href: "/seller/dashboard",
    group: "hidden",
    auth: true,
  },
  sellerOnboarding: {
    id: "sellerOnboarding",
    label: "Seller Onboarding",
    href: "/seller/onboarding",
    group: "hidden",
    auth: true,
  },
  sellerListings: {
    id: "sellerListings",
    label: "Listings",
    href: "/seller/listings",
    group: "hidden",
    auth: true,
  },
  sellerListingsNew: {
    id: "sellerListingsNew",
    label: "New Listing",
    href: "/seller/listings/new",
    group: "hidden",
    auth: true,
  },
  sellerListingCreate: {
    id: "sellerListingCreate",
    label: "Create Listing",
    href: "/seller/listings/create",
    group: "hidden",
    auth: true,
  },
  sellerListingEdit: {
    id: "sellerListingEdit",
    label: "Edit Listing",
    href: "/seller/listings/:listingId/edit",
    group: "hidden",
    auth: true,
  },
  sellerOrders: {
    id: "sellerOrders",
    label: "Orders",
    href: "/seller/orders",
    group: "hidden",
    auth: true,
  },
  sellerPayouts: {
    id: "sellerPayouts",
    label: "Payouts",
    href: "/seller/payouts",
    group: "hidden",
    auth: true,
  },
  sellerSettings: {
    id: "sellerSettings",
    label: "Settings",
    href: "/seller/settings",
    group: "hidden",
    auth: true,
  },
  sellerAnalytics: {
    id: "sellerAnalytics",
    label: "Analytics",
    href: "/seller/analytics",
    group: "hidden",
    auth: true,
  },

  // ---- OTHER ----
  drops: {
    id: "drops",
    label: "Drops",
    href: "/drops",
    group: "primary",
    description: "Bot-powered product drops",
  },
  hookupScan: {
    id: "hookupScan",
    label: "Hook-Up Scan",
    href: "/hookup/scan",
    group: "hidden",
    description: "Scan hookup beacon QR code",
  },
  hookupCreate: {
    id: "hookupCreate",
    label: "Create Hook-Up Beacon",
    href: "/hookup/create",
    group: "hidden",
    auth: true,
    description: "Create room-based or 1:1 hookup beacons",
  },
  hookupDashboard: {
    id: "hookupDashboard",
    label: "My Hook-Up QRs",
    href: "/hookup/dashboard",
    group: "hidden",
    auth: true,
    description: "Manage your hookup beacons",
  },
  globalOS: {
    id: "globalOS",
    label: "Global OS",
    href: "/global",
    group: "primary",
    description: "3D Globe - Worldwide nightlife intelligence",
  },
  cityOS: {
    id: "cityOS",
    label: "City OS",
    href: "/city",
    group: "hidden",
    description: "City intelligence view",
  },
  rewards: {
    id: "rewards",
    label: "Rewards",
    href: "/rewards",
    group: "hidden",
  },
  trending: {
    id: "trending",
    label: "Trending",
    href: "/trending",
    group: "hidden",
  },
  vendor: {
    id: "vendor",
    label: "Vendor",
    href: "/vendor/:slug",
    group: "hidden",
  },
  affiliate: {
    id: "affiliate",
    label: "Affiliate",
    href: "/affiliate",
    group: "hidden",
  },
  editorial: {
    id: "editorial",
    label: "Editorial",
    href: "/editorial",
    group: "hidden",
  },
  components: {
    id: "components",
    label: "Components",
    href: "/components",
    group: "hidden",
  },
  diagnostics: {
    id: "diagnostics",
    label: "Diagnostics",
    href: "/?route=diagnostics",
    group: "hidden",
    description: "System diagnostics and health checks",
  },
  beaconsManage: {
    id: "beaconsManage",
    label: "Manage Beacons",
    href: "/beacons/manage",
    group: "hidden",
    description: "Create and manage QR beacons",
  },
  beaconAnalytics: {
    id: "beaconAnalytics",
    label: "Beacon Analytics",
    href: "/beacons/analytics",
    group: "hidden",
    description: "View detailed beacon analytics and performance",
  },
  applyHost: {
    id: "applyHost",
    label: "Apply to Host",
    href: "/apply/host",
    group: "hidden",
    description: "Apply to become a verified beacon host",
  },
  pricing: {
    id: "pricing",
    label: "Pricing",
    href: "/pricing",
    group: "utility",
    description: "Pricing for hosting and premium features",
  },
  membership: {
    id: "membership",
    label: "Membership",
    href: "/membership",
    group: "utility",
    description: "Membership tiers and benefits (alias for pricing)",
  },
  architectureHub: {
    id: "architectureHub",
    label: "Architecture Hub",
    href: "/dev/architecture",
    group: "hidden",
    description: "Internal developer documentation and system map",
  },
  xpProfile: {
    id: "xpProfile",
    label: "XP Profile",
    href: "/xp/profile",
    group: "hidden",
    auth: true,
    description: "XP gamification profile",
  },
  creatorOnboarding: {
    id: "creatorOnboarding",
    label: "Creator Onboarding",
    href: "/creator/onboarding",
    group: "hidden",
    auth: true,
    description: "Onboarding flow for content creators",
  },

  // ---- CLUB MODE ----
  clubDashboard: {
    id: "clubDashboard",
    label: "Club Mode",
    href: "/club/default",
    group: "admin",
    auth: false, // Changed to false so it's always visible for demo
    description: "Venue owner/manager dashboard",
  },
  clubSettings: {
    id: "clubSettings",
    label: "Club Settings",
    href: "/club/:clubId/settings",
    group: "hidden",
    auth: true,
  },
  clubDoorScanner: {
    id: "clubDoorScanner",
    label: "Door Scanner",
    href: "/club/:clubId/scanner",
    group: "hidden",
    auth: true,
    description: "Real-time ticket validation",
  },
  clubEventCreate: {
    id: "clubEventCreate",
    label: "Create Event",
    href: "/club/:clubId/events/new",
    group: "hidden",
    auth: true,
  },
  clubEventDetail: {
    id: "clubEventDetail",
    label: "Event Detail",
    href: "/events/:eventId",
    group: "hidden",
    description: "Public event page with ticket purchasing",
  },
  clubEventEdit: {
    id: "clubEventEdit",
    label: "Edit Event",
    href: "/club/:clubId/events/:eventId/edit",
    group: "hidden",
    auth: true,
  },

  // ---- BEACON SCAN RESULT ----
  beaconScanResult: {
    id: "beaconScanResult",
    label: "Beacon Scan Result",
    href: "/l/:code",
    group: "hidden",
    description: "Beacon scan processing via BRE",
  },

  // ---- QUICK TEST ACCOUNT SETUP ----
  quickTestSetup: {
    id: "quickTestSetup",
    label: "Quick Test Setup",
    href: "/test-account-setup",
    group: "hidden",
    description: "Quick test account creation for payment testing",
  },

  // ---- TEST PAGES ----
  testCart: {
    id: "testCart",
    label: "Cart Test",
    href: "/test-cart",
    group: "hidden",
    description: "Test cart API functionality",
  },
  authDebug: {
    id: "authDebug",
    label: "Auth Debug",
    href: "/auth-debug",
    group: "hidden",
    description: "Debug auth state",
  },
};

// ============================================================================
// LEGACY REDIRECTS (Prevent Drift)
// ============================================================================

export const LEGACY_REDIRECTS: Array<{
  from: RegExp;
  to: (m: RegExpMatchArray, url: URL) => string;
}> = [
  // Tickets legacy: /tickets/me → /my-tickets
  {
    from: /^\/tickets\/me$/,
    to: () => "/my-tickets",
  },

  // Tickets legacy: /tickets/thread/:id → /threads/:id?mode=ticket&listingId=...
  {
    from: /^\/tickets\/thread\/([^/]+)$/,
    to: (m, url) => {
      const threadId = m[1];
      const params = new URLSearchParams(url.search);
      if (!params.get("mode")) params.set("mode", "ticket");
      return `/threads/${threadId}?${params.toString()}`;
    },
  },

  // Connect legacy: /connect/thread/:id → /threads/:id?mode=connect
  {
    from: /^\/connect\/thread\/([^/]+)$/,
    to: (m, url) => {
      const threadId = m[1];
      const params = new URLSearchParams(url.search);
      if (!params.get("mode")) params.set("mode", "connect");
      return `/threads/${threadId}?${params.toString()}`;
    },
  },
];

// ============================================================================
// HELPERS
// ============================================================================

export function getRoute(id: RouteId): RouteDef {
  return ROUTES[id];
}

export function buildPath(id: RouteId, params?: Record<string, string>): string {
  let path = ROUTES[id].href;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }
  return path;
}

export function matchLegacyRedirect(pathname: string, url: URL): string | null {
  for (const redirect of LEGACY_REDIRECTS) {
    const match = pathname.match(redirect.from);
    if (match) {
      return redirect.to(match, url);
    }
  }
  return null;
}