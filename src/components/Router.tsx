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

// Test pages
import TestCart from '../pages/test-cart';

interface RouterProps {
  currentRoute: RouteId;
  routeParams?: Record<string, string>;
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function Router({ currentRoute, routeParams, onNavigate }: RouterProps) {
  const navigate = (route: RouteId, params?: Record<string, string>) => onNavigate(route, params);
  const { user } = useAuth();

  // Check if route requires authentication and redirect if needed
  const currentRouteConfig = ROUTES[currentRoute];
  useEffect(() => {
    if (currentRouteConfig?.auth && !user) {
      console.warn(`🔒 Route "${currentRoute}" requires authentication. Redirecting to login.`);
      onNavigate('login');
    }
  }, [currentRoute, currentRouteConfig?.auth, user, onNavigate]);

  // Route to component mapping
  const routes: Partial<Record<RouteId, JSX.Element>> = {
    // Public
    home: <Homepage onNavigate={navigate} />,
    scan: <ScanEnterCode onNavigate={navigate} />,
    about: <About onNavigate={navigate} />,
    accessibility: <Accessibility onNavigate={navigate} />,

    // Auth
    login: <LoginPage onNavigate={navigate} />,
    register: <RegisterPage onNavigate={navigate} />,
    welcome: <WelcomePage onNavigate={navigate} userName={user?.displayName} />,
    qrLogin: <QrLogin onNavigate={navigate} />,
    qrApprove: <QrApprove onNavigate={navigate} />,
    passwordReset: <PasswordResetPage onNavigate={navigate} />,
    setNewPassword: <SetNewPasswordPage onNavigate={navigate} />,

    // Shop
    shop: <Shop onNavigate={navigate} />,
    shopRaw: <ShopRaw onNavigate={navigate} />,
    shopHung: <ShopHung onNavigate={navigate} />,
    shopHigh: <ShopHigh onNavigate={navigate} />,
    shopSuper: <ShopSuper onNavigate={navigate} />,
    shopProduct: <ShopProductDetail slug={routeParams?.slug || ''} onNavigate={navigate} />,
    shopCart: <Cart onNavigate={navigate} />,
    shopCheckout: <ShopCheckout onNavigate={navigate} />,
    shopPurchase: <ShopPurchase onNavigate={navigate} />,
    shopOrder: <ShopOrderConfirmation orderId={routeParams?.id || ''} onNavigate={navigate} />,

    // MessMarket
    messmarket: <MessMarketBrowse onNavigate={navigate} />,
    messmessMarketProduct: <MessMarketProductPage slug={routeParams?.slug || ''} onNavigate={navigate} />,
    messmarketOrder: <MessMarketOrderConfirmation orderId={routeParams?.orderId || ''} onNavigate={navigate} />,
    messmarketCheckout: <MessMarketCheckout listingId={routeParams?.listingId || ''} onNavigate={navigate} />,
    vendorProfile: <VendorProfile onNavigate={navigate} />,

    // Tickets
    tickets: <TicketsBrowse onNavigate={navigate} />,
    ticketsBeacon: <TicketsBeacon beaconId={routeParams?.beaconId || ''} onNavigate={navigate} />,
    ticketsListing: <TicketListingDetail listingId={routeParams?.listingId || ''} onNavigate={navigate} />,
    ticketsPurchase: <PurchaseTicket />,
    ticketOrderConfirmation: <TicketOrderConfirmation onNavigate={navigate} />,
    myTickets: <MyTickets onNavigate={navigate} />,

    // Radio
    radio: <RadioNew onNavigate={navigate} />,
    radioSchedule: <RadioScheduleNew onNavigate={navigate} />,
    radioShow: <RadioShowDetail slug={routeParams?.slug || ''} onNavigate={navigate} />,
    radioEpisode: <RadioEpisodePlayer slug={routeParams?.slug || ''} onNavigate={navigate} />,
    radioNowPlaying: <RadioNowPlaying onNavigate={navigate} />,

    // Records
    records: <Records onNavigate={navigate} />,
    recordsRelease: <RecordRelease slug={routeParams?.slug || ''} onNavigate={navigate} />,
    recordsLibrary: <RecordsLibrary onNavigate={navigate} />,
    adminRecordsUpload: <RecordsAdminUpload onNavigate={navigate} />,

    // RAW Convict
    rawManager: <RawManager onNavigate={navigate} />,
    artistPage: <ArtistPage artistId={routeParams?.artistId || '1'} onNavigate={navigate} />,

    // Community
    community: <CommunityOverview onNavigate={navigate} />,
    communityWhyRooms: <CommunityWhyRooms onNavigate={navigate} />,
    rooms: <RoomsDirectory onNavigate={navigate} />,
    events: <Events onNavigate={navigate} />,
    safePlaces: <SafePlaces onNavigate={navigate} />,
    careHub: <CareHub onNavigate={navigate} />,

    // Connect - PRODUCTION READY ✅
    connect: <Connect onNavigate={navigate} />,
    connectCreate: <ConnectCreate onNavigate={navigate} />,
    connectThreads: <ConnectThreads onNavigate={navigate} />,
    connectThread: <ConnectThread threadId={routeParams?.threadId || ''} onNavigate={navigate} />,
    connectDiscovery: <ConnectDiscovery onNavigate={navigate} />,
    connectProfile: <ConnectProfile profileId={routeParams?.profileId || ''} onNavigate={navigate} />,
    connectMatches: <ConnectMatches onNavigate={navigate} />,
    connectMessages: <ConnectMessages onNavigate={navigate} />,
    connectMessageThread: <MessageThread threadId={routeParams?.threadId || ''} onNavigate={navigate} />,

    // Legal
    legal: <LegalHub onNavigate={navigate} />,
    legalTerms: <LegalTerms onNavigate={navigate} />,
    legalPrivacy: <LegalPrivacy onNavigate={navigate} />,
    legalCookies: <LegalCookies onNavigate={navigate} />,
    legalGuidelines: <LegalGuidelines onNavigate={navigate} />,
    legalSafety: <LegalSafety onNavigate={navigate} />,
    legalAccessibility: <LegalAccessibility onNavigate={navigate} />,
    legalAdvertising: <LegalAdvertising onNavigate={navigate} />,
    legalAffiliates: <LegalAffiliates onNavigate={navigate} />,
    legalCareDisclaimer: <LegalCareDisclaimer onNavigate={navigate} />,
    legal18Plus: <Legal18PlusPage onNavigate={navigate} />,
    dataPrivacy: <DataPrivacyHub onNavigate={navigate} />,
    dataPrivacyDsar: <DataPrivacyDSAR onNavigate={navigate} />,
    dataPrivacyExport: <DataPrivacyExport onNavigate={navigate} />,
    dataPrivacyDelete: <DataPrivacyDelete onNavigate={navigate} />,
    ugcModeration: <UGCModeration onNavigate={navigate} />,
    abuseReporting: <AbuseReporting onNavigate={navigate} />,
    dmca: <DMCA onNavigate={navigate} />,
    pressRoom: <PressRoom onNavigate={navigate} />,

    // Seller
    sellerDashboard: <SellerDashboard onNavigate={navigate} />,
    sellerOnboarding: <SellerOnboarding onNavigate={navigate} />,
    sellerListingCreate: <SellerListingCreate onNavigate={navigate} />,
    sellerListingEdit: <SellerListingEdit listingId={routeParams?.listingId || ''} onNavigate={navigate} />,
    sellerOrders: <SellerOrders onNavigate={navigate} />,
    sellerSettings: <SellerSettings onNavigate={navigate} />,
    sellerAnalytics: <SellerAnalytics onNavigate={navigate} />,
    sellerListings: <SellerListings onNavigate={navigate} />,
    sellerPayouts: <SellerPayouts onNavigate={navigate} />,

    // Admin
    admin: <AdminDashboard onNavigate={navigate} />,
    adminDashboard: <AdminDashboard onNavigate={navigate} />,
    adminModeration: <AdminModeration onNavigate={navigate} />,
    adminBeacons: <AdminBeacons onNavigate={navigate} />,
    adminMarketSellers: <AdminMarketSellers onNavigate={navigate} />,
    adminOverview: <AdminOverview onNavigate={navigate} />,
    adminUsers: <AdminUsers onNavigate={navigate} />,
    adminProducts: <AdminProducts onNavigate={navigate} />,
    adminContent: <AdminContent onNavigate={navigate} />,
    adminReports: <AdminReports onNavigate={navigate} />,
    adminAudit: <AdminAudit onNavigate={navigate} />,
    adminDsar: <AdminDsar onNavigate={navigate} />,
    adminOrders: <AdminOrders onNavigate={navigate} />,
    adminGlobeView: <AdminGlobeView onNavigate={navigate} />,
    adminRecordsReleases: <AdminRecordsReleases onNavigate={navigate} />,

    // Debug
    authDebug: <AuthDebug onNavigate={navigate} />,

    // User
    account: <Account onNavigate={navigate} />,
    accountProfile: <AccountProfile onNavigate={navigate} />,
    accountOrders: <AccountOrders onNavigate={navigate} />,
    accountConsents: <AccountConsents onNavigate={navigate} />,
    accountTickets: <AccountTickets onNavigate={navigate} />,
    profile: <Profile userId={routeParams?.userId || user?.id || ''} onNavigate={navigate} />,
    settings: <Settings onNavigate={navigate} />,
    saved: <SavedContent onNavigate={navigate} />,
    notifications: <Notifications onNavigate={navigate} />,

    // Other
    map: <MapPage onNavigate={navigate} />,
    nightPulse: <NightPulse onNavigate={navigate} />,
    beaconCreate: <BeaconCreate onNavigate={navigate} />,
    navHub: <NavigationHub onNavigate={navigate} />,
    city: <CityPage cityId={routeParams?.cityId} onNavigate={navigate} />,
    cityHome: <CityHome onNavigate={navigate} />,
    search: <GlobalSearch onNavigate={navigate} />,
    editorial: <EditorialShowcase onNavigate={navigate} />,
    components: <ComponentLibrary onNavigate={navigate} />,
    drops: <DropsHub onNavigate={navigate} />,
    rewards: <Rewards onNavigate={navigate} />,
    pricing: <MembershipPage onNavigate={navigate} />,
    membership: <MembershipPage onNavigate={navigate} />,
    diagnostics: <DiagnosticsPage />,
    architectureHub: <ArchitectureHub onNavigate={navigate} />,
    beaconScan: <BeaconScanFlow code={routeParams?.code} onNavigate={navigate} />,
    beaconsManage: <BeaconManagement onNavigate={navigate} />,
    hookupScan: <HookupScan code={routeParams?.code || ''} onNavigate={navigate} />,
    hookupCreate: <HookupBeaconCreate onNavigate={navigate} />,
    hookupDashboard: <HookupDashboard onNavigate={navigate} />,
    globalOS: <GlobalOS onNavigate={navigate} />,
    cityOS: <CityOS city={routeParams?.city} onNavigate={navigate} />,
    applyHost: <CreatorOnboarding onNavigate={navigate} />,
    creatorOnboarding: <CreatorOnboarding onNavigate={navigate} />,
    xpProfile: <XPProfile onNavigate={navigate} />,
    beacons: <Beacons onNavigate={navigate} />,
    beaconAnalytics: <BeaconAnalytics beaconCode={routeParams?.code || ''} onNavigate={navigate} />,
    earth: <EarthPage onNavigate={navigate} />,
    affiliate: <Affiliate onNavigate={navigate} />,
    care: <Care onNavigate={navigate} />,
    communityPost: <Community onNavigate={navigate} />,
    communityNew: <CommunityPostCreate onNavigate={navigate} />,
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
    testCart: <TestCart />,
  };

  // If route requires auth and user not logged in, show login page
  if (currentRouteConfig?.auth && !user) {
    return <LoginPage onNavigate={navigate} />;
  }

  return routes[currentRoute] || <NotFound onNavigate={navigate} />;
}