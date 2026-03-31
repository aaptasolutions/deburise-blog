import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SEOInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
  excerpt: string;
  featuredImage: string;
  siteUrl: string;
  slug: string;
}

export interface GeneratedSEO {
  metaTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  lsiKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  altTexts: Record<string, string>;
  tableOfContents: { id: string; text: string; level: number }[];
  jsonLd: object;
  internalLinkSuggestions: string[];
}

export async function generateSEO(input: SEOInput): Promise<GeneratedSEO> {
  const { title, content, category, tags, excerpt, featuredImage, siteUrl, slug } = input;

  // Strip HTML tags for Claude processing
  const plainContent = content.replace(/<[^>]*>/g, "").substring(0, 3000);

  const prompt = `You are an expert SEO specialist. Analyze this blog post and generate comprehensive SEO metadata. Return ONLY valid JSON with no markdown formatting or code blocks.

Title: ${title}
Category: ${category}
Tags: ${tags.join(", ")}
Excerpt: ${excerpt}
Content (first 3000 chars): ${plainContent}

Generate this exact JSON structure:
{
  "metaTitle": "SEO-optimized title under 60 chars with primary keyword near the start",
  "metaDescription": "Compelling meta description under 155 chars with a call to action",
  "focusKeywords": ["3-5 focus keywords"],
  "lsiKeywords": ["5-8 LSI/related keywords"],
  "ogTitle": "Open Graph title, can be slightly longer and more descriptive",
  "ogDescription": "OG description under 200 chars, engaging for social sharing",
  "twitterTitle": "Twitter-optimized title",
  "twitterDescription": "Twitter description under 200 chars",
  "altTexts": {"featured": "Descriptive alt text for featured image based on title and content"},
  "internalLinkSuggestions": ["3-5 suggested related topic slugs for internal linking"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Clean response - remove any markdown code blocks if present
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const seoData = JSON.parse(cleanedText);

    // Extract table of contents from HTML content
    const tocRegex = /<h([2-3])\s+id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/g;
    const tableOfContents: { id: string; text: string; level: number }[] = [];
    let match;
    while ((match = tocRegex.exec(content)) !== null) {
      tableOfContents.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3].replace(/<[^>]*>/g, ""),
      });
    }

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: seoData.metaTitle || title,
      description: seoData.metaDescription || excerpt,
      image: featuredImage,
      author: {
        "@type": "Person",
        name: "Author",
      },
      publisher: {
        "@type": "Organization",
        name: process.env.NEXT_PUBLIC_SITE_NAME || "Ontario Blog",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/logo.png`,
        },
      },
      url: `${siteUrl}/post/${slug}`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/post/${slug}`,
      },
      keywords: [...(seoData.focusKeywords || []), ...(seoData.lsiKeywords || [])].join(", "),
    };

    return {
      ...seoData,
      tableOfContents,
      jsonLd,
    };
  } catch (error) {
    console.error("SEO generation failed:", error);
    // Return basic fallback SEO
    return {
      metaTitle: title.substring(0, 60),
      metaDescription: excerpt.substring(0, 155),
      focusKeywords: tags.slice(0, 5),
      lsiKeywords: [],
      ogTitle: title,
      ogDescription: excerpt.substring(0, 200),
      twitterTitle: title,
      twitterDescription: excerpt.substring(0, 200),
      altTexts: { featured: `Featured image for ${title}` },
      tableOfContents: [],
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: excerpt,
        image: featuredImage,
        url: `${siteUrl}/post/${slug}`,
      },
      internalLinkSuggestions: [],
    };
  }
}
