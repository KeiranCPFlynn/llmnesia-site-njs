import { absoluteUrl, CHROME_WEB_STORE_URL } from './site';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LLMnesia',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/assets/logo.svg'),
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
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    installUrl: CHROME_WEB_STORE_URL,
    publisher: {
      '@type': 'Organization',
      name: 'LLMnesia'
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

export function articleSchema(entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title,
    description: entry.description,
    datePublished: entry.publishDate,
    dateModified: entry.updatedDate,
    author: {
      '@type': 'Person',
      name: entry.author
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
      name: entry.author
    },
    mainEntityOfPage: absoluteUrl(entry.canonicalPath),
    url: absoluteUrl(entry.canonicalPath)
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
