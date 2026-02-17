import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppShell } from "./components/AppShell";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { SplashScreen } from "./components/SplashScreen";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Sliders from "./pages/Sliders";
import DailyCycle from "./pages/DailyCycle";
import Insights from "./pages/Insights";
import InnerCircle from "./pages/InnerCircle";
import Settings from "./pages/Settings";
import Challenges from "./pages/Challenges";
import Modules from "./pages/Modules";
import SowingReaping from "./pages/SowingReaping";
import Profiles from "./pages/Profiles";
import NewHome from "./pages/NewHome";
import More from "./pages/More";
import WeeklyReview from "./pages/WeeklyReview";
import PrayerJournal from "./pages/PrayerJournal";
import BiasClearing from "./pages/BiasClearing";
import ModuleDetail from "./pages/ModuleDetail";
import Achievements from "./pages/Achievements";
import { Audiobook } from "./pages/Audiobook";
import { Book } from "./pages/Book";
import { VoiceCloning } from "./pages/VoiceCloning";
import { AudiobookGeneration } from "./pages/AudiobookGeneration";
import { BatchAudiobookGeneration } from "./pages/BatchAudiobookGeneration";
import { RecordVoice } from "./pages/RecordVoice";
import { GenerateAudiobook } from "./pages/GenerateAudiobook";
import { ProgressDashboard } from "./pages/ProgressDashboard";
import { Flashcards } from "./pages/Flashcards";
import { OfflineIndicator } from "./components/OfflineIndicator";
import Philosophy from "./pages/Philosophy";
import MonthlyReportPage from "./pages/MonthlyReportPage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CookieConsent } from "./components/CookieConsent";
import { ScrollToTop } from "./components/ScrollToTop";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminAudiobookTools from "./pages/admin/AdminAudiobookTools";
import AdminActivityLog from "./pages/admin/AdminActivityLog";
import { trpc } from "./lib/trpc";

/**
 * Public routes — accessible without authentication.
 * Landing page at /, plus terms, privacy, philosophy, and auth redirect.
 */
function PublicRouter() {
  const [location] = useLocation();

  return (
    <>
    <ScrollToTop />
    <AnimatedRoutes>
      <Switch key={location}>
        <Route path="/" component={LandingPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/philosophy" component={Philosophy} />
        <Route path="/about" component={Philosophy} />
        <Route path="/404" component={NotFound} />
      </Switch>
    </AnimatedRoutes>
    </>
  );
}

/**
 * Authenticated app routes — all app features behind /app/*.
 * Uses wouter's nested Router with base="/app" so all child routes
 * are relative (e.g., "/" = /app, "/book" = /app/book).
 */
function AppRouter() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Show auth page if not authenticated
  if (!isLoading && !isAuthenticated) {
    if (location === "/auth" || location.startsWith("/auth?")) {
      return <AuthPage />;
    }
    return <AuthPage />;
  }

  if (isLoading) {
    return null; // SplashScreen covers this
  }

  return (
    <AppShell>
      <ScrollToTop />
      <AnimatedRoutes>
        <Switch key={location}>
          <Route path="/" component={NewHome} />
          <Route path="/old-home" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/sliders" component={Sliders} />
          <Route path="/daily-cycle" component={DailyCycle} />
          <Route path="/insights" component={Insights} />
          <Route path="/inner-circle" component={InnerCircle} />
          <Route path="/settings" component={Settings} />
          <Route path="/challenges" component={Challenges} />
          <Route path="/modules" component={Modules} />
          <Route path="/modules/:id" component={ModuleDetail} />
          <Route path="/sowing-reaping" component={SowingReaping} />
          <Route path="/profiles" component={Profiles} />
          <Route path="/more" component={More} />
          <Route path="/weekly-review" component={WeeklyReview} />
          <Route path="/prayer-journal" component={PrayerJournal} />
          <Route path="/bias-clearing" component={BiasClearing} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/audiobook" component={Audiobook} />
          <Route path="/book" component={Book} />
          <Route path="/progress" component={ProgressDashboard} />
          <Route path="/flashcards" component={Flashcards} />
          <Route path="/voice-cloning" component={VoiceCloning} />
          <Route path="/audiobook-generation" component={AudiobookGeneration} />
          <Route path="/batch-audiobook-generation" component={BatchAudiobookGeneration} />
          <Route path="/record-voice" component={RecordVoice} />
          <Route path="/generate-audiobook" component={GenerateAudiobook} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/philosophy" component={Philosophy} />
          <Route path="/about" component={Philosophy} />
          <Route path="/monthly-report" component={MonthlyReportPage} />
          <Route path="/auth" component={NewHome} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </AnimatedRoutes>
    </AppShell>
  );
}

/**
 * Admin panel routes — completely independent from the app.
 * Uses wouter's nested Router with base="/admin".
 * Has its own login system that checks admin role.
 */
function AdminRouter() {
  const [location] = useLocation();
  const { data: adminUser, isLoading, error } = trpc.admin.me.useQuery(undefined, {
    retry: false,
  });

  // Show login page if not authenticated as admin
  if (!isLoading && (!adminUser || error)) {
    if (location === "/login") {
      return <AdminLogin />;
    }
    return <AdminLogin />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Switch key={location}>
      <Route path="/" component={AdminDashboard} />
      <Route path="/login" component={AdminDashboard} />
      <Route path="/users" component={AdminUsers} />
      <Route path="/subscriptions" component={AdminSubscriptions} />
      <Route path="/feedback" component={AdminFeedback} />
      <Route path="/audiobook-tools" component={AdminAudiobookTools} />
      <Route path="/activity-log" component={AdminActivityLog} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Root router — decides between public pages, the app, and admin.
 * - `/` and other public paths → PublicRouter
 * - `/app/*` → AppRouter (nested with base="/app")
 * - `/admin/*` → AdminRouter (nested with base="/admin")
 */
function RootRouter() {
  const [location] = useLocation();

  // Check if we're on an /admin path
  const isAdminPath = location === "/admin" || location.startsWith("/admin/") || location.startsWith("/admin?");

  if (isAdminPath) {
    return (
      <Router base="/admin">
        <AdminRouter />
      </Router>
    );
  }

  // Check if we're on an /app path
  const isAppPath = location === "/app" || location.startsWith("/app/") || location.startsWith("/app?");

  if (isAppPath) {
    return (
      <Router base="/app">
        <AppRouter />
      </Router>
    );
  }

  return <PublicRouter />;
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark" switchable>
          <TooltipProvider>
          <Toaster />
          <SplashScreen />
          <RootRouter />
          <OfflineIndicator />
          <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
