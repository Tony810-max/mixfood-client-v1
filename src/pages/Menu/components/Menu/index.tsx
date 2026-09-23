import { MenuItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { formatPrice } from "../../utils/const";
import TagBadge from "../TagBadge";
import { useState } from "react";

const MenuItemCard = ({
  item,
  lang,
  index,
}: {
  item: MenuItem;
  lang: "en" | "vn";
  index: number;
}) => {
  const [imageOpen, setImageOpen] = useState(false);
  const itemName = item.name[lang];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group bg-card flex flex-col overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <button
            type="button"
            className="block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            onClick={() => setImageOpen(true)}
            aria-label={`View image of ${itemName}`}
          >
            <img
              src={item.image ?? "/image-blank.png"}
              alt={itemName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </button>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {item.tags && item.tags.length > 0 && (
            <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} lang={lang} />
              ))}
            </div>
          )}
          <div className="pointer-events-none absolute right-3 bottom-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-lg">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-3 p-4">
          <h3 className="flex-1 font-serif text-base font-bold leading-snug text-foreground line-clamp-2">
            {itemName}
          </h3>
          <span className="shrink-0 whitespace-nowrap text-base font-bold tabular-nums text-primary transition-opacity duration-200 group-hover:opacity-0">
            {formatPrice(item.price)}
          </span>
        </div>
      </motion.div>

      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-4xl p-3 sm:p-4">
          <DialogHeader className="pr-10">
            <DialogTitle>{itemName}</DialogTitle>
            <DialogDescription>{formatPrice(item.price)}</DialogDescription>
          </DialogHeader>
          <img
            src={item.image ?? "/image-blank.png"}
            alt={itemName}
            className="max-h-[70dvh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuItemCard;
