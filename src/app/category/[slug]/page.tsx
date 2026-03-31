import { getPostsByCategory, getSidebarData } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${categoryName} Articles`,
    description: `Browse all articles in the ${categoryName} category.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [posts, sidebarData] = await Promise.all([
    getPostsByCategory(slug),
    getSidebarData(),
  ]);

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <>
      {/* Breadcrumb + Header */}
      <section className="bg-ontario-dark py-16">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[14px] text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </div>
          <h1 className="text-[42px] md:text-[52px] font-semibold text-white leading-tight">
            {categoryName}
          </h1>
        </div>
      </section>

      <section className="max-w-[1300px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <p className="text-ontario-body text-center py-12">
                No articles found in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
          <Sidebar data={sidebarData} />
        </div>
      </section>
    </>
  );
}
