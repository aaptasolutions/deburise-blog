import { getPostBySlug, getAllPosts, getAdjacentPosts, getRelatedPosts, getSidebarData } from "@/lib/posts";
import Sidebar from "@/components/Sidebar";
import ShareBar from "@/components/ShareBar";
import DisqusComments from "@/components/DisqusComments";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const seo = post.seo;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

  return {
    title: seo?.metaTitle || post.title,
    description: seo?.metaDescription || post.excerpt,
    keywords: seo?.focusKeywords?.join(", "),
    openGraph: {
      title: seo?.ogTitle || post.title,
      description: seo?.ogDescription || post.excerpt,
      url: `${siteUrl}/post/${post.slug}`,
      type: "article",
      images: [{ url: post.featuredImage, width: 1200, height: 630 }],
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || post.title,
      description: seo?.twitterDescription || post.excerpt,
      images: [post.featuredImage],
    },
    alternates: {
      canonical: `${siteUrl}/post/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, sidebarData] = await Promise.all([
    getPostBySlug(slug),
    getSidebarData(),
  ]);

  if (!post) notFound();

  const [adjacentPosts, relatedPosts] = await Promise.all([
    getAdjacentPosts(slug),
    getRelatedPosts(slug, post.category),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const postUrl = `${siteUrl}/post/${post.slug}`;

  return (
    <>
      {/* JSON-LD Structured Data */}
      {post.seo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.seo.jsonLd) }}
        />
      )}

      {/* Dark Hero with Breadcrumbs and Title */}
      <section className="bg-ontario-dark relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-6 py-16 md:py-24">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[14px] text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/category/${post.category.toLowerCase()}`}
              className="hover:text-white transition-colors"
            >
              {post.category}
            </Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{post.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-[36px] md:text-[52px] font-semibold text-white leading-tight max-w-[800px]">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-6 text-[14px] text-white/70">
            <Link href="#" className="text-ontario-accent hover:underline font-medium">
              {post.author.name}
            </Link>
            <span>&middot;</span>
            <span>{post.date}</span>
            <span>&middot;</span>
            <Link
              href={`/category/${post.category.toLowerCase()}`}
              className="px-3 py-0.5 rounded-full bg-white/10 text-white/80 text-[12px] hover:bg-white/20 transition-colors"
            >
              {post.category}
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1300px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article Content with Share Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-6">
              {/* Floating Share Bar (desktop only) */}
              <div className="hidden md:block shrink-0">
                <div className="sticky top-[100px]">
                  <span className="text-[10px] font-semibold text-ontario-meta uppercase tracking-widest mb-3 block text-center">
                    {post.readTime} Read
                  </span>
                  <ShareBar url={postUrl} title={post.title} image={post.featuredImage} vertical />
                </div>
              </div>

              {/* Article Body */}
              <div className="flex-1 min-w-0">
                {/* Mobile share bar */}
                <div className="md:hidden mb-6 flex items-center justify-between">
                  <span className="text-[12px] text-ontario-meta">{post.readTime} Read</span>
                  <ShareBar url={postUrl} title={post.title} image={post.featuredImage} />
                </div>

                {/* Table of Contents */}
                {post.seo?.tableOfContents && post.seo.tableOfContents.length > 0 && (
                  <nav className="bg-ontario-light-bg rounded-xl p-6 mb-8">
                    <h3 className="text-[14px] font-semibold text-ontario-dark uppercase tracking-wide mb-3">
                      Table of Contents
                    </h3>
                    <ul className="space-y-2">
                      {post.seo.tableOfContents.map((item) => (
                        <li
                          key={item.id}
                          className={`${item.level === 3 ? "pl-4" : ""}`}
                        >
                          <a
                            href={`#${item.id}`}
                            className="text-[14px] text-ontario-body hover:text-ontario-accent transition-colors"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}

                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="rounded-[20px] overflow-hidden mb-8">
                    <Image
                      src={post.featuredImage}
                      alt={post.seo?.altTexts?.featured || post.title}
                      width={800}
                      height={450}
                      className="w-full object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Article Content */}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      post.content ||
                      `<p>${post.excerpt}</p>
                       <h2 id="the-spark-of-an-idea">The Spark of an Idea</h2>
                       <p>It was a late-night brainstorming session between two college friends who had always been fascinated by the intersection of technology and creative expression. Together, they envisioned a future where brands could connect with audiences through authentic digital experiences.</p>
                       <p>As their vision unfolded, the challenges facing modern businesses became clear. Too often, companies relied on outdated strategies that failed to capture the attention of an increasingly digital-savvy audience.</p>
                       <ul>
                         <li>Digital agencies are staffed with professionals who specialize in areas like SEO, social media, web design, and content marketing.</li>
                         <li>By outsourcing your digital needs, you free up valuable time and resources to focus on what you do best.</li>
                         <li>Digital agencies can scale their services up or down based on your business needs, providing flexibility.</li>
                       </ul>
                       <blockquote>Welcome to ONTARIO, where creativity meets technology to transform your brand's online presence.</blockquote>
                       <p>From day one, the agency was built on a foundation of transparency, collaboration, and a commitment to delivering real results. The journey continues with every new client and every new challenge.</p>`,
                  }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-ontario-border">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tag/${tag.replace(/\s+/g, "-")}`}
                        className="text-[12px] px-3 py-1.5 rounded-full bg-ontario-light-bg border border-ontario-border text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Post Meta Bottom */}
                <div className="flex items-center gap-3 mt-6 text-[13px] text-ontario-meta">
                  <Link href="#" className="text-ontario-accent hover:underline font-medium">
                    {post.author.name}
                  </Link>
                  <span>&middot;</span>
                  <span>{post.date}</span>
                  <span>&middot;</span>
                  <Link
                    href={`/category/${post.category.toLowerCase()}`}
                    className="text-ontario-accent hover:underline"
                  >
                    {post.category}
                  </Link>
                </div>

                {/* Previous / Next Navigation */}
                <div className="flex justify-between items-center mt-10 pt-8 border-t border-ontario-border">
                  {adjacentPosts.prev ? (
                    <Link
                      href={`/post/${adjacentPosts.prev.slug}`}
                      className="group flex items-center gap-2 text-ontario-body hover:text-ontario-accent transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-ontario-meta block">
                          Previous article
                        </span>
                        <span className="text-[14px] font-medium text-ontario-dark group-hover:text-ontario-accent transition-colors line-clamp-1">
                          {adjacentPosts.prev.title}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {adjacentPosts.next ? (
                    <Link
                      href={`/post/${adjacentPosts.next.slug}`}
                      className="group flex items-center gap-2 text-right text-ontario-body hover:text-ontario-accent transition-colors"
                    >
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-ontario-meta block">
                          Next article
                        </span>
                        <span className="text-[14px] font-medium text-ontario-dark group-hover:text-ontario-accent transition-colors line-clamp-1">
                          {adjacentPosts.next.title}
                        </span>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Author Box */}
                <div className="mt-10 p-8 bg-ontario-light-bg rounded-xl">
                  <span className="text-[11px] uppercase tracking-widest text-ontario-meta font-semibold">
                    Author
                  </span>
                  <div className="flex items-start gap-5 mt-4">
                    <div className="w-[70px] h-[70px] rounded-full overflow-hidden shrink-0">
                      <Image
                        src={post.author.avatar || "/images/author.jpg"}
                        alt={post.author.name}
                        width={70}
                        height={70}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-semibold text-ontario-dark">
                        {post.author.name}
                      </h4>
                      <p className="text-[14px] text-ontario-body mt-2 leading-relaxed">
                        {post.author.bio}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {post.author.social.facebook && (
                          <a href={post.author.social.facebook} className="w-8 h-8 rounded-full border border-ontario-border flex items-center justify-center text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors" aria-label="Facebook">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                          </a>
                        )}
                        {post.author.social.twitter && (
                          <a href={post.author.social.twitter} className="w-8 h-8 rounded-full border border-ontario-border flex items-center justify-center text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors" aria-label="Twitter">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                          </a>
                        )}
                        {post.author.social.instagram && (
                          <a href={post.author.social.instagram} className="w-8 h-8 rounded-full border border-ontario-border flex items-center justify-center text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors" aria-label="Instagram">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" /></svg>
                          </a>
                        )}
                        {post.author.social.linkedin && (
                          <a href={post.author.social.linkedin} className="w-8 h-8 rounded-full border border-ontario-border flex items-center justify-center text-ontario-body hover:text-ontario-accent hover:border-ontario-accent transition-colors" aria-label="LinkedIn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disqus Comments */}
                <DisqusComments slug={post.slug} title={post.title} url={postUrl} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar data={sidebarData} />
        </div>
      </section>

      {/* Read Next Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-ontario-light-bg py-16">
          <div className="max-w-[1300px] mx-auto px-6">
            <h2 className="text-[11px] font-semibold text-ontario-dark uppercase tracking-widest mb-8">
              Read Next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <article key={related.slug} className="group">
                  <Link href={`/post/${related.slug}`} className="block rounded-[20px] overflow-hidden mb-4">
                    <Image
                      src={related.featuredImage}
                      alt={related.title}
                      width={400}
                      height={250}
                      className="object-cover w-full aspect-[3/2] group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <span className="text-[10px] bg-black/55 text-white px-2.5 py-1 rounded-[13px] inline-flex items-center gap-1 mb-3">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                    {related.readTime}
                  </span>
                  <h3>
                    <Link
                      href={`/post/${related.slug}`}
                      className="text-[18px] font-semibold text-ontario-dark leading-snug hover:text-ontario-accent transition-colors line-clamp-2"
                    >
                      {related.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 text-[13px] text-ontario-meta mt-2">
                    <span className="text-ontario-accent font-medium">{related.author.name}</span>
                    <span>&middot;</span>
                    <span>{related.date}</span>
                  </div>
                  <p className="text-[14px] text-ontario-body mt-2 line-clamp-2 leading-relaxed">
                    {related.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
