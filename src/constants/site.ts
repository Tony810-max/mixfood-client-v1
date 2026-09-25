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

export type PublicPageMetadata = {
  title: string;
  description: string;
  breadcrumbName?: string;
};

export const PUBLIC_PAGE_METADATA: Record<string, PublicPageMetadata> = {
  '/': {
    title: 'Mix Food | Nhà hàng Thái chuẩn vị tại Đà Nẵng',
    description: 'Thưởng thức ẩm thực Thái chuẩn vị tại Mix Food Đà Nẵng: Tom Yum, Pad Thai, Som Tam và nhiều món Thái tươi ngon. Xem thực đơn và đặt bàn trực tuyến.',
  },
  '/menu': {
    title: 'Thực đơn món Thái tại Đà Nẵng | Mix Food',
    description: 'Khám phá thực đơn món ăn Thái tại Mix Food Đà Nẵng, từ Tom Yum, Pad Thai, Som Tam đến các món Thái được chế biến tươi mỗi ngày.',
    breadcrumbName: 'Thực đơn món Thái',
  },
  '/booking': {
    title: 'Đặt bàn nhà hàng Thái tại Đà Nẵng | Mix Food',
    description: 'Đặt bàn tại Mix Food Đà Nẵng nhanh chóng để thưởng thức ẩm thực Thái chuẩn vị. Chọn thời gian phù hợp và gửi yêu cầu trực tuyến.',
    breadcrumbName: 'Đặt bàn',
  },
};

export const PUBLIC_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
