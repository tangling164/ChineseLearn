import { type Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  locale?: string;
  price?: string;
  currency?: string;
  availability?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chinese-learn.vercel.app";
const SITE_NAME = "Chinese101";
const DEFAULT_DESCRIPTION =
  "Learn Chinese typing with our interactive course. Master Pinyin input, practice with high-frequency words, and improve your Chinese typing skills through gamified lessons.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * 生成基础 SEO metadata
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    image = DEFAULT_IMAGE,
    url,
    type = "website",
  } = config;

  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    keywords: keywords?.join(", "),
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * 生成课程页面的结构化数据 (JSON-LD)
 */
export function generateCourseSchema({
  name,
  description,
  url,
  image,
  instructor,
  offers,
  aggregateRating,
}: {
  name: string;
  description: string;
  url: string;
  image: string;
  instructor: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${SITE_URL}${url}`,
    image: `${SITE_URL}${image}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    instructor: {
      "@type": "Person",
      name: instructor,
    },
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      availability: `https://schema.org/${offers.availability}`,
      url: `${SITE_URL}${url}`,
    },
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        ratingCount: aggregateRating.ratingCount,
      },
    }),
  };
}

/**
 * 生成产品页面的结构化数据
 */
export function generateProductSchema({
  name,
  description,
  url,
  image,
  price,
  currency = "USD",
  availability = "InStock",
}: {
  name: string;
  description: string;
  url: string;
  image: string;
  price: string;
  currency?: string;
  availability?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${SITE_URL}${image}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: `${SITE_URL}${url}`,
    },
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
  };
}

/**
 * 生成网站导航的结构化数据
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * 生成 FAQ 页面的结构化数据
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * 生成组织信息的结构化数据
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      // Add social media links here
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@chinese101.com",
      availableLanguage: ["English", "Chinese"],
    },
  };
}

/**
 * 生成 WebSite 信息的结构化数据
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * 预定义的关键词集合
 */
export const SEO_KEYWORDS = {
  chineseTyping: [
    "Chinese typing",
    "Chinese keyboard",
    "Pinyin input",
    "Chinese characters typing",
    "Learn Chinese typing",
    "Chinese input method",
  ],
  hsk: [
    "HSK exam",
    "HSK test preparation",
    "HSK typing",
    "Hanyu Shuiping Kaoshi",
    "Chinese proficiency test",
  ],
  course: [
    "Chinese course online",
    "Interactive Chinese lessons",
    "Chinese learning platform",
    "Chinese typing course",
    "Learn Chinese online",
  ],
  education: [
    "Chinese education",
    "Language learning",
    "Typing course",
    "Online learning",
    "Chinese language course",
  ],
};

/**
 * 生成完整的网站结构化数据
 */
export function generateWebSiteStructuredData() {
  return [
    generateWebSiteSchema(),
    generateOrganizationSchema(),
  ];
}
