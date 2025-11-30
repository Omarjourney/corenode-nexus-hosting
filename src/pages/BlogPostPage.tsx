import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

interface BlogPost {
  slug: string;
  title?: string;
  description?: string;
  keywords?: string;
  content: string;
}

const blogFiles = import.meta.glob<string>("../../blog/*.md", {
  eager: true,
  import: "default",
  query: "?raw"
});

const parseFrontMatter = (raw: string) => {
  const metaMatch = /^---\n([\s\S]*?)\n---/.exec(raw);
  const metadata: Record<string, string> = {};
  let content = raw;

  if (metaMatch) {
    metaMatch[1].split("\n").forEach((line) => {
      const [key, ...rest] = line.split(":");
      metadata[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
    });
    content = raw.slice(metaMatch[0].length).trim();
  }

  return { metadata, content };
};

const getPostBySlug = (slug?: string): BlogPost | null => {
  if (!slug) return null;

  const match = Object.entries(blogFiles).find(([path]) =>
    path.endsWith(`${slug}.md`)
  );

  if (!match) return null;

  const rawContent = match[1];
  const { metadata, content } = parseFrontMatter(rawContent);

  return {
    slug,
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    content
  };
};

const BlogPostPage = () => {
  const { slug } = useParams();

  const post = useMemo(() => getPostBySlug(slug), [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-[0.2em]">Blog</p>
          <h1 className="text-3xl font-orbitron font-bold">Post not found</h1>
          <p className="text-muted-foreground font-inter">
            The article you are looking for does not exist. It may have been moved or removed.
          </p>
          <Link to="/blog" className="text-primary underline font-medium">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = `${post.title ?? "Blog post"} – CodeNodeX Hosting`;
  const canonical = `https://example.com/blog/${post.slug}`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={post.description ?? "Read the latest updates from CodeNodeX Hosting."}
        keywords={post.keywords}
        canonical={canonical}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.description,
          url: canonical
        }}
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Blog</p>
              <h1 className="text-4xl font-orbitron font-bold text-foreground">
                {post.title ?? post.slug}
              </h1>
              {post.description && (
                <p className="text-lg text-muted-foreground font-inter">{post.description}</p>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            <Link to="/blog" className="inline-flex items-center text-primary underline font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogPostPage;
