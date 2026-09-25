import axios from "@/lib/axios";
import { Category, MenuItem, MenuItemTag } from "@/types";

interface CategoryName {
  en: string;
  vn?: string;
  vi?: string;
}

interface ProductCategoryResponse {
  id: number;
  name: CategoryName | string;
}

interface ProductImageResponse {
  secureUrl?: string | null;
  url?: string | null;
}

interface MenuItemResponse {
  id: number;
  name: CategoryName | string;
  price: number;
  image: string | null;
  tags: string[] | null;
  categoryId: number;
  isActive: boolean;
  category?: ProductCategoryResponse;
  productImage?: ProductImageResponse | null;
}

interface CategoryResponse {
  id: number;
  name: CategoryName | string;
  products: MenuItemResponse[];
}

const normalizeName = (name: CategoryName | string): { en: string; vn: string } => {
  if (name && typeof name === "object") {
    return {
      en: name.en ?? "",
      vn: name.vn ?? name.vi ?? "",
    };
  }
  return { en: String(name ?? ""), vn: String(name ?? "") };
};

const normalizeTags = (tags: string[] | null): MenuItemTag[] => {
  if (!Array.isArray(tags)) return [];
  const tagAliases: Record<string, MenuItemTag> = {
    signature: "signature",
    spicy: "spicy",
    cay: "spicy",
    recommended: "recommended",
    popular: "recommended",
    vegetarian: "vegetarian",
    veggie: "vegetarian",
    chay: "vegetarian",
    "gluten-free": "gluten-free",
    "gluten free": "gluten-free",
    "chef's special": "chefs-special",
    "chefs special": "chefs-special",
  };

  return [...new Set(
    tags
      .map((tag) => tagAliases[tag.trim().toLowerCase()])
      .filter((tag): tag is MenuItemTag => Boolean(tag)),
  )];
};

const getItemImage = (menuItem: MenuItemResponse): string | null => {
  return (
    menuItem.image ??
    menuItem.productImage?.secureUrl ??
    menuItem.productImage?.url ??
    null
  );
};

const transformMenuItem = (menuItem: MenuItemResponse): MenuItem => ({
  id: menuItem.id,
  name: normalizeName(menuItem.name),
  price: menuItem.price,
  image: getItemImage(menuItem),
  tags: normalizeTags(menuItem.tags),
});

const transformCategory = (category: CategoryResponse): Category => {
  const name = normalizeName(category.name);
  return {
    id: `category-${category.id}`,
    en: name.en,
    vn: name.vn,
    items: (category.products ?? [])
      .filter((menuItem) => menuItem.isActive !== false)
      .map(transformMenuItem),
  };
};

export const menuService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await axios.get<CategoryResponse[]>("/categories");
    return (response.data ?? []).map(transformCategory);
  },

  async getAllMenuItems(): Promise<MenuItem[]> {
    const response = await axios.get<MenuItemResponse[]>("/products");
    return (response.data ?? [])
      .filter((menuItem) => menuItem.isActive !== false)
      .map(transformMenuItem);
  },
};
