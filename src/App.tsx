import { ProtectedRoute } from "@/components/auth";
import { BlockedUserToast } from "@/components/common/BlockedUserToast";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import RouteProgress from "@/components/common/RouteProgress";
import RouteMeta from "@/components/seo/RouteMeta";
import SupportChatbot from "@/components/common/SupportChatbot";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TableSessionProvider } from "@/contexts/TableSessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ROUTES } from "./utils/const.ts";

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, string>) => void;
  }
}

const Index = lazy(() => import("./pages/Index.tsx"));
const MenuPage = lazy(() => import("./pages/Menu/index.tsx"));
const Booking = lazy(() => import("./pages/Booking/index.tsx"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess/index.tsx"));
const LoginPage = lazy(() => import("./pages/Auth/Login/index.tsx"));
const RegisterPage = lazy(() => import("./pages/Auth/Register/index.tsx"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPassword/index.tsx"));
const ProfilePage = lazy(() => import("./pages/Profile/index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const TableOrderPage = lazy(() => import("./pages/TableOrder/index.tsx"));
const TableOrderLayout = lazy(() => import("./pages/TableOrder/Layout.tsx"));
const TableMenuPage = lazy(() => import("./pages/TableOrder/MenuPage.tsx"));
const TableOrdersPage = lazy(() => import("./pages/TableOrder/OrdersPage.tsx"));
const TableChatPage = lazy(() => import("./pages/TableOrder/ChatPage.tsx"));
const TableBillPage = lazy(() => import("./pages/TableOrder/BillPage.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
    <div className="flex items-center gap-3 rounded-full border bg-card px-5 py-3 text-sm text-muted-foreground shadow-layered">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      Đang tải nội dung…
    </div>
  </div>
);

/** Keep page navigation predictable, including when moving between long menu sections. */
const ScrollToTop = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [hash, pathname]);

  return null;
};

/** Sends a page view whenever this single-page application changes route. */
const GoogleAnalyticsPageViews = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: `${pathname}${search}`,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TableSessionProvider>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Sonner richColors position="top-center" />
              <BlockedUserToast />
              <BrowserRouter>
                <ScrollToTop />
                <GoogleAnalyticsPageViews />
                <RouteProgress />
                <RouteMeta />
                <SupportChatbot />
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    {/* QR Table Ordering — no auth required */}
                    <Route path="/q/:token" element={<TableOrderPage />}>
                      <Route index element={<Navigate to="menu" replace />} />
                      <Route element={<TableOrderLayout />}>
                        <Route path="menu" element={<TableMenuPage />} />
                        <Route path="orders" element={<TableOrdersPage />} />
                        <Route path="chat" element={<TableChatPage />} />
                        <Route path="bill" element={<TableBillPage />} />
                      </Route>
                    </Route>
                    <Route path={ROUTES.HOME} element={<Index />} />
                    <Route path={ROUTES.MENU} element={<MenuPage />} />
                    <Route path={ROUTES.BOOKING} element={<Booking />} />
                    <Route path={ROUTES.BOOKING_SUCCESS} element={<BookingSuccess />} />
                    <Route
                      path={ROUTES.PROFILE}
                      element={<ProtectedRoute requireAuth><ProfilePage /></ProtectedRoute>}
                    />
                    <Route path={ROUTES.RESERVATIONS} element={<Navigate to={`${ROUTES.PROFILE}?section=reservations`} replace />} />
                    <Route
                      path={ROUTES.AUTH.LOGIN}
                      element={<ProtectedRoute requireAuth={false}><LoginPage /></ProtectedRoute>}
                    />
                    <Route
                      path={ROUTES.AUTH.REGISTER}
                      element={<ProtectedRoute requireAuth={false}><RegisterPage /></ProtectedRoute>}
                    />
                    <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </TableSessionProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
