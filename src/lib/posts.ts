import { Post, Author, Category, SidebarData } from "@/types";
import { getPostsFromSheet, getDocContent, getSiteConfig, SheetRow } from "./google";
import { generateSEO } from "./seo";

const POSTS_PER_PAGE = 8;

function sheetRowToPost(row: SheetRow, content: string = ""): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content,
    featuredImage: row.featuredImage,
    category: row.category,
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
    author: {
      name: row.authorName,
      role: row.authorRole,
      bio: row.authorBio,
      avatar: row.authorAvatar,
      social: {
        facebook: row.authorFacebook || undefined,
        twitter: row.authorTwitter || undefined,
        instagram: row.authorInstagram || undefined,
        linkedin: row.authorLinkedin || undefined,
      },
    },
    date: row.date,
    readTime: calculateReadTime(content || row.excerpt),
    googleDocId: row.googleDocId,
  };
}

function calculateReadTime(text: string): string {
  const plainText = text.replace(/<[^>]*>/g, "");
  const words = plainText.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} Min`;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const rows = await getPostsFromSheet();
    return rows.map((row) => sheetRowToPost(row));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return getDemoPosts();
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const rows = await getPostsFromSheet();
    const row = rows.find((r) => r.slug === slug);
    if (!row) return null;

    const content = await getDocContent(row.googleDocId);
    const post = sheetRowToPost(row, content);

    // Generate SEO data with Claude
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
    const seo = await generateSEO({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      siteUrl,
      slug: post.slug,
    });

    post.seo = {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      focusKeywords: seo.focusKeywords,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: post.featuredImage,
      twitterTitle: seo.twitterTitle,
      twitterDescription: seo.twitterDescription,
      jsonLd: seo.jsonLd,
      altTexts: seo.altTexts,
      tableOfContents: seo.tableOfContents,
    };

    return post;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

export async function getPaginatedPosts(
  page: number
): Promise<{ posts: Post[]; totalPages: number }> {
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);
  return { posts, totalPages };
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(
    (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
  );
}

export async function getSidebarData(): Promise<SidebarData> {
  try {
    const config = await getSiteConfig();
    const posts = await getAllPosts();

    const categoryCount: Record<string, number> = {};
    for (const post of posts) {
      const cat = post.category.toLowerCase();
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    }

    const categories: Category[] = config.categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: categoryCount[c.slug] || 0,
      color: c.color,
    }));

    const tagCount: Record<string, number> = {};
    for (const post of posts) {
      for (const tag of post.tags) {
        const t = tag.toLowerCase().trim();
        if (t) tagCount[t] = (tagCount[t] || 0) + 1;
      }
    }

    const popularTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({
        name,
        slug: name.replace(/\s+/g, "-"),
        count,
      }));

    return {
      author: config.aboutAuthor as Author,
      featuredPosts: posts.slice(0, 5),
      categories,
      recentPosts: posts.slice(0, 3),
      popularTags,
    };
  } catch {
    return getDefaultSidebarData();
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string
): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.category.toLowerCase() === category.toLowerCase())
    .slice(0, 3);
}

export async function getAdjacentPosts(
  currentSlug: string
): Promise<{ prev: Post | null; next: Post | null }> {
  const allPosts = await getAllPosts();
  const index = allPosts.findIndex((p) => p.slug === currentSlug);
  return {
    prev: index > 0 ? allPosts[index - 1] : null,
    next: index < allPosts.length - 1 ? allPosts[index + 1] : null,
  };
}

// Demo posts for when Google APIs aren't configured
function getDemoPosts(): Post[] {
  const demoAuthor: Author = {
    name: "Steve Jones",
    role: "Digital Writer",
    bio: "A creative at heart, exploring the intersection of technology and culture.",
    avatar: "/images/author.jpg",
    social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
  };

  return [
    {
      slug: "commanding-unknown-terrain-lessons-from-bold-pioneers",
      title: "Commanding Unknown Terrain: the Lessons from Bold Pioneers",
      excerpt: "The spark that ignited our agency was born in the midst of a thriving city. Out of one idea came a story of growth, challenges, and digital transformation...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
      category: "Recent",
      tags: ["business growth", "digital marketing", "future of work"],
      author: demoAuthor,
      date: "Mar 26, 2026",
      readTime: "3 Min",
      googleDocId: "",
    },
    {
      slug: "what-digital-signals-tell-us-about-market-behavior",
      title: "What Digital Signals Tell Us About Market Behavior",
      excerpt: "The story of our agency began where the city never sleeps. With nothing more than a simple idea, we set out to transform brands...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      category: "Recent",
      tags: ["artificial intelligence", "machine learning", "global trends"],
      author: demoAuthor,
      date: "Mar 26, 2026",
      readTime: "2 Min",
      googleDocId: "",
    },
    {
      slug: "urban-mindfulness-finding-peace-above-noise",
      title: "Urban Mindfulness: Finding Peace Above Noise",
      excerpt: "Our agency's journey began in the core of a lively city, where energy and ambition collide. From that foundation grew something remarkable...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
      category: "Recent",
      tags: ["technology", "future of work", "cloud computing"],
      author: demoAuthor,
      date: "Mar 26, 2026",
      readTime: "4 Min",
      googleDocId: "",
    },
    {
      slug: "how-bold-aesthetics-redefine-product-identity",
      title: "How Bold Aesthetics Redefine Product Identity",
      excerpt: "Amid the fast rhythm of an ever-growing metropolis, the seed of our agency was planted. From one clear vision came a brand revolution...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
      category: "Recent",
      tags: ["digital marketing", "business growth", "web3"],
      author: demoAuthor,
      date: "Mar 26, 2026",
      readTime: "3 Min",
      googleDocId: "",
    },
    {
      slug: "mind-circuits-engineering-the-future-self",
      title: "Mind Circuits: Engineering the Future Self",
      excerpt: "In a city brimming with life and opportunity, our journey as a digital agency took its first steps toward something bigger...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "Recent",
      tags: ["artificial intelligence", "machine learning", "technology"],
      author: demoAuthor,
      date: "Mar 26, 2026",
      readTime: "4 Min",
      googleDocId: "",
    },
    {
      slug: "building-smarter-systems-how-ai-reshapes-business-operations",
      title: "Building Smarter Systems: How AI Reshapes Business Operations",
      excerpt: "Deep within a vibrant city alive with energy, our digital agency was born. What began as a simple idea evolved into a force for change...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      category: "Recent",
      tags: ["artificial intelligence", "business growth", "venture capital"],
      author: demoAuthor,
      date: "Mar 26, 2026",
      readTime: "3 Min",
      googleDocId: "",
    },
    {
      slug: "why-most-marketing-budgets-fail-to-move-revenue",
      title: "Why Most Marketing Budgets Fail to Move Revenue",
      excerpt: "In a city where ambition meets innovation, our agency's story found its beginning. With one small idea, we started a journey...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      category: "News",
      tags: ["digital marketing", "breaking news", "business growth"],
      author: demoAuthor,
      date: "Mar 25, 2026",
      readTime: "2 Min",
      googleDocId: "",
    },
    {
      slug: "the-impact-of-strategic-marketing-on-business-transformation",
      title: "The Impact of Strategic Marketing on Business Transformation",
      excerpt: "In a city where ambition meets innovation, our agency's story found its beginning. With one small idea, we started a journey...",
      content: "",
      featuredImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800",
      category: "News",
      tags: ["digital marketing", "global trends", "breaking news"],
      author: demoAuthor,
      date: "Mar 25, 2026",
      readTime: "2 Min",
      googleDocId: "",
    },
  ];
}

function getDefaultSidebarData(): SidebarData {
  const posts = getDemoPosts();
  return {
    author: {
      name: "Kate Johnson",
      role: "Digital Artist",
      bio: "I'm a digital blogger exploring the intersection of technology, creativity, and culture.",
      avatar: "/images/author.jpg",
      social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
    },
    featuredPosts: posts.slice(0, 5),
    categories: [
      { name: "AI", slug: "ai", count: 10, color: "ai" },
      { name: "Business", slug: "business", count: 8, color: "business" },
      { name: "Crypto", slug: "crypto", count: 6, color: "crypto" },
      { name: "Digital", slug: "digital", count: 7, color: "digital" },
      { name: "News", slug: "news", count: 6, color: "news" },
      { name: "Recent", slug: "recent", count: 5, color: "recent" },
      { name: "Startups", slug: "startups", count: 4, color: "startups" },
      { name: "Technology", slug: "technology", count: 9, color: "technology" },
      { name: "Trends", slug: "trends", count: 7, color: "trends" },
    ],
    recentPosts: posts.slice(0, 3),
    popularTags: [
      { name: "artificial intelligence", slug: "artificial-intelligence", count: 10 },
      { name: "web3", slug: "web3", count: 11 },
      { name: "machine learning", slug: "machine-learning", count: 9 },
      { name: "global trends", slug: "global-trends", count: 8 },
      { name: "future of work", slug: "future-of-work", count: 7 },
      { name: "digital marketing", slug: "digital-marketing", count: 6 },
      { name: "breaking news", slug: "breaking-news", count: 6 },
      { name: "technology", slug: "technology", count: 6 },
      { name: "business growth", slug: "business-growth", count: 5 },
      { name: "cloud computing", slug: "cloud-computing", count: 4 },
      { name: "venture capital", slug: "venture-capital", count: 4 },
    ],
  };
}
