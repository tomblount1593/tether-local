import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from './components/AppLayout';
import Onboarding from './pages/Onboarding';
import OnboardingEntry from './pages/OnboardingEntry';
import OnboardingStraight from './pages/OnboardingStraight';
import OnboardingBisexual from './pages/OnboardingBisexual';
import OnboardingLesbian from './pages/OnboardingLesbian';
import OnboardingTransNonbinary from './pages/OnboardingTransNonbinary';
import LandingPage from './pages/LandingPage';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Conversations from './pages/Conversations';
import Chat from './pages/Chat';
import VideoCall from './pages/VideoCall';
import Profile from './pages/Profile';
import DateBooking from './pages/DateBooking';
import PostDateFeedback from './pages/PostDateFeedback';
import QuickReflection from './pages/QuickReflection';
import WaitingResponse from './pages/WaitingResponse';
import NextDateBooking from './pages/NextDateBooking';
import ViewDateFeedback from './pages/ViewDateFeedback';
import MatchDetail from './pages/MatchDetail';
import Membership from './pages/Membership';
import ExpertChat from './pages/ExpertChat';
import PrivateChat from './pages/PrivateChat';
import MapDiscovery from './pages/MapDiscovery';
import DateJourney from './pages/DateJourney';
import Insights from './pages/Insights';
import InterestedInYou from './pages/InterestedInYou';
import OrientationWrapper from './components/OrientationWrapper';
import DevRouteSwitcher from '@/components/dev/DevRouteSwitcher';
import SignIn from './pages/SignIn';
import { DEMO_VARIANT_ROUTE_CONFIGS } from '@/data/demo/demoVariantRoutes';

const DEMO_ROUTE_VARIANTS = DEMO_VARIANT_ROUTE_CONFIGS.map(({ slug, orientation }) => ({
  suffix: slug,
  orientation,
}));

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Routes>
        {/* ── Onboarding (never touch these) ─────────────────────────────── */}
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/landing-standard"        element={<LandingPage forcedTier="standard" />} />
        <Route path="/landing-premium"         element={<Navigate to="/landing-standard" replace />} />
        <Route path="/landing-concierge"       element={<Navigate to="/landing-standard" replace />} />
        <Route path="/onboarding"               element={<Onboarding />} />
        <Route path="/onboarding-gay"           element={<Onboarding />} />
        <Route path="/onboarding-section01"      element={<Onboarding />} />
        <Route path="/onboarding-section02"      element={<Onboarding />} />
        <Route path="/onboarding-section03"      element={<Onboarding />} />
        <Route path="/onboarding-section04"      element={<Onboarding />} />
        <Route path="/onboarding-section05"      element={<Onboarding />} />
        <Route path="/onboarding-howitworks"     element={<Onboarding />} />
        <Route path="/onboarding-gay-section01"  element={<Onboarding />} />
        <Route path="/onboarding-gay-section02"  element={<Onboarding />} />
        <Route path="/onboarding-gay-section03"  element={<Onboarding />} />
        <Route path="/onboarding-gay-section04"  element={<Onboarding />} />
        <Route path="/onboarding-gay-section05"  element={<Onboarding />} />
        <Route path="/onboarding-gay-howitworks" element={<Onboarding />} />
        <Route path="/onboarding-straight"      element={<OnboardingStraight />} />
        <Route path="/onboarding-straight-section01" element={<OnboardingStraight />} />
        <Route path="/onboarding-straight-section02" element={<OnboardingStraight />} />
        <Route path="/onboarding-straight-section03" element={<OnboardingStraight />} />
        <Route path="/onboarding-straight-section04" element={<OnboardingStraight />} />
        <Route path="/onboarding-straight-section05" element={<OnboardingStraight />} />
        <Route path="/onboarding-straight-howitworks" element={<OnboardingStraight />} />
        <Route path="/onboarding-bisexual"      element={<OnboardingBisexual />} />
        <Route path="/onboarding-bisexual-section01" element={<OnboardingBisexual />} />
        <Route path="/onboarding-bisexual-section02" element={<OnboardingBisexual />} />
        <Route path="/onboarding-bisexual-section03" element={<OnboardingBisexual />} />
        <Route path="/onboarding-bisexual-section04" element={<OnboardingBisexual />} />
        <Route path="/onboarding-bisexual-section05" element={<OnboardingBisexual />} />
        <Route path="/onboarding-bisexual-howitworks" element={<OnboardingBisexual />} />
        <Route path="/onboarding-lesbian"       element={<OnboardingLesbian />} />
        <Route path="/onboarding-lesbian-section01" element={<OnboardingLesbian />} />
        <Route path="/onboarding-lesbian-section02" element={<OnboardingLesbian />} />
        <Route path="/onboarding-lesbian-section03" element={<OnboardingLesbian />} />
        <Route path="/onboarding-lesbian-section04" element={<OnboardingLesbian />} />
        <Route path="/onboarding-lesbian-section05" element={<OnboardingLesbian />} />
        <Route path="/onboarding-lesbian-howitworks" element={<OnboardingLesbian />} />
        <Route path="/onboarding-trans-nonbinary" element={<OnboardingTransNonbinary />} />
        <Route path="/onboarding-trans-nonbinary-section01" element={<OnboardingTransNonbinary />} />
        <Route path="/onboarding-trans-nonbinary-section02" element={<OnboardingTransNonbinary />} />
        <Route path="/onboarding-trans-nonbinary-section03" element={<OnboardingTransNonbinary />} />
        <Route path="/onboarding-trans-nonbinary-section04" element={<OnboardingTransNonbinary />} />
        <Route path="/onboarding-trans-nonbinary-section05" element={<OnboardingTransNonbinary />} />
        <Route path="/onboarding-trans-nonbinary-howitworks" element={<OnboardingTransNonbinary />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-in-standard" element={<OrientationWrapper orientation="gay"><SignIn /></OrientationWrapper>} />
        <Route path="/sign-in-premium" element={<OrientationWrapper orientation="gay"><SignIn /></OrientationWrapper>} />
        <Route path="/sign-in-concierge" element={<OrientationWrapper orientation="gay"><SignIn /></OrientationWrapper>} />

        {/* ── Secondary pages (back-arrow only, no bottom nav) ───────────── */}
        <Route path="/chat/:matchId"             element={<Chat />} />
        <Route path="/video-call/:matchId"       element={<VideoCall />} />
        <Route path="/book-date/:matchId"        element={<DateBooking />} />
        <Route path="/post-date-feedback/:bookingId" element={<PostDateFeedback />} />
        <Route path="/quick-reflection/:matchId" element={<QuickReflection />} />
        <Route path="/waiting-response/:matchId" element={<WaitingResponse />} />
        <Route path="/book-next-date/:matchId" element={<NextDateBooking />} />
        <Route path="/view-feedback/:matchId" element={<ViewDateFeedback />} />
        <Route path="/match/:matchId"            element={<MatchDetail />} />
        <Route path="/membership"                element={<Membership />} />
        <Route path="/private-chat"              element={<PrivateChat />} />
        <Route path="/date-journey"              element={<DateJourney />} />
        <Route path="/interested-in-you"         element={<InterestedInYou />} />

        {/* Secondary orientation pages */}
        {DEMO_ROUTE_VARIANTS.flatMap(({ suffix, orientation }) => [
          <Route key={`chat-${suffix}`}           path={`/chat-${suffix}/:matchId`}             element={<OrientationWrapper orientation={orientation} variant={suffix}><Chat /></OrientationWrapper>} />,
          <Route key={`video-call-${suffix}`}     path={`/video-call-${suffix}/:matchId`}       element={<OrientationWrapper orientation={orientation} variant={suffix}><VideoCall /></OrientationWrapper>} />,
          <Route key={`match-${suffix}`}          path={`/match-${suffix}/:matchId`}            element={<OrientationWrapper orientation={orientation} variant={suffix}><MatchDetail /></OrientationWrapper>} />,
          <Route key={`book-date-${suffix}`}      path={`/book-date-${suffix}/:matchId`}        element={<OrientationWrapper orientation={orientation} variant={suffix}><DateBooking /></OrientationWrapper>} />,
          <Route key={`post-date-${suffix}`}      path={`/post-date-feedback-${suffix}/:bookingId`} element={<OrientationWrapper orientation={orientation} variant={suffix}><PostDateFeedback /></OrientationWrapper>} />,
          <Route key={`quick-reflection-${suffix}`} path={`/quick-reflection-${suffix}/:matchId`} element={<OrientationWrapper orientation={orientation} variant={suffix}><QuickReflection /></OrientationWrapper>} />,
          <Route key={`waiting-response-${suffix}`} path={`/waiting-response-${suffix}/:matchId`} element={<OrientationWrapper orientation={orientation} variant={suffix}><WaitingResponse /></OrientationWrapper>} />,
          <Route key={`book-next-date-${suffix}`} path={`/book-next-date-${suffix}/:matchId`} element={<OrientationWrapper orientation={orientation} variant={suffix}><NextDateBooking /></OrientationWrapper>} />,
          <Route key={`view-feedback-${suffix}`} path={`/view-feedback-${suffix}/:matchId`} element={<OrientationWrapper orientation={orientation} variant={suffix}><ViewDateFeedback /></OrientationWrapper>} />,
          <Route key={`private-chat-${suffix}`}   path={`/private-chat-${suffix}`}              element={<OrientationWrapper orientation={orientation} variant={suffix}><PrivateChat /></OrientationWrapper>} />,
          <Route key={`membership-${suffix}`}     path={`/membership-${suffix}`}                element={<OrientationWrapper orientation={orientation} variant={suffix}><Membership /></OrientationWrapper>} />,
          <Route key={`date-journey-${suffix}`}   path={`/date-journey-${suffix}`}          element={<OrientationWrapper orientation={orientation} variant={suffix}><DateJourney /></OrientationWrapper>} />,
          <Route key={`interested-${suffix}`}     path={`/interested-in-you-${suffix}`}     element={<OrientationWrapper orientation={orientation} variant={suffix}><InterestedInYou /></OrientationWrapper>} />,
        ])}

        {/* ── Primary pages WITH AppLayout (bottom nav) ───────────────────── */}
        <Route element={<AppLayout />}>
          {/* Base routes (no orientation) */}
          <Route path="/app"          element={<Discover />} />
          <Route path="/discover"     element={<Discover />} />
          <Route path="/matches"      element={<Matches />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/map"          element={<MapDiscovery />} />
          <Route path="/expert"       element={<ExpertChat />} />
          <Route path="/insights"     element={<Insights />} />
          <Route path="/profile"      element={<Profile />} />

          {/* Sexual-preference primary routes */}
          {DEMO_ROUTE_VARIANTS.flatMap(({ suffix, orientation }) => [
            <Route key={`app-${suffix}`}           path={`/app-${suffix}`}              element={<OrientationWrapper orientation={orientation} variant={suffix}><Discover /></OrientationWrapper>} />,
            <Route key={`discover-${suffix}`}      path={`/discover-${suffix}`}         element={<OrientationWrapper orientation={orientation} variant={suffix}><Discover /></OrientationWrapper>} />,
            <Route key={`matches-${suffix}`}       path={`/matches-${suffix}`}          element={<OrientationWrapper orientation={orientation} variant={suffix}><Matches /></OrientationWrapper>} />,
            <Route key={`conversations-${suffix}`} path={`/conversations-${suffix}`}    element={<OrientationWrapper orientation={orientation} variant={suffix}><Conversations /></OrientationWrapper>} />,
            <Route key={`map-${suffix}`}           path={`/map-${suffix}`}              element={<OrientationWrapper orientation={orientation} variant={suffix}><MapDiscovery /></OrientationWrapper>} />,
            <Route key={`expert-${suffix}`}        path={`/expert-${suffix}`}           element={<OrientationWrapper orientation={orientation} variant={suffix}><ExpertChat /></OrientationWrapper>} />,
            <Route key={`insights-${suffix}`}      path={`/insights-${suffix}`}         element={<OrientationWrapper orientation={orientation} variant={suffix}><Insights /></OrientationWrapper>} />,
            <Route key={`profile-${suffix}`}       path={`/profile-${suffix}`}          element={<OrientationWrapper orientation={orientation} variant={suffix}><Profile /></OrientationWrapper>} />,
          ])}
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <DevRouteSwitcher />
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
