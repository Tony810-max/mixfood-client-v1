import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ROUTES } from "@/utils/const";
import tomYum from "@/assets/hero-dish.jpg";
import padThai from "@/assets/pad-thai.jpg";
import somTam from "@/assets/som-tum.jpg";
import mangoRice from "@/assets/mango-sticky-rice.jpg";

const ThaiDishHighlight = () => {
  const { lang, t } = useLanguage();
  const [active, setActive] = useState(0);
  const dishes = [
    { name: t.specialtyTomYumName, subtitle: t.specialtyTomYumVietnamese, description: t.specialtyTomYumDesc, image: tomYum, href: ROUTES.MENU_ITEMS.TOM_YUM },
    { name: t.specialtyPadThaiName, subtitle: t.specialtyPadThaiVietnamese, description: t.specialtyPadThaiDesc, image: padThai, href: ROUTES.MENU_ITEMS.PAD_THAI },
    { name: t.specialtySomTamName, subtitle: t.specialtySomTamVietnamese, description: t.specialtySomTamDesc, image: somTam, href: ROUTES.MENU_ITEMS.SOM_TAM },
    { name: t.specialtyMangoStickyRiceName, subtitle: t.specialtyMangoStickyRiceVietnamese, description: t.specialtyMangoStickyRiceDesc, image: mangoRice, href: ROUTES.MENU_ITEMS.DESSERTS },
  ];
  const dish = dishes[active];

  return (
    <section id="specialties" className="scroll-mt-24 bg-card py-16 md:py-24">
      <div className="page-container">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5 md:mb-12">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{lang === "vn" ? "Từ căn bếp Mix Food" : "From the Mix Food kitchen"}</p>
            <h2 className="font-serif text-3xl font-semibold md:text-5xl">{t.thaiSpecialties}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">{t.thaiSpecialtiesDesc}</p>
          </div>
          <Link to={ROUTES.MENU} className="inline-flex min-h-11 items-center gap-3 border-b border-primary text-sm font-semibold text-primary">{t.viewMenu}<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid items-stretch gap-7 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="relative overflow-hidden rounded-3xl bg-secondary">
            <img key={dish.image} src={dish.image} alt={dish.name} loading="lazy" className="aspect-[4/3] h-full max-h-[580px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div aria-live="polite" className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">0{active + 1} / 04 · MIX FOOD</p>
              <h3 className="font-serif text-2xl font-semibold sm:text-3xl">{dish.name}</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">{dish.description}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="divide-y divide-border/70 border-y border-border/70" role="group" aria-label={t.thaiSpecialties}>
              {dishes.map((entry, index) => (
                <button key={entry.href} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={"group flex min-h-24 w-full items-center gap-4 px-3 py-5 text-left transition-colors sm:px-5 " + (active === index ? "bg-accent/70" : "hover:bg-secondary/40")}>
                  <span className={"text-xs tabular-nums " + (active === index ? "text-primary" : "text-muted-foreground")}>0{index + 1}</span>
                  <span className="flex-1"><span className={"block font-serif text-lg font-semibold sm:text-xl " + (active === index ? "text-primary" : "")}>{entry.name}</span><span className="mt-1 block text-xs text-muted-foreground">{entry.subtitle}</span></span>
                  <ArrowUpRight className={"h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 " + (active === index ? "text-primary" : "text-muted-foreground")} />
                </button>
              ))}
            </div>
            <Link to={`${ROUTES.MENU}?q=${encodeURIComponent(dish.name)}`} className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              {lang === "vn" ? "Khám phá món này" : "Explore this dish"}<ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThaiDishHighlight;
