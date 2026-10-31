
import { useUiText } from '@/contexts/LanguageContext';
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const ui = useUiText();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50/40 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 18 }}
          className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/25"
        >
          <UtensilsCrossed className="w-12 h-12 text-white" />
        </motion.div>

        {/* 404 */}
        <h1 className="text-8xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent leading-none mb-4">
          {ui("404") } </h1>

        <h2 className="text-2xl font-bold text-foreground mb-3">{t.notFoundMessage}</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {ui("The page you're looking for doesn't exist or has been moved.") } </p>

        <Button
          asChild
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/25 h-11 px-8"
        >
          <a href={ROUTES.HOME}>
            <Home className="w-4 h-4 mr-2" />
            {t.notFoundReturn}
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
