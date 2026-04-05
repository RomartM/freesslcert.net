import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";
import { BLOG_POSTS } from "@/data/blogPosts";
import { useCanonicalUrl, useHreflangUrls } from "@/hooks/useLocaleUrl";

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const blogSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "SSL Certificate Blog",
  description:
    "Learn about SSL certificates, HTTPS security, Let's Encrypt, and website encryption. Guides, tutorials, and best practices from freesslcert.net.",
  url: "https://freesslcert.net/blog/",
  publisher: {
    "@type": "Organization",
    name: "freesslcert.net",
    url: "https://freesslcert.net",
  },
  blogPost: BLOG_POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `https://freesslcert.net/blog/${post.slug}/`,
    author: {
      "@type": "Organization",
      name: "freesslcert.net",
    },
  })),
};

const breadcrumbSchema: JsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://freesslcert.net",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://freesslcert.net/blog/",
    },
  ],
};

export function BlogIndexPage() {
  const canonicalUrl = useCanonicalUrl("/blog");
  const hreflangUrls = useHreflangUrls("/blog");

  return (
    <div className="max-w-2xl mx-auto">
      <Helmet>
        <title>SSL Certificate Blog | freesslcert.net</title>
        <meta
          name="description"
          content="Learn about SSL certificates, HTTPS security, and website encryption. Guides, tutorials, and best practices for securing your website with free SSL certificates."
        />
        <meta
          name="keywords"
          content="SSL certificate blog, HTTPS security blog, free SSL guides, Let's Encrypt tutorials, website security"
        />
        <link rel="canonical" href={canonicalUrl} />

        {hreflangUrls.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
        ))}
      </Helmet>
      <StructuredData data={[blogSchema, breadcrumbSchema]} />

      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
        SSL Certificate Blog
      </h1>
      <p className="text-sm text-neutral-500 mb-8">
        Guides, tutorials, and best practices for securing your website with
        HTTPS
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}/`}
            className="group rounded-lg border border-neutral-200/60 p-5 hover:bg-neutral-50/50 transition-colors duration-150"
          >
            <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" aria-hidden="true" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors duration-150">
              {post.title}
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-150">
              Read article
              <ArrowRight
                className="size-3 group-hover:translate-x-0.5 transition-transform duration-150"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5">
        <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
          Ready to Secure Your Website?
        </h2>
        <p className="text-sm text-neutral-600 mb-3">
          Generate a free SSL certificate in minutes. No signup required, no
          cost, powered by Let&#39;s Encrypt.
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
        >
          Generate a Free SSL Certificate
        </Link>
      </section>
    </div>
  );
}
