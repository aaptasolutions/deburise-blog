export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: Author;
  date: string;
  readTime: string;
  googleDocId: string;
  seo?: SEOData;
}

export interface Author {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  jsonLd: object;
  altTexts: Record<string, string>;
  tableOfContents: TOCItem[];
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  color: string;
}

export interface SidebarData {
  author: Author;
  featuredPosts: Post[];
  categories: Category[];
  recentPosts: Post[];
  popularTags: { name: string; slug: string; count: number }[];
}
