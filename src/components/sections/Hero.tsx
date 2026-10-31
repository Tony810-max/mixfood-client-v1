
import { useUiText } from '@/contexts/LanguageContext';
import heroDish from "@/assets/hero-dish.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { INFORMATION_RESTAURANT, ROUTES } from "@/utils/const";
import { ArrowDown, ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const ui = useUiText();
  const { lang, t } = useLanguage();
  const vn = lang === "vn";

  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(circle_at_90%_15%,hsl(var(--primary)/.10),transparent_28%),radial-gradient(circle_at_12%_85%,hsl(var(--secondary)/.7),transparent_34%)] pt-16 md:pt-24">
      <div className="page-container flex items-center py-5 md:py-8">
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl py-2 lg:py-5">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              <span className="h-px w-8 bg-primary" />{vn ? "Một chút Thái, ngay Đà Nẵng" : "A little Thailand, right in Da Nang"}
            </p>
            <h1 className="font-serif text-[clamp(2.8rem,5.2vw,5.2rem)] font-semibold leading-[1.12] tracking-tight">
              {vn ? "Trọn vị Thái." : "Thai flavours."}<br />
              <span className="text-primary">{vn ? "Ấm lòng người." : "Warm moments."}</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">{t.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={ROUTES.MENU} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                {t.viewMenu}<ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link to={ROUTES.BOOKING} className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card/50 px-6 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">{t.reserveTable}</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-border/70 pt-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{vn ? "Đà Nẵng, Việt Nam" : "Da Nang, Vietnam"}</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />{INFORMATION_RESTAURANT.openHours}</span>
            </div>
          </div>
          <figure className="relative isolate mx-auto aspect-[4/3] w-full min-w-0 max-w-xl overflow-hidden rounded-3xl bg-secondary shadow-layered ring-1 ring-foreground/5 sm:rounded-[2rem]">
            <img src={heroDish} alt={t.heroTomYum} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <p className="mb-2 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-white/80 sm:text-xs">{vn ? "Khám phá hương vị" : "Discover the flavour"}</p>
              <p className="font-serif text-xl font-semibold leading-snug sm:text-2xl"><span className="inline-block">Tom Yum</span>{" · "}<span className="inline-block">{ui("Pad Thai") }</span>{" · "}<span className="inline-block">{ui("Som Tam") }</span></p>
            </figcaption>
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm"><Sparkles className="size-3" /> {ui("Thai kitchen") }</span>
          </figure>
        </div>
      </div>
      <div className="border-y border-border/70 bg-secondary/35">
        <div className="page-container flex flex-wrap items-center justify-between gap-4 py-4 text-xs sm:py-5 sm:text-sm">
          <p className="font-serif text-muted-foreground">{vn ? "Chua. Cay. Mặn. Ngọt. Đủ đầy trong một bữa ăn." : "Sour. Spicy. Salty. Sweet. A little of everything."}</p>
          <a href="#specialties" className="inline-flex min-h-8 items-center gap-2 font-medium hover:text-primary">{vn ? "Tìm món bạn yêu" : "Find your favourite"}<ArrowDown className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
