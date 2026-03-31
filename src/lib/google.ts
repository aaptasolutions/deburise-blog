import { google } from "googleapis";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
    ],
  });
}

export interface SheetRow {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  authorFacebook: string;
  authorTwitter: string;
  authorInstagram: string;
  authorLinkedin: string;
  date: string;
  googleDocId: string;
  status: string;
}

export async function getPostsFromSheet(): Promise<SheetRow[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Posts!A2:Q",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  return rows
    .map((row) => ({
      title: row[0] || "",
      slug: row[1] || "",
      excerpt: row[2] || "",
      featuredImage: row[3] || "",
      category: row[4] || "",
      tags: row[5] || "",
      authorName: row[6] || "",
      authorRole: row[7] || "",
      authorBio: row[8] || "",
      authorAvatar: row[9] || "",
      authorFacebook: row[10] || "",
      authorTwitter: row[11] || "",
      authorInstagram: row[12] || "",
      authorLinkedin: row[13] || "",
      date: row[14] || "",
      googleDocId: row[15] || "",
      status: row[16] || "draft",
    }))
    .filter((row) => row.status.toLowerCase() === "published");
}

export async function getDocContent(docId: string): Promise<string> {
  const auth = getAuth();
  const docs = google.docs({ version: "v1", auth });

  const doc = await docs.documents.get({ documentId: docId });
  const content = doc.data.body?.content || [];

  let html = "";

  for (const element of content) {
    if (element.paragraph) {
      const paragraph = element.paragraph;
      const namedStyle = paragraph.paragraphStyle?.namedStyleType;

      let tag = "p";
      if (namedStyle === "HEADING_1") tag = "h1";
      else if (namedStyle === "HEADING_2") tag = "h2";
      else if (namedStyle === "HEADING_3") tag = "h3";
      else if (namedStyle === "HEADING_4") tag = "h4";

      // Check if it's a list item
      const bullet = paragraph.bullet;
      const isListItem = !!bullet;

      let textContent = "";

      for (const el of paragraph.elements || []) {
        if (el.textRun) {
          let text = el.textRun.content || "";
          const style = el.textRun.textStyle;

          // Handle inline images
          if (el.inlineObjectElement) {
            continue;
          }

          if (style?.bold) text = `<strong>${text}</strong>`;
          if (style?.italic) text = `<em>${text}</em>`;
          if (style?.underline && !style?.link)
            text = `<u>${text}</u>`;
          if (style?.link?.url)
            text = `<a href="${style.link.url}" target="_blank" rel="noopener noreferrer">${text}</a>`;

          textContent += text;
        }

        if (el.inlineObjectElement) {
          const objId = el.inlineObjectElement.inlineObjectId;
          const inlineObjects = doc.data.inlineObjects;
          if (objId && inlineObjects?.[objId]) {
            const obj = inlineObjects[objId];
            const imageUri =
              obj.inlineObjectProperties?.embeddedObject?.imageProperties
                ?.contentUri;
            if (imageUri) {
              textContent += `<img src="${imageUri}" alt="post content image" loading="lazy" />`;
            }
          }
        }
      }

      // Skip empty paragraphs
      if (!textContent.trim()) continue;

      if (isListItem) {
        html += `<li>${textContent}</li>\n`;
      } else if (tag === "p" && textContent.startsWith(">")) {
        // Blockquote convention: lines starting with >
        html += `<blockquote>${textContent.substring(1).trim()}</blockquote>\n`;
      } else {
        const id =
          tag.startsWith("h")
            ? ` id="${textContent
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}"`
            : "";
        html += `<${tag}${id}>${textContent}</${tag}>\n`;
      }
    }

    if (element.table) {
      html += "<table>\n";
      for (const row of element.table.tableRows || []) {
        html += "<tr>\n";
        for (const cell of row.tableCells || []) {
          let cellText = "";
          for (const cellContent of cell.content || []) {
            for (const el of cellContent.paragraph?.elements || []) {
              cellText += el.textRun?.content || "";
            }
          }
          html += `<td>${cellText.trim()}</td>\n`;
        }
        html += "</tr>\n";
      }
      html += "</table>\n";
    }
  }

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /(<li>[\s\S]*?<\/li>\n)+/g,
    (match) => `<ul>\n${match}</ul>\n`
  );

  return html;
}

export async function getSiteConfig(): Promise<{
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutAuthor: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
    social: { facebook: string; twitter: string; instagram: string; linkedin: string };
  };
  categories: { name: string; slug: string; color: string }[];
}> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Config!A2:B20",
    });

    const rows = response.data.values || [];
    const config: Record<string, string> = {};
    for (const [key, value] of rows) {
      config[key] = value;
    }

    return {
      siteName: config["siteName"] || process.env.NEXT_PUBLIC_SITE_NAME || "Ontario Blog",
      siteDescription: config["siteDescription"] || "Deep Insights: Tales of Technology, Business and Success.",
      heroTitle: config["heroTitle"] || "Deep Insights: Tales of Technology, Business and Success.",
      heroSubtitle: config["heroSubtitle"] || "Welcome to our blog! A space for insights, stories, and practical ideas.",
      aboutAuthor: {
        name: config["authorName"] || "Kate Johnson",
        role: config["authorRole"] || "Digital Artist",
        bio: config["authorBio"] || "I'm a digital blogger exploring the intersection of technology, creativity, and culture.",
        avatar: config["authorAvatar"] || "/images/author.jpg",
        social: {
          facebook: config["authorFacebook"] || "#",
          twitter: config["authorTwitter"] || "#",
          instagram: config["authorInstagram"] || "#",
          linkedin: config["authorLinkedin"] || "#",
        },
      },
      categories: [
        { name: "AI", slug: "ai", color: "ai" },
        { name: "Business", slug: "business", color: "business" },
        { name: "Crypto", slug: "crypto", color: "crypto" },
        { name: "Digital", slug: "digital", color: "digital" },
        { name: "News", slug: "news", color: "news" },
        { name: "Recent", slug: "recent", color: "recent" },
        { name: "Startups", slug: "startups", color: "startups" },
        { name: "Technology", slug: "technology", color: "technology" },
        { name: "Trends", slug: "trends", color: "trends" },
      ],
    };
  } catch {
    // Return defaults if Config sheet doesn't exist
    return {
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Ontario Blog",
      siteDescription: "Deep Insights: Tales of Technology, Business and Success.",
      heroTitle: "Deep Insights: Tales of Technology, Business and Success.",
      heroSubtitle: "Welcome to our blog! A space for insights, stories, and practical ideas.",
      aboutAuthor: {
        name: "Kate Johnson",
        role: "Digital Artist",
        bio: "I'm a digital blogger exploring the intersection of technology, creativity, and culture.",
        avatar: "/images/author.jpg",
        social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
      },
      categories: [
        { name: "AI", slug: "ai", color: "ai" },
        { name: "Business", slug: "business", color: "business" },
        { name: "Crypto", slug: "crypto", color: "crypto" },
        { name: "Digital", slug: "digital", color: "digital" },
        { name: "News", slug: "news", color: "news" },
        { name: "Recent", slug: "recent", color: "recent" },
        { name: "Startups", slug: "startups", color: "startups" },
        { name: "Technology", slug: "technology", color: "technology" },
        { name: "Trends", slug: "trends", color: "trends" },
      ],
    };
  }
}
