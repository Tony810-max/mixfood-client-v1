
import { MENU_TAG_PRESENTATIONS } from "@/constants";
import type { MenuItemTag } from "@/types";

const TagBadge = ({ tag, lang }: { tag: MenuItemTag; lang: "en" | "vn" }) => {
  const c = MENU_TAG_PRESENTATIONS[tag];
  const Icon = c.icon;
  return (
    <span
      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${c.className}`}
    >
      <Icon size={12} className={tag === "signature" ? "fill-current" : ""} />
      {c.label[lang]}
    </span>
  );
};

export default TagBadge;
