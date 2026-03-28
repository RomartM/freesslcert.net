export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  description: string;
  keywords: string[];
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "why-https-matters-2026",
    title: "Why HTTPS Matters in 2026: Security, SEO, and Trust",
    excerpt:
      "HTTPS is no longer optional. Learn how SSL certificates impact your search rankings, protect user data, and why every website needs encryption in 2026.",
    date: "2026-03-15",
    readTime: "8 min read",
    description:
      "Discover why HTTPS is essential in 2026 for SEO rankings, browser trust, data protection, and modern web API access. Learn how to get a free SSL certificate.",
    keywords: [
      "why HTTPS matters",
      "HTTPS SEO",
      "SSL certificate importance",
      "HTTPS 2026",
      "browser security warnings",
      "free SSL certificate",
    ],
  },
  {
    slug: "lets-encrypt-guide",
    title: "Let's Encrypt Explained: How Free SSL Certificates Work",
    excerpt:
      "A comprehensive guide to Let's Encrypt, the nonprofit Certificate Authority that has issued billions of free SSL certificates. Learn how ACME works and how to get started.",
    date: "2026-03-01",
    readTime: "9 min read",
    description:
      "Learn how Let's Encrypt provides free SSL certificates using the ACME protocol. Covers domain validation, 90-day lifetimes, rate limits, and alternatives to certbot.",
    keywords: [
      "Let's Encrypt",
      "free SSL certificate",
      "ACME protocol",
      "certbot alternative",
      "domain validation",
      "ISRG",
    ],
  },
  {
    slug: "ssl-certificate-types-explained",
    title:
      "SSL Certificate Types Explained: DV, OV, EV - Which Do You Need?",
    excerpt:
      "Not all SSL certificates are the same. Understand the differences between DV, OV, and EV certificates, plus wildcard and multi-domain options, to choose the right one.",
    date: "2026-02-15",
    readTime: "10 min read",
    description:
      "Compare SSL certificate types: Domain Validated (DV), Organization Validated (OV), and Extended Validation (EV). Includes wildcard and SAN certificates explained.",
    keywords: [
      "SSL certificate types",
      "DV certificate",
      "OV certificate",
      "EV certificate",
      "wildcard SSL",
      "SAN certificate",
      "multi-domain SSL",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(
  currentSlug: string,
  count: number = 2,
): BlogPostMeta[] {
  return BLOG_POSTS.filter((post) => post.slug !== currentSlug).slice(0, count);
}
