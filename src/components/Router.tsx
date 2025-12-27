/**
 * HOTMESS LONDON — MAIN ROUTER
 * Query param-based routing for all 122+ routes
 */

import { useEffect } from 'react';
import { RouteId, ROUTES } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';

// Import all page components
import { Homepage } from '../pages/Homepage';
import { About } from '../pages/About';
import { NotFound } from '../pages/NotFound';
import { ScanEnterCode } from '../pages/ScanEnterCode';
import { Accessibility } from '../pages/Accessibility';

// Arrival Flow pages
import { HomePage as ArrivalHomePage } from '../pages/arrival/HomePage';
import { EnterPage } from '../pages/arrival/EnterPage';
import { SystemPage } from '../pages/arrival/SystemPage';
import { BoundariesPage } from '../pages/arrival/BoundariesPage';
import { CarePositionPage } from '../pages/arrival/CarePositionPage';
import { PrivacyPage as ArrivalPrivacyPage } from '../pages/arrival/PrivacyPage';

// Auth pages
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import { WelcomePage } from '../pages/WelcomePage';
import { QrLogin } from '../pages/QrLogin';
import { QrApprove } from '../pages/QrApprove';
import { PasswordResetPage } from '../pages/PasswordResetPage';
import { SetNewPasswordPage } from '../pages/SetNewPasswordPage';

// Shop pages
import { Shop } from '../pages/Shop';
import { ShopRaw } from '../pages/ShopRaw';
import { ShopHung } from '../pages/ShopHung';
import { ShopHigh } from '../pages/ShopHigh';
import { ShopSuper } from '../pages/ShopSuper';
import { ShopProductDetail } from '../pages/ShopProductDetail';
import { Cart } from '../pages/Cart';
import { ShopCheckout } from '../pages/ShopCheckout';
import { ShopPurchase } from '../pages/ShopPurchase';
import { ShopOrderConfirmation } from '../pages/ShopOrderConfirmation';

// MessMarket pages
import { MessMarketBrowse } from '../pages/MessMarketBrowse';
import { MessMarketProductPage } from '../pages/MessMarketProduct';
import MessMarketOrderConfirmation from '../pages/MessMarketOrderConfirmation';
import { MessMarketCheckout } from '../pages/MessMarketCheckout';

// Tickets pages
import { TicketsBrowse } from '../pages/TicketsBrowse';
import { TicketsBeacon } from '../pages/TicketsBeacon';
import { TicketListingDetail } from '../pages/tickets/TicketListingDetail';
import { MyTickets } from '../pages/MyTickets';
import PurchaseTicket from '../pages/tickets/PurchaseTicket';

// Radio pages
import { RadioNew } from '../pages/RadioNew';
import { RadioScheduleNew } from '../pages/RadioScheduleNew';
import { RadioShowDetail } from '../pages/RadioShowDetail';
import { RadioEpisodePlayer } from '../pages/RadioEpisodePlayer';

// Records pages
import { Records } from '../pages/Records';
import { RecordRelease } from '../pages/RecordRelease';
import { RecordsAdminUpload } from '../pages/RecordsAdminUpload';

// RAW Convict pages
import { RawManager } from '../pages/RawManager';
import { ArtistPage } from '../pages/ArtistPage';

// Community pages
import CommunityOverview from '../pages/CommunityOverview';
import CommunityWhyRooms from '../pages/CommunityWhyRooms';
import RoomsDirectory from '../pages/RoomsDirectory';
import { Events } from '../pages/Events';
import { SafePlaces } from '../pages/SafePlaces';
import { CareHub } from '../pages/CareHub';
import CityPage from '../pages/CityPage';
import XPProfile from '../pages/XPProfile';

// Connect pages
import { Connect } from '../pages/Connect';
import { ConnectCreate } from '../pages/ConnectCreate';
import { ConnectThreads } from '../pages/ConnectThreads';
import { ConnectThread } from '../pages/ConnectThread';
import { ConnectDiscovery } from '../pages/ConnectDiscovery';
import { ConnectProfile } from '../pages/ConnectProfile';
import { ConnectMatches } from '../pages/ConnectMatches';
import { ConnectMessages } from '../pages/ConnectMessages';
import { MessageThread } from '../pages/MessageThread';

// Legal pages
import { LegalTerms } from '../pages/LegalTerms';
import { LegalPrivacy } from '../pages/LegalPrivacy';
import { LegalCookies } from '../pages/LegalCookies';
import { LegalGuidelines } from '../pages/LegalGuidelines';
import { LegalSafety } from '../pages/LegalSafety';
import { LegalAccessibility } from '../pages/LegalAccessibility';
import { LegalAdvertising } from '../pages/LegalAdvertising';
import { LegalAffiliates } from '../pages/LegalAffiliates';

// Seller pages
import { SellerDashboard } from '../pages/seller/SellerDashboard';
import { SellerOnboarding } from '../pages/seller/SellerOnboarding';
import { SellerListingCreate } from '../pages/seller/SellerListingCreate';
import { SellerListingEdit } from '../pages/seller/SellerListingEdit';
import { SellerOrders } from '../pages/seller/SellerOrders';
import { SellerSettings } from '../pages/seller/SellerSettings';
import { SellerAnalytics } from '../pages/seller/SellerAnalytics';
import { SellerListings } from '../pages/seller/SellerListings';
import { SellerPayouts } from '../pages/seller/SellerPayouts';

// Admin pages
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminModeration } from '../pages/AdminModeration';
import { AdminBeacons } from '../pages/AdminBeacons';
import { AdminMarketSellers } from '../pages/admin/AdminMarketSellers';
import { AdminOverview } from '../pages/admin/AdminOverview';
import { AdminUsers } from '../pages/admin/AdminUsers';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminContent } from '../pages/admin/AdminContent';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminAudit } from '../pages/admin/AdminAudit';
import { AdminDsar } from '../pages/admin/AdminDsar';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminGlobeView } from '../pages/admin/AdminGlobeView';
import { AdminRecordsReleases } from '../pages/admin/AdminRecordsReleases';

// Debug pages
import { AuthDebug } from '../pages/AuthDebug';
import { ProjectDashboard } from '../pages/ProjectDashboard';

// User pages
import { Profile } from '../pages/Profile';
import { Settings } from '../pages/Settings';
import { SavedContent } from '../pages/SavedContent';
import { Notifications } from '../pages/Notifications';

// Other pages
import { MapPage } from '../pages/MapPage';
import { NightPulse } from '../pages/NightPulse';
import { BeaconCreate } from '../pages/BeaconCreate';
import { NavigationHub } from '../pages/NavigationHub';
import { Search as GlobalSearch } from '../pages/Search';
import { EditorialShowcase } from '../pages/EditorialShowcase';
import { ComponentLibrary } from '../pages/ComponentLibrary';
import { DiagnosticsPage } from '../pages/DiagnosticsPage';
import { ArchitectureHub } from '../pages/ArchitectureHub';
import { BeaconScanFlow } from '../pages/BeaconScanFlow';
import { BeaconManagement } from '../pages/BeaconManagement';
import { CreatorOnboarding } from '../pages/CreatorOnboarding';
import { Pricing } from '../pages/Pricing';
import { Beacons } from '../pages/Beacons';
import { BeaconAnalytics } from '../pages/BeaconAnalytics';
import { DropsHub } from '../pages/DropsHub';
import { MembershipPage } from '../pages/MembershipPage';
import { HookupScan } from '../pages/HookupScan';
import { HookupBeaconCreate } from '../pages/HookupBeaconCreate';
import HookupDashboard from '../pages/HookupDashboard';
import GlobalOS from '../pages/GlobalOS';
import CityOS from '../pages/CityOS';
import { Rewards } from '../pages/Rewards';
import CityHome from '../pages/CityHome';
import VendorProfile from '../pages/VendorProfile';
import TicketOrderConfirmation from '../pages/TicketOrderConfirmation';
import RadioNowPlaying from '../pages/RadioNowPlaying';
import { AbuseReporting } from '../pages/AbuseReporting';
import { EarthPage } from '../pages/EarthPage';
import { Affiliate } from '../pages/Affiliate';
import { Community } from '../pages/Community';
import { CommunityPostCreate } from '../pages/CommunityPostCreate';
import { Care } from '../pages/Care';
import { VendorPortal } from '../pages/VendorPortal';
import { 
  DataPrivacyHub, 
  DSAR as DataPrivacyDSAR, 
  DataExport as DataPrivacyExport, 
  DataDelete as DataPrivacyDelete,
  Account,
  AccountProfile,
  AccountOrders,
  AccountConsents,
  AccountTickets,
  UGCModeration,
  DMCA
} from '../pages/DataPrivacyAndAccountPages';
import { 
  LegalHub,
  Legal18Plus as Legal18PlusPage,
  LegalCareDisclaimer
} from '../pages/LegalPages';
import { PressRoom } from '../pages/PressRoom';
import { RecordsLibrary } from '../pages/RecordsLibrary';

// Club Mode pages
import ClubDashboard from '../pages/club/ClubDashboard';
import DoorScanner from '../pages/club/DoorScanner';
import CreateEvent from '../pages/club/CreateEvent';
import EventDetail from '../pages/club/EventDetail';
import ClubSettings from '../pages/club/ClubSettings';
import EditEvent from '../pages/club/EditEvent';

// Beacon Scan Result
import BeaconScanResult from '../pages/BeaconScanResult';

// Quick Test Setup
import QuickTestAccountSetup from '../pages/QuickTestAccountSetup';

interface RouterProps {
  currentRoute: RouteId;
  routeParams?: Record<string, string>;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Router({ currentRoute, routeParams, onNavigate }: RouterProps) {
  // Many legacy pages still type their navigation callbacks as `(route: string, params?: any)`.
  // Keep Router runtime strict (RouteId) but accept broader callback types for compatibility.
  const navigate: any = (route: string, params?: any) => onNavigate(route as any, params as any);
  const nav: any = navigate;
  const { user } = useAuth();

  // Check if route requires authentication and redirect if needed
  const currentRouteConfig = ROUTES[currentRoute];
  useEffect(() => {
    if (currentRouteConfig?.auth && !user) {
      console.warn(`🔒 Route "${currentRoute}" requires authentication. Redirecting to login.`);
      onNavigate('login');
    }
    if (currentRouteConfig?.admin && user && user.role !== 'admin') {
      console.warn(`⛔ Route "${currentRoute}" requires admin. Redirecting to home.`);
      onNavigate('home');
    }
  }, [currentRoute, currentRouteConfig?.auth, user, onNavigate]);

  // Route to component mapping
  const routes: Record<string, JSX.Element> = {
    // Public
    home: <Homepage onNavigate={nav} />,
    scan: <ScanEnterCode onNavigate={nav} />,
    about: <About onNavigate={nav} />,
    accessibility: <Accessibility onNavigate={nav} />,

    // Arrival Flow
    enter: <EnterPage onNavigate={nav} />,
    system: <SystemPage onNavigate={nav} />,
    boundaries: <BoundariesPage onNavigate={nav} />,
    carePosition: <CarePositionPage onNavigate={nav} />,
    arrivalPrivacy: <ArrivalPrivacyPage onNavigate={nav} />,

    // Auth
    login: <LoginPage onNavigate={nav} />,
    register: <RegisterPage onNavigate={nav} />,
    welcome: <WelcomePage onNavigate={nav} userName={user?.displayName} />,
    qrLogin: <QrLogin onNavigate={nav} />,
    qrApprove: <QrApprove onNavigate={nav} />,
    passwordReset: <PasswordResetPage onNavigate={nav} />,
    setNewPassword: <SetNewPasswordPage onNavigate={nav} />,

    // Shop
    shop: <Shop onNavigate={nav} />,
    shopRaw: <ShopRaw onNavigate={nav} />,
    shopHung: <ShopHung onNavigate={nav} />,
    shopHigh: <ShopHigh onNavigate={nav} />,
    shopSuper: <ShopSuper onNavigate={nav} />,
    shopProduct: <ShopProductDetail slug={routeParams?.slug || ''} onNavigate={nav} />,
    shopCart: <Cart onNavigate={nav} />,
    shopCheckout: <ShopCheckout onNavigate={nav} />,
    shopPurchase: <ShopPurchase onNavigate={nav} />,
    shopOrder: <ShopOrderConfirmation orderId={routeParams?.id || ''} onNavigate={nav} />,

    // MessMarket
    messmarket: <MessMarketBrowse onNavigate={nav} />,
    messmessMarketProduct: <MessMarketProductPage slug={routeParams?.slug || ''} onNavigate={nav} />,
    messmarketOrder: <MessMarketOrderConfirmation orderId={routeParams?.orderId || ''} onNavigate={nav} />,
    messmarketCheckout: <MessMarketCheckout listingId={routeParams?.listingId || ''} onNavigate={nav} />,
    vendorProfile: <VendorProfile onNavigate={nav} />,

    // Tickets
    tickets: <TicketsBrowse onNavigate={nav} />,
    ticketsBeacon: <TicketsBeacon beaconId={routeParams?.beaconId || ''} onNavigate={nav} />,
    ticketsListing: <TicketListingDetail listingId={routeParams?.listingId || ''} onNavigate={nav} />,
    ticketsPurchase: <PurchaseTicket />,
    ticketOrderConfirmation: <TicketOrderConfirmation onNavigate={nav} />,
    myTickets: <MyTickets onNavigate={nav} />,

    // Radio
    radio: <RadioNew onNavigate={nav} />,
    radioSchedule: <RadioScheduleNew onNavigate={nav} />,
    radioShow: <RadioShowDetail slug={routeParams?.slug || ''} onNavigate={nav} />,
    radioEpisode: <RadioEpisodePlayer slug={routeParams?.slug || ''} onNavigate={nav} />,
    radioNowPlaying: <RadioNowPlaying onNavigate={nav} />,

    // Records
    records: <Records onNavigate={nav} />,
    recordsRelease: <RecordRelease slug={routeParams?.slug || ''} onNavigate={nav} />,
    recordsLibrary: <RecordsLibrary onNavigate={nav} />,
    adminRecordsUpload: <RecordsAdminUpload onNavigate={nav} />,

    // RAW Convict
    rawManager: <RawManager onNavigate={nav} />,
    artistPage: <ArtistPage artistId={routeParams?.artistId || '1'} onNavigate={nav} />,

    // Community
    community: <CommunityOverview onNavigate={nav} />,
    communityWhyRooms: <CommunityWhyRooms onNavigate={nav} />,
    rooms: <RoomsDirectory onNavigate={nav} />,
    events: <Events onNavigate={nav} />,
    safePlaces: <SafePlaces onNavigate={nav} />,
    careHub: <CareHub onNavigate={nav} />,

    // Connect - PRODUCTION READY ✅
    connect: <Connect onNavigate={nav} />,
    connectCreate: <ConnectCreate onNavigate={nav} />,
    connectThreads: <ConnectThreads onNavigate={nav} />,
    connectThread: <ConnectThread threadId={routeParams?.threadId || ''} onNavigate={nav} />,
    connectDiscovery: <ConnectDiscovery onNavigate={nav} />,
    connectProfile: <ConnectProfile profileId={routeParams?.profileId || ''} onNavigate={nav} />,
    connectMatches: <ConnectMatches onNavigate={nav} />,
    connectMessages: <ConnectMessages onNavigate={nav} />,
    connectMessageThread: <MessageThread threadId={routeParams?.threadId || ''} onNavigate={nav} />,

    // Legal
    legal: <LegalHub onNavigate={nav} />,
    legalTerms: <LegalTerms onNavigate={nav} />,
    legalPrivacy: <LegalPrivacy onNavigate={nav} />,
    legalCookies: <LegalCookies onNavigate={nav} />,
    legalGuidelines: <LegalGuidelines onNavigate={nav} />,
    legalSafety: <LegalSafety onNavigate={nav} />,
    legalAccessibility: <LegalAccessibility onNavigate={nav} />,
    legalAdvertising: <LegalAdvertising onNavigate={nav} />,
    legalAffiliates: <LegalAffiliates onNavigate={nav} />,
    legalCareDisclaimer: <LegalCareDisclaimer onNavigate={nav} />,
    legal18Plus: <Legal18PlusPage onNavigate={nav} />,
    dataPrivacy: <DataPrivacyHub onNavigate={nav} />,
    dataPrivacyDsar: <DataPrivacyDSAR onNavigate={nav} />,
    dataPrivacyExport: <DataPrivacyExport onNavigate={nav} />,
    dataPrivacyDelete: <DataPrivacyDelete onNavigate={nav} />,
    ugcModeration: <UGCModeration onNavigate={nav} />,
    abuseReporting: <AbuseReporting onNavigate={nav} />,
    dmca: <DMCA onNavigate={nav} />,
    pressRoom: <PressRoom onNavigate={nav} />,

    // Seller
    sellerDashboard: <SellerDashboard onNavigate={nav} />,
    sellerOnboarding: <SellerOnboarding onNavigate={nav} />,
    sellerListingCreate: <SellerListingCreate onNavigate={nav} />,
    sellerListingEdit: <SellerListingEdit listingId={routeParams?.listingId || ''} onNavigate={nav} />,
    sellerOrders: <SellerOrders onNavigate={nav} />,
    sellerSettings: <SellerSettings onNavigate={nav} />,
    sellerAnalytics: <SellerAnalytics onNavigate={nav} />,
    sellerListings: <SellerListings onNavigate={nav} />,
    sellerPayouts: <SellerPayouts onNavigate={nav} />,

    // Admin
    admin: <AdminDashboard onNavigate={nav} />,
    adminDashboard: <AdminDashboard onNavigate={nav} />,
    adminModeration: <AdminModeration onNavigate={nav} />,
    adminBeacons: <AdminBeacons onNavigate={nav} />,
    adminMarketSellers: <AdminMarketSellers onNavigate={nav} />,
    adminOverview: <AdminOverview onNavigate={nav} />,
    adminUsers: <AdminUsers onNavigate={nav} />,
    adminProducts: <AdminProducts onNavigate={nav} />,
    adminContent: <AdminContent onNavigate={nav} />,
    adminReports: <AdminReports onNavigate={nav} />,
    adminAudit: <AdminAudit onNavigate={nav} />,
    adminDsar: <AdminDsar onNavigate={nav} />,
    adminOrders: <AdminOrders onNavigate={nav} />,
    adminGlobeView: <AdminGlobeView onNavigate={nav} />,
    adminRecordsReleases: <AdminRecordsReleases onNavigate={nav} />,

    // Debug
    authDebug: <AuthDebug />,
    projectDashboard: <ProjectDashboard onNavigate={nav} />,

    // User
    account: <Account onNavigate={nav} />,
    accountProfile: <AccountProfile onNavigate={nav} />,
    accountOrders: <AccountOrders onNavigate={nav} />,
    accountConsents: <AccountConsents onNavigate={nav} />,
    accountTickets: <AccountTickets onNavigate={nav} />,
    profile: <Profile userId={routeParams?.userId || user?.id || ''} onNavigate={nav} />,
    settings: <Settings onNavigate={nav} />,
    saved: <SavedContent onNavigate={nav} />,
    notifications: <Notifications onNavigate={nav} />,

    // Other
    map: <MapPage onNavigate={nav} />,
    nightPulse: <NightPulse onNavigate={nav} />,
    beaconCreate: <BeaconCreate onNavigate={nav} />,
    navHub: <NavigationHub onNavigate={nav} />,
    city: <CityPage cityId={routeParams?.cityId} onNavigate={nav} />,
    cityHome: <CityHome onNavigate={nav} />,
    search: <GlobalSearch onNavigate={nav} />,
    editorial: <EditorialShowcase onNavigate={nav} />,
    components: <ComponentLibrary onNavigate={nav} />,
    drops: <DropsHub onNavigate={nav} />,
    rewards: <Rewards onNavigate={nav} />,
    pricing: <MembershipPage onNavigate={nav} />,
    membership: <MembershipPage onNavigate={nav} />,
    diagnostics: <DiagnosticsPage />,
    architectureHub: <ArchitectureHub onNavigate={nav} />,
    beaconScan: <BeaconScanFlow code={routeParams?.code} onNavigate={nav} />,
    beaconsManage: <BeaconManagement onNavigate={nav} />,
    hookupScan: <HookupScan code={routeParams?.code || ''} onNavigate={nav} />,
    hookupCreate: <HookupBeaconCreate onNavigate={nav} />,
    hookupDashboard: <HookupDashboard onNavigate={nav} />,
    globalOS: <GlobalOS onNavigate={nav} />,
    cityOS: <CityOS city={routeParams?.city} onNavigate={nav} />,
    applyHost: <CreatorOnboarding onNavigate={nav} />,
    creatorOnboarding: <CreatorOnboarding onNavigate={nav} />,
    xpProfile: <XPProfile onNavigate={nav} />,
    beacons: <Beacons onNavigate={nav} />,
    beaconAnalytics: <BeaconAnalytics beaconCode={routeParams?.code || ''} onNavigate={nav} />,
    earth: <EarthPage onNavigate={nav} />,
    affiliate: <Affiliate onNavigate={nav} />,
    care: <Care onNavigate={nav} />,
    communityPost: <Community onNavigate={nav} />,
    communityNew: <CommunityPostCreate onNavigate={nav} />,
    vendor: <VendorPortal onNavigate={navigate} />,
    trending: <NotFound onNavigate={navigate} />,

    // Club Mode
    clubDashboard: <ClubDashboard clubId={routeParams?.clubId || ''} onNavigate={navigate} />,
    clubDoorScanner: <DoorScanner clubId={routeParams?.clubId || ''} eventId={routeParams?.eventId} onNavigate={navigate} />,
    clubEventCreate: <CreateEvent clubId={routeParams?.clubId || ''} onNavigate={navigate} />,
    clubEventDetail: <EventDetail eventId={routeParams?.eventId || ''} onNavigate={navigate} />,
    clubSettings: <ClubSettings clubId={routeParams?.clubId || ''} onNavigate={navigate} />,
    clubEventEdit: <EditEvent clubId={routeParams?.clubId || ''} eventId={routeParams?.eventId || ''} onNavigate={navigate} />,

    // Beacon Scan Result
    beaconScanResult: <BeaconScanResult code={routeParams?.code || ''} onNavigate={navigate} />,

    // Quick Test Account Setup
    quickTestSetup: <QuickTestAccountSetup />,

    // Test pages
    // testCart route removed - cart-api.ts was deleted
  };

  // If route requires auth and user not logged in, show login page
  if (currentRouteConfig?.auth && !user) {
    return <LoginPage onNavigate={nav} />;
  }

  // If route requires admin and user is not admin, block access.
  if (currentRouteConfig?.admin && user && user.role !== 'admin') {
    return <NotFound onNavigate={nav} />;
  }

  // If route requires admin and user is not logged in, show login page.
  if (currentRouteConfig?.admin && !user) {
    return <LoginPage onNavigate={nav} />;
  }

  return routes[currentRoute] || <NotFound onNavigate={nav} />;
}