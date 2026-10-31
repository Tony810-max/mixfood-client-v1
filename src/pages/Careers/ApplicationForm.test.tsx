import { LanguageProvider } from '@/contexts/LanguageContext';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApplicationForm } from './ApplicationForm';

const positions = [{ id: 2, position: 'PARKING' as const, vacancies: 1, isActive: true, createdAt: '2026-10-28T10:00:00Z', employmentTypes: ['FULL_TIME' as const] }];
const fillAndSubmit = () => {
  fireEvent.change(screen.getByLabelText('Họ và tên *'), { target: { value: 'Test Applicant' } });
  fireEvent.change(screen.getByLabelText('Số điện thoại *'), { target: { value: '0905123456' } });
  fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Thời gian có thể làm việc *'), { target: { value: 'Ca tối' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Gửi hồ sơ ứng tuyển' }).closest('form')!);
};
beforeEach(() => { document.cookie = 'lang=vn;path=/'; });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Application form', () => {
  it('submits to the API for the selected vacancy and confirms receipt', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    render(<LanguageProvider><ApplicationForm positions={positions} selectedId={2} onSelect={vi.fn()} /></LanguageProvider>);
    fillAndSubmit();
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Đã nhận hồ sơ'));
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/recruitment\/applications$/);
    expect(JSON.parse(request.body)).toMatchObject({ positionId: 2, employmentType: 'FULL_TIME', fullName: 'Test Applicant', phone: '0905123456', email: 'test@example.com', availability: 'Ca tối' });
    expect(screen.getByLabelText('Họ và tên *')).toHaveValue('');
  });

  it('keeps entered data when a vacancy closes before submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ message: 'Vị trí này đã tạm dừng tuyển dụng.' }) }));
    render(<LanguageProvider><ApplicationForm positions={positions} selectedId={2} onSelect={vi.fn()} /></LanguageProvider>);
    fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent('tạm dừng tuyển dụng');
    expect(screen.getByLabelText('Họ và tên *')).toHaveValue('Test Applicant');
    expect(screen.getByRole('button', { name: 'Gửi hồ sơ ứng tuyển' })).toBeEnabled();
  });
});
