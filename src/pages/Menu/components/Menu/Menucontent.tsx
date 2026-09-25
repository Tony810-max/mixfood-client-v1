import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMenu } from "@/hooks/api/useMenu";
import { ROUTES } from "@/utils/const";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import restaurantImg from "../../../../assets/restaurant-interior.jpg";
import CategorySection from "../CategorySection";
import DropdownCategory from "./DropdownCategory";
import SearchContent from "./SearchContent";

const MenuContent = () => {
  const { lang, t } = useLanguage();
  const { data: categories, isLoading, error } = useMenu();
  const [searchParams] = useSearchParams();
  const requestedQuery = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(requestedQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => setSearchQuery(requestedQuery), [requestedQuery]);

  const filteredCategories = categories?.filter((category) => {
    const matchesCategory = !selectedCategory || selectedCategory === "all" || category.id === selectedCategory;
    const matchesSearch = !searchQuery || category.items.some((item) => 
      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.vn.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  }).map((category) => ({
    ...category,
    items: category.items.filter((item) => 
      !searchQuery || 
      item.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.vn.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((category) => category.items.length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground">
                {t.menuLoading}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">
                {t.menuLoadError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                {t.menuRetry}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <main>
      <section className="pt-[4.5rem]">
        <div className="relative h-[240px] md:h-[280px] lg:h-[360px] overflow-hidden">
          <img
            src={restaurantImg}
            alt="Mix Food Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          <div className="absolute inset-0 flex items-end -translate-y-1/2 top-1/2">
            <div className="container mx-auto px-4 md:px-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-2 md:mb-3"
              >
                {t.menuTitle}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-body text-background/70 text-base md:text-lg "
              >
                {t.menuSubtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <div className="sticky top-[80px] z-30 border-y border-border/70 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row md:px-6">
          <SearchContent value={searchQuery} onSearchChange={setSearchQuery} />
          <DropdownCategory onSelectCategory={setSelectedCategory} />
        </div>
      </div>

      {/* Category Sections */}
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-16 md:space-y-20">
        {filteredCategories?.map((category) => (
          <CategorySection key={category.id} category={category} lang={lang} />
        ))}
        {filteredCategories?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t.menuNoDishes}
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background p-6 md:p-10 lg:p-14 text-center"
        >
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-4">
            {t.menuReadyToDine}
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
            {t.menuReadyToDineDesc}
          </p>
          <Link
            to={ROUTES.BOOKING}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-primary-gradient px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl md:text-base"
          >
            {t.reserveTable}
          </Link>
        </motion.div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default MenuContent;
