import Image from "next/image";
import Link from "next/link";
import { Post } from "@/types";

const categoryColors: Record<string, string> = {
  ai: "cat-pill-ai",
  business: "cat-pill-business",
  crypto: "cat-pill-crypto",
  digital: "cat-pill-digital",
  news: "cat-pill-news",
  recent: "cat-pill-recent",
  startups: "cat-pill-startups",
  technology: "cat-pill-technology",
  trends: "cat-pill-trends",
};

export default function PostCard({ post }: { post: Post }) {
  const catClass = categoryColors[post.category.toLowerCase()] || "cat-pill-recent";

  return (
    <article className="group animate-fade-in-up">
      {/* Image */}
      <Link href={`/post/${post.slug}`} className="block relative rounded-[20px] overflow-hidden mb-5">
        <Image
          src={post.featuredImage}
          alt={post.title}
          width={600}
          height={400}
          className="object-cover w-full aspect-[3/2] group-hover:scale-105 transition-transform duration-500"
        />
        {/* Read time badge */}
        <span className="absolute top-4 left-4 bg-black/55 text-white text-[10px] font-medium px-2.5 py-1 rounded-[13px] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          {post.readTime}
        </span>
      </Link>

      {/* Category badge */}
      <Link
        href={`/category/${post.category.toLowerCase()}`}
        className={`${catClass} inline-block text-[11px] px-4 py-1 rounded-full border text-ontario-body hover:text-ontario-accent transition-colors mb-3`}
      >
        {post.category}
      </Link>

      {/* Excerpt */}
      <p className="text-[14px] text-ontario-body leading-relaxed mb-2 line-clamp-2">
        {post.excerpt}
      </p>

      {/* Title */}
      <h2 className="mb-3">
        <Link
          href={`/post/${post.slug}`}
          className="text-[22px] font-semibold text-ontario-dark leading-snug hover:text-ontario-accent transition-colors line-clamp-2"
        >
          {post.title}
        </Link>
      </h2>

      {/* Meta */}
      <div className="flex items-center gap-2 text-[13px] text-ontario-meta">
        <Link href="#" className="text-ontario-accent hover:underline font-medium">
          {post.author.name}
        </Link>
        <span>&middot;</span>
        <span>{post.date}</span>
      </div>
    </article>
  );
}
