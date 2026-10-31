
import { useUiText } from '@/contexts/LanguageContext';
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, RotateCcw, SearchX, Utensils } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/api/useMenu";
import { ROUTES } from "@/utils/const";
import heroDish from "@/assets/hero-dish.jpg";
import CategorySection from "../CategorySection";
import SearchContent from "./SearchContent";

const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/\s+/g, "");

const MenuContent = () => {
  const ui = useUiText();
  const { lang, t } = useLanguage();
  const { data: categories, isLoading, error, refetch } = useMenu();
  const [searchParams] = useSearchParams();
  const requestedQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(requestedQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const vn = lang === "vn";

  useEffect(() => setSearchQuery(requestedQuery), [requestedQuery]);

  const query = normalizeSearch(searchQuery);
  const filteredCategories = (categories ?? [])
    .filter((category) => !selectedCategory || category.id === selectedCategory)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => !query || normalizeSearch(item.name.en).includes(query) || normalizeSearch(item.name.vn).includes(query)),
    }))
    .filter((category) => category.items.length > 0);
  const count = filteredCategories.reduce((total, category) => total + category.items.length, 0);
  const clearFilters = () => { setSearchQuery(""); setSelectedCategory(null); };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 md:pt-20">
        <section className="overflow-hidden border-b border-border/70 bg-secondary/30">
          <div className="page-container grid items-center gap-7 py-10 sm:py-14 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><Utensils className="h-4 w-4" /> {ui("MIX FOOD · THAI KITCHEN") }</p>
              <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">{t.menuTitle}<span className="text-primary">.</span></h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">{t.menuSubtitle}</p>
              <p className="mt-5 text-xs text-muted-foreground">{vn ? "Chạm vào món ăn để xem ảnh và mô tả chi tiết." : "Tap a dish to see the photo and full description."}</p>
            </div>
            <img src={heroDish} alt={t.heroTomYum} className="hidden h-48 w-48 rotate-3 rounded-[3.5rem_1rem_3.5rem_1rem] object-cover shadow-layered md:block lg:h-56 lg:w-56" />
          </div>
        </section>

        <div className="sticky top-16 md:top-20 z-30 border-b border-border/70 bg-background/95 backdrop-blur-md">
          <div className="page-container py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className="text-xs text-muted-foreground">{isLoading ? t.menuLoading : error ? t.menuLoadError : <><span className="font-semibold text-foreground">{count}</span> {vn ? "món ăn dành cho bạn" : "dishes to discover"}</>}</p>
              <div className="w-full sm:max-w-sm"><SearchContent value={searchQuery} onSearchChange={setSearchQuery} /></div>
            </div>
            <label className="mt-3 block text-xs font-medium">
              {vn ? "Danh mục món ăn" : "Dish category"}
              <select value={selectedCategory ?? ""} onChange={(event) => setSelectedCategory(event.target.value || null)} className="mt-2 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm sm:max-w-sm">
                <option value="">{vn ? "Tất cả món" : "All dishes"}</option>
                {categories?.map((category) => <option key={category.id} value={category.id}>{category[lang] || category.en || category.vn}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="page-container space-y-12 py-8 md:space-y-16 md:py-12">
          {isLoading ? (
            <div role="status" aria-label={t.menuLoading} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => <div key={index} aria-hidden="true" className="overflow-hidden rounded-2xl border border-border/70 bg-card"><div className="aspect-[4/3] animate-pulse bg-secondary" /><div className="p-5"><div className="h-4 w-3/4 animate-pulse rounded bg-secondary" /></div></div>)}
              <span className="sr-only">{t.menuLoading}</span>
            </div>
          ) : error ? (
            <div role="alert" className="rounded-3xl border border-border bg-card px-5 py-16 text-center">
              <p className="text-muted-foreground">{t.menuLoadError}</p>
              <button type="button" onClick={() => void refetch()} className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"><RotateCcw className="h-4 w-4" />{t.menuRetry}</button>
            </div>
          ) : filteredCategories.length ? (
            filteredCategories.map((category) => <CategorySection key={category.id + ":" + query} category={category} lang={lang} />)
          ) : (
            <div className="rounded-3xl border border-dashed border-border px-5 py-16 text-center">
              <SearchX aria-hidden="true" className="mx-auto mb-4 h-9 w-9 text-muted-foreground" />
              <p className="font-serif text-xl">{t.menuNoDishes}</p>
              <button type="button" onClick={clearFilters} className="mt-4 min-h-11 text-sm font-semibold text-primary underline underline-offset-4">{vn ? "Xóa bộ lọc và tìm lại" : "Clear filters and start again"}</button>
            </div>
          )}
        </div>

        <section className="page-container pb-12 md:pb-20">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#30251f] p-7 text-[#fff8ee] sm:flex-row sm:items-center md:p-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#eabda4]">{ui("MIX FOOD · DA NANG") }</p>
              <h2 className="font-serif text-2xl font-semibold md:text-3xl">{t.menuReadyToDine}</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#e4d4c8]">{t.menuReadyToDineDesc}</p>
            </div>
            <Link to={ROUTES.BOOKING} className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-[#fff8ee] px-6 text-sm font-semibold text-[#30251f] transition-colors hover:bg-white">{t.reserveTable}<ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MenuContent;
