import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { RESTAURANT, SITE } from '@/constants/site';
import { BriefcaseBusiness, Clock3, MapPin, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';

type Recruitment = { id: number; position: 'SERVICE' | 'PARKING' | 'KITCHEN_ASSISTANT'; vacancies: number; isActive: boolean; createdAt: string };

const labels = {
  SERVICE: { vn: 'Nhân viên phục vụ', en: 'Service staff', description: 'Đón tiếp và chăm sóc trải nghiệm của khách tại bàn.', seo: 'Tuyển nhân viên phục vụ nhà hàng part-time hoặc full-time tại Đà Nẵng.' },
  PARKING: { vn: 'Nhân viên giữ xe', en: 'Parking attendant', description: 'Hướng dẫn, sắp xếp và bảo quản xe cho khách.', seo: 'Tuyển nhân viên giữ xe làm việc tại nhà hàng ở Đà Nẵng.' },
  KITCHEN_ASSISTANT: { vn: 'Phụ bếp', en: 'Kitchen assistant', description: 'Hỗ trợ sơ chế và giữ khu vực bếp luôn gọn gàng.', seo: 'Tuyển phụ bếp part-time hoặc full-time tại Đà Nẵng.' },
} as const;

export default function CareersPage() {
  const [positions, setPositions] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    fetch(`${baseUrl}/recruitment`).then((response) => response.ok ? response.json() : []).then(setPositions).catch(() => setPositions([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = 'career-job-posting-schema';
    const existing = document.head.querySelector<HTMLScriptElement>(`#${id}`);
    if (positions.length === 0) {
      existing?.remove();
      return;
    }
    const script = existing ?? document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': positions.map((job) => ({
        '@type': 'JobPosting',
        title: labels[job.position].vn,
        description: `${labels[job.position].seo} ${labels[job.position].description} Mix Food đang cần tuyển ${job.vacancies} vị trí.`,
        datePosted: new Date(job.createdAt).toISOString().slice(0, 10),
        employmentType: ['PART_TIME', 'FULL_TIME'],
        hiringOrganization: { '@type': 'Organization', name: SITE.name, sameAs: SITE.url, email: RESTAURANT.email },
        jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', streetAddress: RESTAURANT.address, addressLocality: 'Đà Nẵng', addressCountry: 'VN' } },
        directApply: true,
        url: `${SITE.url}/careers`,
      })),
    });
    if (!existing) document.head.appendChild(script);
    return () => script.remove();
  }, [positions]);

  return <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-24 md:pt-28">
      <section className="border-b border-border bg-secondary/35 py-14 md:py-20">
        <div className="page-container max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><BriefcaseBusiness className="size-4" /> Mix Food tuyển dụng</span>
          <h1 className="mt-5 font-serif text-4xl font-semibold tracking-tight md:text-5xl">Tuyển dụng việc làm part-time tại Đà Nẵng.</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">Mix Food tìm đồng đội tận tâm cho các vị trí nhân viên phục vụ, phụ bếp và giữ xe. Ứng viên có thể trao đổi ca làm part-time hoặc full-time phù hợp khi phỏng vấn.</p>
        </div>
      </section>
      <section className="page-container py-12 md:py-16">
        {loading ? <p className="py-16 text-center text-muted-foreground">Đang tải vị trí tuyển dụng…</p> : positions.length === 0 ? <p className="rounded-2xl border bg-card px-6 py-16 text-center text-muted-foreground">Hiện chưa có vị trí tuyển dụng. Vui lòng quay lại sau.</p> : <div className="grid gap-5 md:grid-cols-3">
          {positions.map((job) => {
            const position = labels[job.position];
            return <article key={job.id} className="rounded-3xl border bg-card p-6 shadow-layered">
              <UsersRound className="size-6 text-primary" />
              <h2 className="mt-5 font-serif text-2xl font-semibold">{position.vn}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{position.description}</p>
              <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground"><p className="flex items-center gap-2"><UsersRound className="size-4 text-primary" /> Cần tuyển: <b className="text-foreground">{job.vacancies} vị trí</b></p><p className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Đà Nẵng</p><p className="flex items-center gap-2"><Clock3 className="size-4 text-primary" /> Trao đổi khi phỏng vấn</p></div>
              <Button asChild className="mt-6 w-full"><a href="mailto:mixfood1708@gmail.com?subject=Ứng tuyển Mix Food">Ứng tuyển ngay</a></Button>
            </article>;
          })}
        </div>}
        <article className="mx-auto mt-12 max-w-3xl rounded-3xl border bg-secondary/30 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-semibold">Cơ hội việc làm nhà hàng tại Đà Nẵng</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Trang tuyển dụng Mix Food cập nhật các cơ hội việc làm bán thời gian và toàn thời gian tại Đà Nẵng. Nếu bạn đang tìm việc phục vụ part-time, phụ bếp, giữ xe hoặc muốn làm việc trong môi trường nhà hàng, hãy gửi hồ sơ để chúng tôi liên hệ khi có vị trí phù hợp.</p>
          <p className="mt-3 leading-7 text-muted-foreground">Kinh nghiệm là lợi thế; tinh thần trách nhiệm, thái độ tích cực và sự tôn trọng khách hàng là điều chúng tôi coi trọng. Số lượng tuyển cho từng vị trí được cập nhật trực tiếp trên trang này.</p>
        </article>
      </section>
    </main>
    <Footer />
  </div>;
}
