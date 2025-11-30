import React from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

// TypeScript declaration for import.meta.glob
declare global {
  interface ImportMeta {
    glob(
      pattern: string,
      options?: {
        eager?: boolean;
        import?: string;
        query?: string;
      }
    ): Record<string, any>;
  }
}

const posts = import.meta.glob("../../blog/*.md", { eager: true, import: "default", query: "?raw" }) as Record<string, any>;

const BlogPostPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  if (!slug) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <p className="p-4">Post not found.</p>
      </div>
    );
  }

  // Find the matching key robustly because import.meta.glob keys can vary in path format
  const key = Object.keys(posts).find((k) => k.endsWith(`/blog/${slug}.md`) || k.endsWith(`/${slug}.md`));
  const content = key ? posts[key] : undefined;
  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <p className="p-4">Post not found.</p>
      </div>
    );
  }
  // Unwrap possible module shape (some bundlers return { default: string })
  const raw = typeof content === "string" ? content : (content?.default ?? String(content));

  // Use gray-matter to parse frontmatter reliably
  const { data: metaData, content: body } = matter(String(raw));
  const meta = (metaData || {}) as Record<string, any>;
  return (
    <>
      <SEO
        title={meta.title ? `${meta.title} – CodeNodeX Hosting` : 'CodeNodeX Hosting'}
        description={meta.description ?? ''}
        keywords={meta.keywords ?? ''}
        canonical={`https://example.com/blog/${slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: meta.title ?? '' }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <article className="prose prose-invert mx-auto p-4 pt-24">
          <ReactMarkdown>{body}</ReactMarkdown>
        </article>
        <div className="p-4">
          <Link to="/blog" className="text-primary underline">← Back to blog</Link>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
