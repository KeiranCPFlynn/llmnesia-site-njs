import { absoluteUrl, CHROME_WEB_STORE_URL, AUTHOR_URL } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LLMnesia',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/logo.svg'),
    foundingDate: '2026',
    founder: {
      '@type': 'Person',
      name: 'Keiran Flynn',
      url: absoluteUrl('/about')
    },
    sameAs: [CHROME_WEB_STORE_URL]
  };
}

export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LLMnesia',
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Chrome',
    url: absoluteUrl('/'),
    description:
      'Local-first browser extension to search and recover old answers, prompts, and decisions across AI chats.',
    screenshot: absoluteUrl('/assets/demo.png'),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    installUrl: CHROME_WEB_STORE_URL,
    publisher: {
      '@type': 'Organization',
      name: 'LLMnesia',
      url: absoluteUrl('/')
    }
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

function wordCountFromContent(content) {
  if (!content) return undefined;
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`_~\[\]]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function articleSchema(entry) {
  const wordCount = wordCountFromContent(entry.content);
  const keywords = [entry.primaryKeyword, ...(entry.secondaryKeywords || [])].join(', ');

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    datePublished: entry.publishDate,
    dateModified: entry.updatedDate,
    keywords,
    ...(wordCount ? { wordCount } : {}),
    author: {
      '@type': 'Person',
      name: entry.author,
      url: absoluteUrl('/about'),
      sameAs: [AUTHOR_URL]
    },
    publisher: {
      '@type': 'Organization',
      name: 'LLMnesia',
      url: absoluteUrl('/'),
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.svg') }
    },
    mainEntityOfPage: absoluteUrl(entry.canonicalPath),
    url: absoluteUrl(entry.canonicalPath)
  };
}

export function webPageSchema(entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: entry.title,
    description: entry.description,
    datePublished: entry.publishDate,
    dateModified: entry.updatedDate,
    author: {
      '@type': 'Person',
      name: entry.author,
      url: absoluteUrl('/about'),
      sameAs: [AUTHOR_URL]
    },
    mainEntityOfPage: absoluteUrl(entry.canonicalPath),
    url: absoluteUrl(entry.canonicalPath)
  };
}

export function personSchema({ name, url, description, sameAs = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url,
    description,
    sameAs
  };
}

export function faqSchema(entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entry.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

export function homepageFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}
