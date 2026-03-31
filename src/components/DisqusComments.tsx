"use client";

import { useEffect } from "react";

interface DisqusCommentsProps {
  slug: string;
  title: string;
  url: string;
}

export default function DisqusComments({ slug, title, url }: DisqusCommentsProps) {
  useEffect(() => {
    const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
    if (!shortname) return;

    // @ts-expect-error Disqus global config
    window.disqus_config = function () {
      // @ts-expect-error Disqus this context
      this.page.url = url;
      // @ts-expect-error Disqus this context
      this.page.identifier = slug;
      // @ts-expect-error Disqus this context
      this.page.title = title;
    };

    const d = document;
    const s = d.createElement("script");
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.setAttribute("data-timestamp", String(+new Date()));
    (d.head || d.body).appendChild(s);

    return () => {
      // Cleanup
      const disqusThread = document.getElementById("disqus_thread");
      if (disqusThread) disqusThread.innerHTML = "";
    };
  }, [slug, title, url]);

  return (
    <div className="mt-12">
      <h3 className="text-[24px] font-semibold text-ontario-dark mb-6">Comments</h3>
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view the comments powered by Disqus.
      </noscript>
    </div>
  );
}
