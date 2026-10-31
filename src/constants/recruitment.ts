export const RECRUITMENT_ROLES = {
  SERVICE: { slug: 'nhan-vien-phuc-vu', vn: 'Nhân viên phục vụ', description: 'Đón tiếp và chăm sóc trải nghiệm của khách tại bàn.', seo: 'Tuyển nhân viên phục vụ nhà hàng tại Đà Nẵng.' },
  PARKING: { slug: 'nhan-vien-giu-xe', vn: 'Nhân viên giữ xe', description: 'Hướng dẫn, sắp xếp và bảo quản xe cho khách.', seo: 'Tuyển nhân viên giữ xe làm việc tại nhà hàng ở Đà Nẵng.' },
  KITCHEN_ASSISTANT: { slug: 'phu-bep', vn: 'Phụ bếp', description: 'Hỗ trợ sơ chế và giữ khu vực bếp luôn gọn gàng.', seo: 'Tuyển phụ bếp tại Đà Nẵng.' },
} as const;

export type Recruitment = {
  id: number;
  position: keyof typeof RECRUITMENT_ROLES;
  vacancies: number;
  isActive: boolean;
  createdAt: string;
  employmentTypes?: ('PART_TIME' | 'FULL_TIME')[];
  salaryAmount?: number | null;
  workingHours?: string | null;
  salaryUnit?: 'HOUR' | 'MONTH';
};
