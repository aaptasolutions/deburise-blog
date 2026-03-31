import { getPaginatedPosts, getSidebarData } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import CategoryPills from "@/components/CategoryPills";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ num: string }>;
}

export default async function PaginatedPage({ params }: PageProps) {
  const { num } = await params;
  const pageNum = parseInt(num);
  if (isNaN(pageNum) || pageNum < 1) notFound();

  const [{ posts, totalPages }, sidebarData] = await Promise.all([
    getPaginatedPosts(pageNum),
    getSidebarData(),
  ]);

  if (pageNum > totalPages) notFound();

  return (
    <>
      <section className="max-w-[1300px] mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-[42px] md:text-[52px] font-semibold text-ontario-dark leading-tight max-w-[800px] mx-auto">
          <span className="text-ontario-accent">Deep Insights:</span> Tales of
          Technology, Business and Success.
        </h1>
        <p className="text-ontario-body mt-4 max-w-[600px] mx-auto text-[16px] leading-relaxed">
          Welcome to the ONTARIO Blog! This is a space for insights, stories,
          and practical ideas to inspire your next move.
        </p>
        <CategoryPills />
      </section>

      <section className="max-w-[1300px] mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination currentPage={pageNum} totalPages={totalPages} />
          </div>
          <Sidebar data={sidebarData} />
        </div>
      </section>
    </>
  );
}
