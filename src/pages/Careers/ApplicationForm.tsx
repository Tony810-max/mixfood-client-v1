import { useUiText } from '@/contexts/LanguageContext';
import { useState, type FormEvent } from 'react';
import { API_CONFIG } from '@/constants';
import { RECRUITMENT_ROLES, type Recruitment } from '@/constants/recruitment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

export function ApplicationForm({ positions, selectedId, onSelect }: {
  positions: Recruitment[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  const ui = useUiText();
  const selectedPosition = positions.find((job) => job.id === selectedId);
  const employmentTypes = selectedPosition?.employmentTypes ?? ['PART_TIME', 'FULL_TIME'];
  const [preferredType, setPreferredType] = useState('PART_TIME');
  const employmentType = employmentTypes.includes(preferredType as 'PART_TIME' | 'FULL_TIME') ? preferredType : employmentTypes[0];
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true);
    setError('');
    setSent(false);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/recruitment/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionId: selectedId,
          employmentType,
          fullName: String(values.get('fullName') ?? '').trim(),
          phone: String(values.get('phone') ?? '').trim(),
          email: String(values.get('email') ?? '').trim(),
          availability: String(values.get('availability') ?? '').trim(),
          experience: String(values.get('experience') ?? '').trim(),
        }),
      });
      if (!response.ok) {
        if (response.status === 429) throw new Error(ui("Bạn đã gửi nhiều lần. Vui lòng chờ một phút rồi thử lại."));
        const data = await response.json().catch(() => null);
        throw new Error(response.status === 400 && typeof data?.message === 'string'
          ? data.message : ui("Chưa gửi được hồ sơ. Vui lòng kiểm tra thông tin và thử lại."));
      }
      form.reset();
      setSent(true);
    } catch (cause) {
      setError(cause instanceof TypeError ? ui("Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.") : cause instanceof Error ? cause.message : ui("Không thể kết nối. Vui lòng thử lại."));
    } finally {
      setPending(false);
    }
  }

  return <section id="ung-tuyen" aria-labelledby="application-title" className="mx-auto mt-12 max-w-3xl scroll-mt-28 rounded-3xl border border-primary/20 bg-card p-6 shadow-layered md:p-8">
    <p className="text-xs font-semibold uppercase tracking-widest text-primary">{ui("Gia nhập Mix Food") }</p>
    <h2 id="application-title" className="mt-2 font-serif text-3xl font-semibold">{ui("Gửi hồ sơ ứng tuyển") }</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{ui("Điền thông tin bên dưới để quản lý liên hệ trao đổi công việc. Các mục có dấu * là bắt buộc.") }</p>
    {sent && <div role="status" className="mt-6 flex gap-3 rounded-xl border border-emerald-600/30 bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"><CheckCircle2 className="size-5 shrink-0" /><p>{ui("Đã nhận hồ sơ của bạn. Mix Food sẽ liên hệ qua số điện thoại hoặc email đã cung cấp.") }</p></div>}
    <form onSubmit={submit} className="mt-6 space-y-5">
      <fieldset disabled={pending} className="space-y-5 disabled:opacity-70">
        <div className="space-y-2"><Label htmlFor="application-position">{ui("Vị trí ứng tuyển *") }</Label><select id="application-position" name="positionId" required value={selectedId} onChange={(event) => onSelect(Number(event.target.value))} className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{positions.map((job) => <option key={job.id} value={job.id}>{ui(RECRUITMENT_ROLES[job.position].vn)}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="application-employment">{ui('Employment type')} *</Label><select id="application-employment" name="employmentType" required value={employmentType} onChange={(event) => setPreferredType(event.target.value)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground">{employmentTypes.map((type) => <option key={type} value={type}>{ui(type === 'PART_TIME' ? 'Part-time' : 'Full-time')}</option>)}</select></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="application-name">{ui("Họ và tên *") }</Label><Input id="application-name" name="fullName" autoComplete="name" required minLength={2} maxLength={100} placeholder="Nguyễn Văn An" /></div>
          <div className="space-y-2"><Label htmlFor="application-phone">{ui("Số điện thoại *") }</Label><Input id="application-phone" name="phone" type="tel" autoComplete="tel" required pattern="[+]?[0-9 \(\)\-]{9,20}" maxLength={20} onInput={(event) => { const digits = event.currentTarget.value.replace(/\D/g, '').length; event.currentTarget.setCustomValidity(digits >= 9 && digits <= 15 ? '' : ui("Vui lòng nhập số điện thoại gồm 9–15 chữ số.")); }} placeholder="0905 123 456" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="application-email">{ui("Email *") }</Label><Input id="application-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="ban@example.com" /></div>
        <div className="space-y-2"><Label htmlFor="application-availability">{ui("Thời gian có thể làm việc *") }</Label><Textarea id="application-availability" name="availability" required minLength={2} maxLength={500} placeholder={ui("Ví dụ: ca tối thứ 2–6, có thể bắt đầu từ tuần sau")} /></div>
        <div className="space-y-2"><Label htmlFor="application-experience">{ui("Kinh nghiệm / giới thiệu bản thân") }</Label><Textarea id="application-experience" name="experience" maxLength={2000} placeholder={ui("Chia sẻ kinh nghiệm hoặc điều bạn muốn Mix Food biết về mình")} /></div>
      </fieldset>
      <p className="text-xs leading-5 text-muted-foreground">{ui("Thông tin được gửi đến bộ phận quản lý tuyển dụng Mix Food để liên hệ về hồ sơ của bạn.") }</p>
      {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{ui(error)}</p>}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">{pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}{pending ? ui("Đang gửi hồ sơ…") : ui("Gửi hồ sơ ứng tuyển")}</Button>
    </form>
  </section>;
}
