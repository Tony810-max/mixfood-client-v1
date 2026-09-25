import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import { FooterLink } from './FooterLink';

const QuickLinks = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t.home, href: ROUTES.HOME },
    { label: t.menu, href: ROUTES.MENU },
    { label: t.reserveTable, href: ROUTES.RESERVE },
    { label: t.footerAboutUs, href: ROUTES.ABOUT },
    { label: t.footerContactUs, href: ROUTES.CONTACT },
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      <h4 className="text-base md:text-lg font-semibold">{t.footerQuickLinks}</h4>
      <ul className="space-y-1.5 md:space-y-2">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <FooterLink to={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
