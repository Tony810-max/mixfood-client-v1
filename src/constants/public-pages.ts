import { RECRUITMENT_ROLES } from './recruitment';

export type PublicPageMetadata = {
  title: string;
  description: string;
  breadcrumbName?: string;
  keywords?: string[];
  en?: { title: string; description: string; breadcrumbName?: string };
};

export const PUBLIC_PAGE_METADATA: Record<string, PublicPageMetadata> = {
  '/': {
    en: { title: 'Mix Food | Authentic Thai Restaurant in Da Nang', description: 'Enjoy authentic Thai food at Mix Food in Da Nang: Tom Yum, Pad Thai, Som Tam and more. Explore our menu and reserve a table online.' },
    title: 'Mix Food | Nhà hàng Thái chuẩn vị tại Đà Nẵng',
    description: 'Thưởng thức ẩm thực Thái chuẩn vị tại Mix Food Đà Nẵng: Tom Yum, Pad Thai, Som Tam và nhiều món Thái tươi ngon. Xem thực đơn và đặt bàn trực tuyến.',
  },
  '/menu': {
    en: { title: 'Thai Food Menu in Da Nang | Mix Food', description: 'Explore the Mix Food menu in Da Nang, from Tom Yum and Pad Thai to fresh Thai favourites prepared daily.', breadcrumbName: 'Thai food menu' },
    title: 'Thực đơn món Thái tại Đà Nẵng | Mix Food',
    description: 'Khám phá thực đơn món ăn Thái tại Mix Food Đà Nẵng, từ Tom Yum, Pad Thai, Som Tam đến các món Thái được chế biến tươi mỗi ngày.',
    breadcrumbName: 'Thực đơn món Thái',
  },
  '/booking': {
    en: { title: 'Reserve a Table in Da Nang | Mix Food Thai Restaurant', description: 'Reserve a table at Mix Food in Da Nang. Choose your date, time and party size for an authentic Thai dining experience.', breadcrumbName: 'Reserve a table' },
    title: 'Đặt bàn nhà hàng Thái tại Đà Nẵng | Mix Food',
    description: 'Đặt bàn tại Mix Food Đà Nẵng nhanh chóng để thưởng thức ẩm thực Thái chuẩn vị. Chọn thời gian phù hợp và gửi yêu cầu trực tuyến.',
    breadcrumbName: 'Đặt bàn',
  },
  '/careers': {
    en: { title: 'Part-time and Full-time Jobs in Da Nang | Mix Food', description: 'Explore service, kitchen and parking jobs at Mix Food in Da Nang. Check current openings, employment types and salaries, then apply online.', breadcrumbName: 'Careers at Mix Food' },
    title: 'Tuyển dụng part-time & full-time tại Đà Nẵng | Mix Food',
    description: 'Mix Food tuyển dụng tại Đà Nẵng: nhân viên phục vụ part-time/full-time, phụ bếp và giữ xe. Xem vị trí đang tuyển, số lượng và ứng tuyển trực tuyến.',
    breadcrumbName: 'Tuyển dụng Mix Food',
    keywords: [
      'tuyển dụng Đà Nẵng',
      'việc làm part time Đà Nẵng',
      'việc làm bán thời gian Đà Nẵng',
      'tuyển nhân viên phục vụ Đà Nẵng',
      'tuyển phụ bếp Đà Nẵng',
      'tuyển nhân viên giữ xe Đà Nẵng',
      'việc làm nhà hàng Đà Nẵng',
      'Mix Food tuyển dụng',
    ],
  },
  ...Object.fromEntries(Object.values(RECRUITMENT_ROLES).map((role) => [
    `/careers/${role.slug}`,
    {
      title: `Tuyển ${role.vn.toLowerCase()} tại Đà Nẵng | Mix Food`,
      description: `${role.seo} ${role.description} Xem tình trạng tuyển dụng và gửi hồ sơ đến Mix Food.`,
      breadcrumbName: role.vn,
      en: {
        title: `${role.slug === 'nhan-vien-phuc-vu' ? 'Service Staff' : role.slug === 'nhan-vien-giu-xe' ? 'Parking Attendant' : 'Kitchen Assistant'} Jobs in Da Nang | Mix Food`,
        description: 'Explore this role at Mix Food in Da Nang. Check current vacancies, employment types and salary, then submit your application online.',
        breadcrumbName: role.slug === 'nhan-vien-phuc-vu' ? 'Service staff' : role.slug === 'nhan-vien-giu-xe' ? 'Parking attendant' : 'Kitchen assistant',
      },
    },
  ])),
};
