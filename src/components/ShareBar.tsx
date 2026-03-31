"use client";

interface ShareBarProps {
  url: string;
  title: string;
  image?: string;
  vertical?: boolean;
}

const shareLinks = [
  {
    name: "Facebook",
    getUrl: (url: string) => `https://www.facebook.com/share.php?u=${encodeURIComponent(url)}`,
    icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
    color: "hover:text-[#1877F2]",
  },
  {
    name: "Twitter",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    icon: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
    color: "hover:text-[#1DA1F2]",
  },
  {
    name: "Pinterest",
    getUrl: (url: string, _: string, image?: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image || "")}`,
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.83 0-1.5-.67-1.5-1.5 0-.46.21-.87.54-1.14L9.5 8.5h5l-1.54 5.86c.33.27.54.68.54 1.14 0 .83-.67 1.5-1.5 1.5z",
    color: "hover:text-[#E60023]",
  },
  {
    name: "LinkedIn",
    getUrl: (url: string, title: string) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
    color: "hover:text-[#0A66C2]",
  },
  {
    name: "Email",
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5v2l8 5 8-5V6z",
    color: "hover:text-ontario-accent",
  },
];

export default function ShareBar({ url, title, image, vertical = false }: ShareBarProps) {
  return (
    <div
      className={`flex ${vertical ? "flex-col sticky-share" : "flex-row"} gap-2`}
    >
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.getUrl(url, title, image)}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 rounded-full border border-ontario-border flex items-center justify-center text-ontario-body ${link.color} hover:border-current transition-colors`}
          aria-label={`Share on ${link.name}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={link.icon} />
          </svg>
        </a>
      ))}
    </div>
  );
}
