export const SITE = {
  name: 'Mix Food',
  url: (import.meta.env.VITE_SITE_URL ?? 'https://mix-food.io.vn').replace(/\/$/, ''),
  locale: 'vi_VN',
  language: 'vi-VN',
  socialImagePath: '/social-share.jpg',
  socialImageAlt: 'Các món ăn Thái tại Mix Food Đà Nẵng',
  keywords: [
    'ẩm thực Thái Đà Nẵng',
    'nhà hàng Thái Đà Nẵng',
    'món ăn Thái',
    'Tom Yum',
    'Pad Thai',
    'Som Tam',
    'Mix Food',
  ],
} as const;

export const RESTAURANT = {
  address: 'K49 Nguyễn Văn Thoại, Hòa Thuận Tây, Hải Châu, Đà Nẵng, Việt Nam',
  telephone: '+84905473728',
  email: 'mixfood1708@gmail.com',
  priceRange: '$$',
  cuisines: ['Thai', 'Asian'],
  openingHours: { opens: '09:00', closes: '21:50' },
  coordinates: { latitude: 16.0542021, longitude: 108.2361093 },
} as const;

export { PUBLIC_PAGE_METADATA, type PublicPageMetadata } from './public-pages';

export const PUBLIC_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
