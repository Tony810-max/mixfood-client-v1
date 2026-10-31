import { ROUTES } from "@/utils/const";
import { useLanguage } from "@/contexts/LanguageContext";
import ContactInfo from "./Footer/ContactInfo";
import QuickLinks from "./Footer/QuickLinks";
import RestaurantInfo from "./Footer/RestaurantInfo";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="page-container py-10 md:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <RestaurantInfo />
          <QuickLinks />
          <ContactInfo />
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-background/15 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-background/60 text-xs md:text-sm">
              {t.footerCopyright.replace("{year}", String(currentYear))}
            </div>
            <div className="flex space-x-4 text-xs text-background/60 md:space-x-6 md:text-sm">
              <Link to={ROUTES.MENU} className="transition-colors hover:text-background">{t.menu}</Link>
              <Link to={ROUTES.BOOKING} className="transition-colors hover:text-background">{t.reserveTable}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
