import React from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

const posts = Object.entries(
  import.meta.glob("../../blog/*.md", { eager: true, as: "raw" })
).map(([path, content]) => {
  const metaMatch = /^---\n([\s\S]*?)\n---/.exec(content as string);
  const metadata: Record<string, string> = {};
  if (metaMatch) {
    metaMatch[1].split("\n").forEach((line) => {
      const [key, ...rest] = line.split(":");
      metadata[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
    });
  }
  const slug = path.split("/").pop()?.replace(".md", "") || "";
  return { slug, ...metadata };
});

const BlogIndex = () => (
  <>
    <SEO
      title="Blog – CoreNode Hosting"
      description="Tips on running game servers and hosting with AMP."
      keywords="game server blog"
      canonical="https://example.com/blog"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'Blog' }}
    />
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-orbitron font-bold mb-8">Blog</h1>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="text-primary underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
);

export default BlogIndex;
