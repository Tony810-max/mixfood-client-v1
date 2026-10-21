import { Category } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import MenuItemCard from "./Menu";

const ITEMS_PER_PAGE = 12;

const CategorySection = ({
  category,
  lang,
}: {
  category: Category;
  lang: "en" | "vn";
}) => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(category.items.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = category.items.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById(category.id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section
      id={category.id}
      data-id={category.id}
      className="min-h-[18.75rem] scroll-mt-[260px] sm:scroll-mt-[220px]"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8"
      >
        <h2 className="min-w-0 font-serif text-xl font-semibold text-foreground md:text-2xl lg:text-3xl">
          {category[lang] || category.en || category.vn}
        </h2>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs md:text-sm text-muted-foreground tabular-nums shrink-0">
          {category.items.length} {t.menuItems}
        </span>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-6">
        {currentItems.map((item, i) => (
          <MenuItemCard
            key={item.id}
            item={item}
            lang={lang}
            index={i}
            categoryName={category[lang] || category.en || category.vn}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label={lang === "vn" ? "Phân trang món ăn" : "Dish pages"}>
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="min-h-11 rounded-lg bg-secondary px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.menuPrevious}
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-current={activePage === page ? "page" : undefined}
              className={`h-11 w-11 rounded-lg text-sm font-medium transition-colors ${
                activePage === page
                  ? "bg-primary text-white shadow-sm"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="min-h-11 rounded-lg bg-secondary px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.menuNext}
          </button>
        </div>
      )}
    </section>
  );
};

export default CategorySection;
