import type { MenuItemTag } from '@/types';
import { BadgeCheck, ChefHat, Flame, Leaf, Star, type LucideIcon } from 'lucide-react';

export type MenuTagPresentation = {
  icon: LucideIcon;
  label: Record<'en' | 'vn', string>;
  className: string;
};

/** API tag values and their guest-facing presentation live in one reusable place. */
export const MENU_TAG_PRESENTATIONS: Record<MenuItemTag, MenuTagPresentation> = {
  signature: {
    icon: Star,
    label: { en: 'Signature', vn: 'Đặc trưng' },
    className: 'border border-[#9a5a0b] bg-[#3a2714] text-[#fed7aa]',
  },
  spicy: {
    icon: Flame,
    label: { en: 'Spicy', vn: 'Cay' },
    className: 'border border-[#8f302c] bg-[#3a201f] text-[#fecaca]',
  },
  recommended: {
    icon: BadgeCheck,
    label: { en: 'Recommended', vn: 'Đề xuất' },
    className: 'border border-[#a16207] bg-[#3a2f12] text-[#fde68a]',
  },
  vegetarian: {
    icon: Leaf,
    label: { en: 'Vegetarian', vn: 'Chay' },
    className: 'border border-[#4d7c0f] bg-[#253313] text-[#d9f99d]',
  },
  'gluten-free': {
    icon: Leaf,
    label: { en: 'Gluten-free', vn: 'Không gluten' },
    className: 'border border-[#0f766e] bg-[#12312f] text-[#99f6e4]',
  },
  'chefs-special': {
    icon: ChefHat,
    label: { en: "Chef's special", vn: 'Đặc biệt của bếp trưởng' },
    className: 'border border-[#a21caf] bg-[#3b1738] text-[#f5d0fe]',
  },
};
