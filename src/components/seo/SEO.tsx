import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
}

export const SEO = ({ title, description, path = "/" }: SEOProps) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = title;

    const ensureTag = (selector: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      return el as HTMLElement;
    };

    const desc = ensureTag('meta[name="description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    }) as HTMLMetaElement;
    desc.setAttribute('content', description);

    const url = window.location.origin + path;
    const canonical = ensureTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }) as HTMLLinkElement;
    canonical.setAttribute('href', url);

    const ogTitle = ensureTag('meta[property="og:title"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:title');
      return m;
    }) as HTMLMetaElement;
    ogTitle.setAttribute('content', title);

    const ogDesc = ensureTag('meta[property="og:description"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('property', 'og:description');
      return m;
    }) as HTMLMetaElement;
    ogDesc.setAttribute('content', description);

    const scriptId = 'seo-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = scriptId;
      document.head.appendChild(scriptEl);
    }
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Smart Todo AI",
      applicationCategory: "ProductivityApplication",
      description,
      url,
    };
    scriptEl.textContent = JSON.stringify(jsonLd);
  }, [title, description, path]);

  return null;
};
