import { LanguageProvider } from '@/contexts/LanguageContext';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CareersPage from './index';

vi.mock('@/components/layout/Header', () => ({ default: () => null }));
vi.mock('@/components/layout/Footer', () => ({ default: () => null }));

const job = { id: 1, position: 'SERVICE', vacancies: 2, isActive: true, createdAt: '2026-10-28T10:00:00Z', employmentTypes: ['FULL_TIME'], salaryAmount: 6000000, salaryUnit: 'MONTH' };
const response = (data: unknown) => ({ ok: true, json: async () => data });
const show = (route = '/careers') => render(
  <LanguageProvider><MemoryRouter initialEntries={[route]}>
    <Routes><Route path="/careers" element={<CareersPage />} /><Route path="/careers/:slug" element={<CareersPage />} /></Routes>
  </MemoryRouter></LanguageProvider>,
);

beforeEach(() => { document.cookie = 'lang=vn;path=/'; });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Recruitment discovery', () => {
  it('shows configured working hours and hides paused positions', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([
      { ...job, workingHours: '17:00–22:00' },
      { ...job, id: 2, position: 'PARKING', isActive: false },
    ])));
    show();
    expect(await screen.findByText('17:00–22:00')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.queryByRole('link', { name: 'Nhân viên giữ xe' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('part-time & full-time');
  });

  it('links each live job to its own page without JobPosting markup on the list', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([job])));
    show();
    expect(await screen.findByRole('link', { name: 'Nhân viên phục vụ' })).toHaveAttribute('href', '/careers/nhan-vien-phuc-vu');
    expect(document.getElementById('career-job-posting-schema')).toBeNull();
  });

  it('adds one matching JobPosting only on the detail page and cleans it on navigation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([job])));
    show('/careers/nhan-vien-phuc-vu');
    await waitFor(() => expect(document.getElementById('career-job-posting-schema')).not.toBeNull());
    const schema = JSON.parse(document.getElementById('career-job-posting-schema')!.textContent!);
    expect(schema['@graph']).toHaveLength(1);
    expect(schema['@graph'][0]).toMatchObject({ title: 'Nhân viên phục vụ', url: expect.stringContaining('/careers/nhan-vien-phuc-vu') });
    fireEvent.click(screen.getByRole('link', { name: /Tất cả vị trí/ }));
    await waitFor(() => expect(document.getElementById('career-job-posting-schema')).toBeNull());
  });

  it('distinguishes an API failure from no vacancies and allows retry', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce(response([job]));
    vi.stubGlobal('fetch', fetchMock);
    show();
    expect(await screen.findByRole('alert')).toHaveTextContent('Chưa tải được thông tin tuyển dụng');
    fireEvent.click(screen.getByRole('button', { name: 'Thử lại' }));
    expect(await screen.findByRole('link', { name: 'Nhân viên phục vụ' })).toBeInTheDocument();
  });

  it('does not advertise a closed job in content or structured data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([{ ...job, isActive: false }])));
    show('/careers/nhan-vien-phuc-vu');
    expect(await screen.findByText(/Hiện chưa có vị trí tuyển dụng/)).toBeInTheDocument();
    expect(document.getElementById('career-job-posting-schema')).toBeNull();
  });
});
