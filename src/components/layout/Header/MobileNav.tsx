import LanguageToggle from "@/components/navigation/LanguageToggle";
import ReserveButton from "@/components/navigation/ReserveButton";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogout } from "@/hooks/api/useAuth";
import { INFORMATION_RESTAURANT, ROUTES } from "@/utils/const";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Calendar, Home, LogOut, Menu, Phone, User, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

interface MobileNavProps {
  navItems: Array<{ label: string; href: string }>;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const MobileNav = ({ navItems, mobileOpen, setMobileOpen }: MobileNavProps) => {
  const { t } = useLanguage();
  const { user, isAuthenticated, setUser } = useAuth();
  const logoutMutation = useLogout();

  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuItems = navItems.map((item, index) => ({ ...item, icon: [Home, Menu, User][index] ?? Menu }));
  useEffect(() => {
    if (!mobileOpen) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab") return;
      const elements = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        ref={triggerRef}
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
        className="md:hidden text-foreground p-2 -mr-2 rounded-lg hover:bg-secondary/80 transition-colors active:scale-95"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? t.ariaMenuClose : t.ariaMenuOpen}
      >
        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {createPortal(<AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Full Screen Menu */}
            <motion.div
              initial={{ x: reducedMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: reducedMotion ? 0 : "100%" }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              ref={panelRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label={t.ariaMenuOpen}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-gradient-to-b from-background via-background to-secondary/20 z-[60] md:hidden flex flex-col"
            >
              {/* Safe Area Top */}
              <div className="pt-safe-top" />

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/80 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Mix Food</h2>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors active:scale-95"
                  aria-label={t.ariaMenuClose}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex justify-center py-4 border-b border-border/50 bg-background/50">
                <LanguageToggle variant="mobile" />
              </div>

              {/* Scrollable Content */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
                {/* Main Navigation */}
                <div className="p-4 space-y-3">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reducedMotion ? 0 : index * 0.04 }}
                      >
                        <Link to={item.href} onClick={() => setMobileOpen(false)} className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.98]">
                          <div className="rounded-xl bg-primary/10 p-3 transition-all group-hover:bg-primary/20">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-base font-medium text-foreground transition-colors group-hover:text-primary">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Reserve Button */}
                <div className="px-4 py-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ReserveButton
                      className="w-full min-h-[56px] text-base font-semibold shadow-lg shadow-primary/20"
                      content={t.reserveTable}
                      onClick={() => setMobileOpen(false)}
                    />
                  </motion.div>
                </div>

                {/* Auth Section */}
                <div className="px-4 pb-4 pt-2">
                  <div className="border-t border-border/40 mb-5" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isAuthenticated ? (
                      <div className="flex flex-col gap-4">
                        {/* User Profile Card */}
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/50 rounded-2xl border border-primary/20">
                          <div className="p-3 rounded-xl bg-primary-gradient">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-foreground">{user?.name || t.headerUser}</p>
                            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                          </div>
                        </div>

                        <Link to={ROUTES.PROFILE} onClick={() => setMobileOpen(false)}>
                          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all active:scale-[0.98]">
                            <User className="w-5 h-5 text-foreground/70" />
                            <span className="text-base font-medium text-foreground/80">{t.profileTitle}</span>
                          </button>
                        </Link>

                        <Link to={ROUTES.RESERVATIONS} onClick={() => setMobileOpen(false)}>
                          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all active:scale-[0.98]">
                            <Calendar className="w-5 h-5 text-foreground/70" />
                            <span className="text-base font-medium text-foreground/80">{t.reservationsTitle}</span>
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            setUser(null);
                            logoutMutation.mutate();
                            setMobileOpen(false);
                          }}
                          className="w-full flex items-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 transition-all hover:bg-destructive/15 active:scale-[0.98]"
                        >
                          <LogOut className="w-5 h-5 text-destructive" />
                          <span className="text-base font-medium text-destructive">{t.headerLogout}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <Link to={ROUTES.AUTH.LOGIN} onClick={() => setMobileOpen(false)}>
                          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-orange-200 dark:border-orange-800/60 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 transition-all active:scale-[0.98]">
                            <User className="w-5 h-5 text-orange-500" />
                            <span className="text-base font-medium text-foreground/80">{t.headerSignIn}</span>
                          </button>
                        </Link>

                        <Link to={ROUTES.AUTH.REGISTER} onClick={() => setMobileOpen(false)}>
                          <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:opacity-90 transition-all active:scale-[0.98]">
                            <User className="w-5 h-5" />
                            <span className="text-base font-medium">{t.headerSignUp}</span>
                          </button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Footer Contact */}
              <div className="shrink-0 p-3 pb-safe-bottom border-t border-border/50 bg-background/95 backdrop-blur-lg">
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  href={`tel:${INFORMATION_RESTAURANT.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:from-primary/20 hover:to-primary/10 transition-all active:scale-[0.98]"
                >
                  <div className="p-2 rounded-full bg-primary-gradient">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">{t.hotline}</p>
                    <p className="font-semibold text-primary">{INFORMATION_RESTAURANT.phone}</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}
    </>
  );
};

export default MobileNav;
