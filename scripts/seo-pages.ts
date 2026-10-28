import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { PUBLIC_PAGE_METADATA } from '../src/constants/public-pages';
import { RECRUITMENT_ROLES } from '../src/constants/recruitment';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!));

// Serve real route metadata and evergreen content before JavaScript loads.
// Live vacancies and JobPosting markup remain API-driven to avoid stale jobs.
export function seoPages(siteUrl: string): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'mixfood-seo-pages',
    apply: 'build',
    configResolved(resolved) { config = resolved; },
    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
      const site = new URL(siteUrl).origin;
      for (const [route, page] of Object.entries(PUBLIC_PAGE_METADATA)) {
        const canonical = `${site}${route}`;
        let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
        const values: Record<string, string> = {
          description: page.description,
          'og:title': page.title, 'og:description': page.description, 'og:url': canonical,
          'twitter:title': page.title, 'twitter:description': page.description, 'twitter:url': canonical,
          'og:image': `${site}/social-share.jpg`, 'og:image:secure_url': `${site}/social-share.jpg`,
          'twitter:image': `${site}/social-share.jpg`,
        };
        html = html.replace(/<meta\s+(?:name|property)="([^"]+)"\s+content="[^"]*"\s*\/?>(\s*)/g,
          (tag, key: string, whitespace: string) => values[key] === undefined ? tag : tag.replace(/content="[^"]*"/, `content="${escapeHtml(values[key])}"`) + whitespace);
        html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>(\s*)/, `<link rel="canonical" href="${escapeHtml(canonical)}" />$1`);
        const role = Object.values(RECRUITMENT_ROLES).find((entry) => route === `/careers/${entry.slug}`);
        const links = route.startsWith('/careers')
          ? Object.values(RECRUITMENT_ROLES).map((entry) => `<li><a href="/careers/${entry.slug}">${escapeHtml(entry.vn)}</a>: ${escapeHtml(entry.description)}</li>`).join('')
          : '<li><a href="/menu">Thực đơn</a></li><li><a href="/booking">Đặt bàn</a></li><li><a href="/careers">Tuyển dụng tại Đà Nẵng</a></li>';
        const content = `<main><nav><a href="/">Mix Food</a> · <a href="/careers">Tuyển dụng</a></nav><h1>${escapeHtml(page.breadcrumbName ?? page.title)}</h1><p>${escapeHtml(page.description)}</p>${role ? `<p>${escapeHtml(role.description)}</p>` : ''}<ul>${links}</ul>${route.startsWith('/careers') ? '<p>Số lượng và tình trạng tuyển dụng được cập nhật khi tải trang. Gửi hồ sơ qua email, ghi rõ vị trí và ca làm mong muốn.</p><a href="mailto:mixfood1708@gmail.com">mixfood1708@gmail.com</a>' : ''}</main>`;
        html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
        // Keep structured-data URLs aligned with the configured canonical origin.
        html = html.replaceAll('https://mix-food.io.vn', site);
        const destination = route === '/' ? outDir : path.join(outDir, route.slice(1));
        await mkdir(destination, { recursive: true });
        await writeFile(path.join(destination, 'index.html'), html);
      }
      const locations = Object.keys(PUBLIC_PAGE_METADATA).map((route) => `<url><loc>${escapeHtml(`${site}${route}`)}</loc></url>`).join('\n');
      await writeFile(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations}\n</urlset>\n`);
      const robots = await readFile(path.join(outDir, 'robots.txt'), 'utf8');
      await writeFile(path.join(outDir, 'robots.txt'), robots.replace(/^Sitemap:.*$/m, `Sitemap: ${site}/sitemap.xml`));
    },
  };
}
