import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { RESTAURANT, SITE } from '@/constants/site';
import { BriefcaseBusiness, Clock3, MapPin, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { RECRUITMENT_ROLES as labels, type Recruitment } from '@/constants/recruitment';
import { Link, useParams } from 'react-router-dom';
import { API_CONFIG } from '@/constants';
import { useLanguage, useUiText } from '@/contexts/LanguageContext';
import { ApplicationForm } from './ApplicationForm';

export default function CareersPage() {
  const { lang } = useLanguage();
  const ui = useUiText();
  const [positions, setPositions] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [applicationPositionId, setApplicationPositionId] = useState<number>();
  const { slug } = useParams();
  const selectedRole = Object.values(labels).find((role) => role.slug === slug);
  const visiblePositions = useMemo(() => slug ? positions.filter((job) => labels[job.position].slug === slug) : positions, [positions, slug]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`${API_CONFIG.BASE_URL.replace(/\/$/, '')}/recruitment`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Recruitment unavailable'); return response.json(); })
      .then((data: Recruitment[]) => {
        if (!Array.isArray(data)) throw new Error('Invalid recruitment response');
        setPositions(data.filter((job) => job.isActive && job.position in labels));
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    const id = 'career-job-posting-schema';
    const existing = document.head.querySelector<HTMLScriptElement>(`#${id}`);
    if (!slug || visiblePositions.length !== 1 || loading || error) {
      existing?.remove();
      return;
    }
    const script = existing ?? document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': visiblePositions.map((job) => ({
        '@type': 'JobPosting',
        title: ui(labels[job.position].vn),
        description: `${labels[job.position].seo} ${labels[job.position].description} Mix Food đang cần tuyển ${job.vacancies} vị trí.`,
        datePosted: new Date(job.createdAt).toISOString().slice(0, 10),
        employmentType: job.employmentTypes ?? ['PART_TIME', 'FULL_TIME'],
        ...(job.salaryAmount ? { baseSalary: { '@type': 'MonetaryAmount', currency: 'VND', value: { '@type': 'QuantitativeValue', value: job.salaryAmount, unitText: job.salaryUnit === 'MONTH' ? 'MONTH' : 'HOUR' } } } : {}),
        hiringOrganization: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url, email: RESTAURANT.email },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: RESTAURANT.address, addressLocality: ui("Đà Nẵng"), addressCountry: 'VN' } },
        url: `${SITE.url}/careers/${labels[job.position].slug}`,
      })),
    });
    if (!existing) document.head.appendChild(script);
    return () => script.remove();
  }, [visiblePositions, slug, loading, error, lang, ui]);

  return <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 md:pt-28">
      <section className="border-b border-border bg-secondary/35 py-14 md:py-20">
        <div className="page-container max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><BriefcaseBusiness className="size-4" /> {ui("Mix Food tuyển dụng") }</span>
          <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight md:text-5xl">{selectedRole ? `Tuyển ${selectedRole.vn.toLowerCase()} tại Đà Nẵng` : ui("Tuyển dụng việc làm part-time tại Đà Nẵng.")}</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">{ui("Mix Food tìm đồng đội tận tâm cho các vị trí nhân viên phục vụ, phụ bếp và giữ xe. Ứng viên có thể trao đổi ca làm part-time hoặc full-time phù hợp khi phỏng vấn.") }</p>
        </div>
      </section>
      <section className="page-container py-12 md:py-16">
        {slug && <Link to="/careers" className="mb-6 inline-block text-primary hover:underline">{ui("← Tất cả vị trí tuyển dụng") }</Link>}
        {loading ? <p className="py-16 text-center text-muted-foreground">{ui("Đang tải vị trí tuyển dụng…") }</p> : error ? <div role="alert" className="py-16 text-center"><p>{ui("Chưa tải được thông tin tuyển dụng. Vui lòng thử lại.") }</p><Button className="mt-4" onClick={() => setAttempt((value) => value + 1)}>{ui("Thử lại") }</Button></div> : visiblePositions.length === 0 ? <p className="rounded-2xl border bg-card px-6 py-16 text-center text-muted-foreground">{ui("Hiện chưa có vị trí tuyển dụng. Vui lòng quay lại sau.") }</p> : <div className={`grid gap-5 ${slug ? 'mx-auto max-w-3xl' : 'md:grid-cols-3'}`}>
          {visiblePositions.map((job) => {
            const position = labels[job.position];
            return <article key={job.id} className={`grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-layered ${slug ? '' : 'md:row-span-5 md:grid-rows-subgrid'}`}>
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><UsersRound className="size-5" aria-hidden="true" /></span>
                <h2 className="font-serif text-xl font-semibold leading-snug">{slug ? ui(position.vn) : <Link to={`/careers/${position.slug}`} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{ui(position.vn)}</Link>}</h2>
              </div>
              <div className="text-sm leading-6 text-muted-foreground">
                <p>{ui(position.description)}</p>
                {slug && <p className="mt-3">{ui("Nơi làm việc:")} {ui(RESTAURANT.address)}{ui(". Ngày đăng:")} <time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString(ui("vi-VN"))}</time>.</p>}
              </div>
              <div className="space-y-3 border-t border-border pt-5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2.5"><UsersRound className="size-4 shrink-0 text-primary" aria-hidden="true" /><span>{ui("Cần tuyển:")} <b className="font-semibold text-foreground">{job.vacancies} {ui("vị trí")}</b></span></p>
                <p className="flex items-center gap-2.5"><MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" /><span>{ui("Đà Nẵng")}</span></p>
                <p className="flex items-center gap-2.5"><Clock3 className="size-4 shrink-0 text-primary" aria-hidden="true" /><span>{ui("Trao đổi khi phỏng vấn")}</span></p>
              </div>
              <div className="flex flex-wrap content-start gap-2">{(job.employmentTypes ?? ['PART_TIME', 'FULL_TIME']).map((type) => <span key={type} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">{ui(type === 'PART_TIME' ? 'Part-time' : 'Full-time')}</span>)}</div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">{ui('Salary')}</p>
                <p className="mt-1 text-base font-semibold tabular-nums">{job.salaryAmount ? new Intl.NumberFormat(lang === 'vn' ? 'vi-VN' : 'en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(job.salaryAmount) + ' / ' + ui(job.salaryUnit === 'MONTH' ? 'month' : 'hour') : ui('Negotiable')}</p>
              </div>
            </article>;
          })}
        </div>}
        {!loading && !error && visiblePositions.length > 0 && <ApplicationForm positions={visiblePositions} selectedId={visiblePositions.some((job) => job.id === applicationPositionId) ? applicationPositionId! : visiblePositions[0].id} onSelect={setApplicationPositionId} />}
        <article className="mx-auto mt-12 max-w-3xl rounded-3xl border bg-secondary/30 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-semibold">{ui("Cơ hội việc làm nhà hàng tại Đà Nẵng") }</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{ui("Trang tuyển dụng Mix Food cập nhật các cơ hội việc làm bán thời gian và toàn thời gian tại Đà Nẵng. Nếu bạn đang tìm việc phục vụ part-time, phụ bếp, giữ xe hoặc muốn làm việc trong môi trường nhà hàng, hãy gửi hồ sơ để chúng tôi liên hệ khi có vị trí phù hợp.") }</p>
          <p className="mt-3 leading-7 text-muted-foreground">{ui("Kinh nghiệm là lợi thế; tinh thần trách nhiệm, thái độ tích cực và sự tôn trọng khách hàng là điều chúng tôi coi trọng. Số lượng tuyển cho từng vị trí được cập nhật trực tiếp trên trang này.") }</p>
        </article>
      </section>
    </main>
    <Footer />
  </div>;
}
