import React from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

const posts = import.meta.glob("../../blog/*.md", { eager: true, import: "default", query: "?raw" });

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = posts[`../../blog/${slug}.md`];
  if (!content) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <p className="p-4">Post not found.</p>
      </div>
    );
  }
  const raw = content as string;
  const metaMatch = /^---\n([\s\S]*?)\n---/.exec(raw);
  const meta: Record<string, string> = {};
  let body = raw;
  if (metaMatch) {
    metaMatch[1].split("\n").forEach((line) => {
      const [key, ...rest] = line.split(":");
      meta[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
    });
    body = raw.slice(metaMatch[0].length);
  }
  return (
    <>
      <SEO
        title={`${meta.title} – CodeNodeX Hosting`}
        description={meta.description}
        keywords={meta.keywords}
        canonical={`https://example.com/blog/${slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: meta.title }}
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
