import Link from "next/link";
import Image from "next/image";

const categories = [
  "Digital", "Business", "Startups", "Trends", "Crypto", "News",
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { name: "Twitter", href: "#", icon: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
  { name: "Instagram", href: "#", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" },
  { name: "LinkedIn", href: "#", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" },
  { name: "YouTube", href: "#", icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" },
];

export default function Footer() {
  return (
    <footer className="bg-ontario-light-bg dark:bg-[#12121e]">
      {/* Newsletter Section */}
      <div className="max-w-[680px] mx-auto px-6 py-16 text-center">
        <h2 className="text-[32px] font-semibold text-ontario-dark dark:text-gray-100 mb-3">
          Subscribe to our Newsletter
        </h2>
        <p className="text-ontario-body dark:text-gray-300 mb-8">
          We&apos;ll send you a nice letter once per week. No spam.
        </p>
        <form className="flex gap-3 max-w-[480px] mx-auto">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="flex-1 px-5 py-3 rounded-full border border-ontario-border dark:border-[#2a2a3e] bg-white dark:bg-[#1a1a2e] dark:text-gray-200 text-sm focus:outline-none focus:border-ontario-accent"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-ontario-accent text-white rounded-full text-sm font-semibold hover:bg-ontario-accent-hover transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Main Footer */}
      <div className="border-t border-ontario-border dark:border-[#2a2a3e]">
        <div className="max-w-[1300px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="https://cloud-1de12d.becdn.net/media/original/a86bec0ae21006b47523d1bf99292221/deburise-1-.png"
                alt="Deburise"
                width={160}
                height={40}
                className="h-[36px] w-auto dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="mt-4 text-[15px] text-ontario-body dark:text-gray-300 leading-relaxed">
              Welcome to the Deburise Blog – your space for fresh ideas, insightful stories, and practical knowledge.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#1a1a2e] border border-ontario-border dark:border-[#2a2a3e] flex items-center justify-center text-ontario-body dark:text-gray-300 hover:text-ontario-accent hover:border-ontario-accent transition-colors"
                  aria-label={social.name}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[11px] font-semibold text-ontario-dark dark:text-gray-100 uppercase tracking-widest mb-5">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="text-[15px] text-ontario-body dark:text-gray-300 hover:text-ontario-accent transition-colors py-1"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[11px] font-semibold text-ontario-dark dark:text-gray-100 uppercase tracking-widest mb-5">
              How to Find Us
            </h3>
            <div className="space-y-3 text-[15px] text-ontario-body dark:text-gray-300">
              <p>27 Division St, New York, NY 10002, United States</p>
              <a href="mailto:hello@mysite.com" className="block dark:text-gray-300 hover:text-ontario-accent">
                hello@mysite.com
              </a>
              <a href="tel:88002345234" className="block dark:text-gray-300 hover:text-ontario-accent">
                8 800 2345 234
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-ontario-border dark:border-[#2a2a3e]">
        <div className="max-w-[1300px] mx-auto px-6 py-5 text-center text-[13px] text-ontario-meta dark:text-gray-400">
          &copy; {new Date().getFullYear()} &mdash; Deburise. All Rights Reserved.
        </div>
      </div>

      {/* Back to top */}
      <BackToTop />
    </footer>
  );
}

function BackToTop() {
  return (
    <a
      href="#"
      className="fixed bottom-6 right-6 w-10 h-10 bg-ontario-dark text-white rounded-full flex items-center justify-center shadow-lg hover:bg-ontario-accent transition-colors z-40"
      aria-label="Back to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </a>
  );
}
