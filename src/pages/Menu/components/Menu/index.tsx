
import { useUiText } from '@/contexts/LanguageContext';
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { MenuItem } from "@/types";
import { ROUTES } from "@/utils/const";
import { formatPrice } from "../../utils/const";
import TagBadge from "../TagBadge";

const MenuItemCard = ({ item, lang, index, categoryName }: {
  item: MenuItem;
  lang: "en" | "vn";
  index: number;
  categoryName?: string;
}) => {
  const ui = useUiText();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemName = item.name[lang] || item.name.en || item.name.vn;
  const description = item.description?.[lang]?.trim()
    || item.description?.[lang === "vn" ? "en" : "vn"]?.trim();
  const detailsLabel = lang === "vn" ? ui("Xem chi tiết") : "View details";

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={detailsLabel + ": " + itemName}
        aria-haspopup="dialog"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
        className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-sm transition-shadow hover:border-primary/30 hover:shadow-layered-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary">
          <img
            src={item.image || "/image-blank.png"}
            onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/image-blank.png"; }}
            alt={itemName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          {!!item.tags?.length && (
            <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1 sm:left-3 sm:top-3">
              {item.tags.slice(0, 2).map((tag) => <TagBadge key={tag} tag={tag} lang={lang} />)}
            </div>
          )}
          <span className="absolute bottom-2 right-2 rounded-full bg-primary px-3 py-1 text-xs font-bold tabular-nums text-primary-foreground shadow-md sm:bottom-3 sm:right-3 sm:px-3.5 sm:py-1.5 sm:text-sm">
            {formatPrice(item.price)}
          </span>
        </div>
        <div className="flex w-full flex-1 items-center justify-between gap-2 p-3 sm:p-5">
          <span className="min-w-0 font-serif text-sm font-semibold leading-snug sm:text-lg">{itemName}</span>
          <ArrowUpRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
        </div>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onOpenAutoFocus={(event) => { event.preventDefault(); titleRef.current?.focus({ preventScroll: true }); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus({ preventScroll: true }); }}
          className="w-[calc(100%-1.5rem)] max-w-4xl gap-0 overflow-hidden rounded-3xl border-0 bg-card p-0 sm:rounded-3xl [&>button]:right-3 [&>button]:top-3 [&>button]:z-10 [&>button]:grid [&>button]:h-11 [&>button]:w-11 [&>button]:place-items-center [&>button]:rounded-full [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:opacity-100 [&>button]:shadow-sm"
        >
          <div className="grid max-h-[calc(100dvh-2rem)] overflow-y-auto md:grid-cols-2">
            <div className="flex items-center justify-center bg-secondary/50 p-4 md:p-6">
              <img
                src={item.image || "/image-blank.png"}
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/image-blank.png"; }}
                alt={itemName}
                className="block h-auto max-h-[50dvh] w-full rounded-2xl object-contain md:max-h-[70dvh]"
              />
            </div>
            <div className="flex flex-col p-5 sm:p-8 md:pt-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{categoryName || "Mix Food"}</p>
              <DialogTitle ref={titleRef} tabIndex={-1} className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">{itemName}</DialogTitle>
              <p className="mt-4 text-2xl font-bold tabular-nums text-primary">{formatPrice(item.price)}</p>
              {!!item.tags?.length && (
                <div className="mt-4 flex flex-wrap gap-2">{item.tags.map((tag) => <TagBadge key={tag} tag={tag} lang={lang} />)}</div>
              )}
              <div className="my-6 h-px bg-border/70" />
              <h3 className="mb-2 font-body text-sm font-semibold">{lang === "vn" ? "Về món ăn" : "About this dish"}</h3>
              <DialogDescription className="whitespace-pre-line text-sm leading-7">
                {description || (lang === "vn"
                  ? "Mô tả chi tiết đang được cập nhật. Bạn có thể liên hệ nhân viên để tìm hiểu thêm về món ăn và thành phần."
                  : "The full description is being updated. Ask our team for more about this dish and its ingredients.")}
              </DialogDescription>
              <div className="mb-6 mt-5 flex items-start gap-2.5 rounded-xl bg-secondary/60 p-3.5 text-xs leading-5 text-muted-foreground">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>{lang === "vn" ? "Vui lòng báo nhân viên nếu bạn dị ứng thực phẩm hoặc có yêu cầu riêng về độ cay." : "Please let our team know about food allergies or your preferred spice level."}</p>
              </div>
              <Link to={ROUTES.BOOKING} className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                {lang === "vn" ? "Đặt bàn thưởng thức" : "Reserve a table"}<ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItemCard;
