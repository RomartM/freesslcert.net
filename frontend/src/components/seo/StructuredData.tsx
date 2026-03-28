/**
 * A JSON-LD structured data object with required schema.org context and type.
 */
export interface JsonLdSchema {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export interface StructuredDataProps {
  /** One or more JSON-LD schema objects to render as script tags. */
  data: JsonLdSchema | JsonLdSchema[];
}

/**
 * Renders JSON-LD structured data as `<script type="application/ld+json">` tags
 * in the component tree. Useful for adding page-specific structured data that
 * supplements the global schemas defined in index.html.
 *
 * Each schema object gets its own script tag to keep them independently parseable
 * by search engine crawlers.
 *
 * Usage:
 * ```tsx
 * <StructuredData data={{
 *   "@context": "https://schema.org",
 *   "@type": "BreadcrumbList",
 *   "itemListElement": [...]
 * }} />
 * ```
 */
export function StructuredData({ data }: StructuredDataProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((schema, index) => (
        <script
          key={`jsonld-${String(schema["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
