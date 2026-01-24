import { useEffect } from 'react';

interface PageMetadata {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

const BASE_URL = 'https://shiran-gilad.com';

export function usePageMetadata({
  title,
  description,
  ogImage,
  ogUrl,
  twitterCard = 'summary_large_image',
}: PageMetadata) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', 'website', true);
    if (ogUrl) {
      updateMetaTag('og:url', ogUrl, true);
    } else {
      updateMetaTag('og:url', `${BASE_URL}${window.location.pathname}`, true);
    }
    if (ogImage) {
      const imageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
      updateMetaTag('og:image', imageUrl, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (ogImage) {
      const imageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
      updateMetaTag('twitter:image', imageUrl);
    }
  }, [title, description, ogImage, ogUrl, twitterCard]);
}
