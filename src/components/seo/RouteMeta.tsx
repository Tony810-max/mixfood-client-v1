import { PUBLIC_PAGE_METADATA, PUBLIC_ROBOTS, SITE, type PublicPageMetadata } from '@/constants/site';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const shareImageUrl = `${SITE.url}${SITE.socialImagePath}`;

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertBreadcrumbStructuredData(pathname: string, page: PublicPageMetadata | undefined) {
  const existingScript = document.head.querySelector<HTMLScriptElement>('#route-breadcrumb-schema');

  if (!page?.breadcrumbName) {
    existingScript?.remove();
    return;
  }

  const script = existingScript ?? document.createElement('script');
  script.id = 'route-breadcrumb-schema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: page.breadcrumbName, item: `${SITE.url}${pathname}` },
    ],
  });

  if (!existingScript) document.head.appendChild(script);
}

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPathname = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
    const page = PUBLIC_PAGE_METADATA[normalizedPathname];
    const isPublicPage = page !== undefined;
    const canonicalUrl = `${SITE.url}${normalizedPathname === '/' ? '/' : normalizedPathname}`;
    const title = page?.title ?? SITE.name;
    const description = page?.description ?? 'Mix Food mang hương vị ẩm thực Thái đặc trưng đến Đà Nẵng.';
    const robots = isPublicPage ? PUBLIC_ROBOTS : 'noindex, follow';

    document.title = title;
    document.documentElement.lang = SITE.language;
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="keywords"]', 'name', 'keywords', SITE.keywords.join(', '));
    upsertMeta('meta[name="robots"]', 'name', 'robots', robots);
    upsertMeta('meta[name="googlebot"]', 'name', 'googlebot', robots);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE.name);
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', SITE.locale);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', shareImageUrl);
    upsertMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', shareImageUrl);
    upsertMeta('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/jpeg');
    upsertMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    upsertMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', SITE.socialImageAlt);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImageUrl);
    upsertMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', SITE.socialImageAlt);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    upsertBreadcrumbStructuredData(normalizedPathname, page);
  }, [pathname]);

  return null;
}
