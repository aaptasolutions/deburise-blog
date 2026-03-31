import Image from "next/image";
import Link from "next/link";
import { SidebarData } from "@/types";

export default function Sidebar({ data }: { data: SidebarData }) {
  return (
    <aside className="w-full lg:w-[340px] shrink-0">
      <div className="sticky-sidebar space-y-10">
        {/* About Widget */}
        <div className="text-center">
          <h3 className="text-[11px] font-semibold text-ontario-dark uppercase tracking-widest mb-6">
            About
          </h3>
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mb-4">
            <Image
              src={data.author.avatar || "/images/author.jpg"}
              alt={data.author.name}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
          <h4 className="text-[18px] font-semibold text-ontario-dark">
            {data.author.name}
          </h4>
          <p className="text-[13px] text-ontario-meta mt-1">{data.author.role}</p>
          <p className="text-[14px] text-ontario-body mt-3 leading-relaxed">
            {data.author.bio}
          </p>
          <div className="flex justify-center gap-3 mt-4">
            {data.author.social.facebook && (
              <SocialIcon href={data.author.social.facebook} label="Facebook" path="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            )}
            {data.author.social.twitter && (
              <SocialIcon href={data.author.social.twitter} label="Twitter" path="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            )}
            {data.author.social.instagram && (
              <SocialIcon href={data.author.social.instagram} label="Instagram" path="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" />
            )}
            {data.author.social.linkedin && (
              <SocialIcon href={data.author.social.linkedin} label="LinkedIn" path="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
            )}
          </div>
        </div>

        {/* Featured Posts */}
        <div>
          <h3 className="text-[11px] font-semibold text-ontario-dark uppercase tracking-widest mb-6">
            Featured Posts
          </h3>
          <div className="space-y-5">
            {data.featuredPosts.slice(0, 3).map((post) => (
              <div key={post.slug} className="flex gap-4">
                <div className="w-[80px] h-[80px] rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-[14px] font-semibold text-ontario-dark leading-snug hover:text-ontario-accent transition-colors line-clamp-2"
                  >
                    {post.title}
                  </Link>
                  <p className="text-[12px] text-ontario-meta mt-1.5">
                    <Link href="#" className="text-ontario-accent hover:underline">
                      {post.author.name}
                    </Link>
                    {" "}on {post.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-[11px] font-semibold text-ontario-dark uppercase tracking-widest mb-6">
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`cat-pill-${cat.color} text-[12px] px-4 py-1.5 rounded-full border text-ontario-body hover:text-ontario-accent transition-colors`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div>
          <h3 className="text-[11px] font-semibold text-ontario-dark uppercase tracking-widest mb-6">
            Related Articles
          </h3>
          <div className="space-y-4">
            {data.recentPosts.map((post) => (
              <div key={post.slug} className="group">
                <div className="rounded-xl overflow-hidden mb-3">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={340}
                    height={200}
                    className="object-cover w-full h-[180px] group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <Link
                  href={`/post/${post.slug}`}
                  className="text-[15px] font-semibold text-ontario-dark leading-snug hover:text-ontario-accent transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-[12px] text-ontario-meta mt-1">{post.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h3 className="text-[11px] font-semibold text-ontario-dark uppercase tracking-widest mb-6">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="text-[12px] px-3 py-1.5 rounded-full bg-ontario-light-bg border border-ontario-border text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors"
              >
                {tag.name} ({tag.count})
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function SocialIcon({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      className="w-8 h-8 rounded-full border border-ontario-border flex items-center justify-center text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors"
      aria-label={label}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </a>
  );
}
