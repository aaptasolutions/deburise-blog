import Link from "next/link";

const categories = [
  { name: "AI", slug: "ai", color: "ai" },
  { name: "Business", slug: "business", color: "business" },
  { name: "Crypto", slug: "crypto", color: "crypto" },
  { name: "Digital", slug: "digital", color: "digital" },
  { name: "News", slug: "news", color: "news" },
  { name: "Recent", slug: "recent", color: "recent" },
  { name: "Startups", slug: "startups", color: "startups" },
  { name: "Technology", slug: "technology", color: "technology" },
  { name: "Trends", slug: "trends", color: "trends" },
];

export default function CategoryPills() {
  return (
    <div className="flex flex-wrap justify-center gap-2.5 mt-8">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className={`cat-pill-${cat.color} inline-flex items-center gap-1.5 text-[11px] px-4 py-1 rounded-full border text-ontario-body hover:text-ontario-accent transition-colors`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
