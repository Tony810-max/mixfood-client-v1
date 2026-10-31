
import { useUiText } from '@/contexts/LanguageContext';
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DesktopNav from "./Header/DesktopNav";
import MobileNav from "./Header/MobileNav";

const Header = () => {
  const ui = useUiText();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t, lang } = useLanguage();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: t.home, href: ROUTES.HOME },
    { label: t.menu, href: ROUTES.MENU },
    { label: lang === "vn" ? ui("Tuyển dụng") : "Careers", href: ROUTES.CAREERS },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 pt-[env(safe-area-inset-top)] transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-card/80 shadow-layered"
            : "border-b border-border/50 bg-background/95"
        }`}
      >
        <div className="page-container flex h-16 items-center justify-between md:h-20">
          <Link to={ROUTES.HOME} className="group flex items-center gap-2.5" aria-label={t.ariaHome}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-gradient font-serif text-lg font-bold text-white shadow-sm transition-transform group-hover:-rotate-3">M</span>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground md:text-2xl">Mix Food</span>
          </Link>

          <DesktopNav navItems={navItems} />
          <MobileNav navItems={navItems} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        </div>
      </motion.header>
    </>
  );
};

export default Header;
