import { ArrowLeft, Calendar, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StructuredData } from "@/components/seo/StructuredData";
import type { JsonLdSchema } from "@/components/seo/StructuredData";
import { getRelatedPosts } from "@/data/blogPosts";

export interface BlogPostProps {
  title: string;
  slug: string;
  date: string;
  readTime: string;
  description: string;
  keywords: string[];
  children: React.ReactNode;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPost({
  title,
  slug,
  date,
  readTime,
  description,
  keywords,
  children,
}: BlogPostProps) {
  const relatedPosts = getRelatedPosts(slug);
  const canonicalUrl = `https://freesslcert.net/blog/${slug}`;

  const articleSchema: JsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    datePublished: date,
    dateModified: date,
    url: canonicalUrl,
    author: {
      "@type": "Organization",
      name: "freesslcert.net",
      url: "https://freesslcert.net",
    },
    publisher: {
      "@type": "Organization",
      name: "freesslcert.net",
      url: "https://freesslcert.net",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
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
        item: "https://freesslcert.net/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Helmet>
        <title>{title} | freesslcert.net</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(", ")} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={date} />
        <meta property="article:modified_time" content={date} />
      </Helmet>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />

      {/* Breadcrumb navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-1.5 text-sm text-neutral-400"
      >
        <Link
          to="/"
          className="hover:text-neutral-600 transition-colors duration-150"
        >
          Home
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link
          to="/blog"
          className="hover:text-neutral-600 transition-colors duration-150"
        >
          Blog
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-neutral-600 truncate max-w-[200px] sm:max-w-none">
          {title}
        </span>
      </nav>

      {/* Article header */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-3">
            {title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" aria-hidden="true" />
              <time dateTime={date}>{formatDate(date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden="true" />
              {readTime}
            </span>
          </div>
        </header>

        {/* Article content */}
        <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
          {children}
        </div>

        {/* CTA section */}
        <section className="mt-12 rounded-lg border border-neutral-200/60 bg-neutral-50/50 p-5">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-3">
            Secure Your Website Today
          </h2>
          <p className="text-sm text-neutral-600 mb-3">
            Get a free SSL certificate for your website in minutes. No signup
            required, no cost, no hassle.
          </p>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors duration-150"
          >
            Generate a Free SSL Certificate
          </Link>
        </section>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-base font-semibold tracking-tight text-neutral-900 mb-4">
              Related Articles
            </h2>
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block rounded-lg border border-neutral-200/60 p-4 hover:bg-neutral-50/50 transition-colors duration-150"
                >
                  <h3 className="text-sm font-medium text-neutral-900 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-500">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="mt-10 pt-6 border-t border-neutral-100">
          <Link
            to="/blog"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
