import { getPaginatedPosts, getSidebarData } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import CategoryPills from "@/components/CategoryPills";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const [{ posts, totalPages }, sidebarData] = await Promise.all([
    getPaginatedPosts(1),
    getSidebarData(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="max-w-[1300px] mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-[42px] md:text-[52px] font-semibold text-ontario-dark dark:text-gray-100 leading-tight max-w-[800px] mx-auto">
          <span className="text-ontario-accent">Deep Insights:</span> Tales of
          Technology, Business and Success.
        </h1>
        <p className="text-ontario-body dark:text-gray-400 mt-4 max-w-[600px] mx-auto text-[16px] leading-relaxed">
          Welcome to the Deburise Blog! This is a space for insights, stories,
          and practical ideas to inspire your next move.
        </p>
        <CategoryPills />
      </section>

      {/* Content + Sidebar */}
      <section className="max-w-[1300px] mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Posts Grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <Pagination currentPage={1} totalPages={totalPages} />
          </div>

          {/* Sidebar */}
          <Sidebar data={sidebarData} />
        </div>
      </section>
    </>
  );
}
