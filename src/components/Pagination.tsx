import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {pages.map((page) => (
        <Link
          key={page}
          href={page === 1 ? "/" : `/page/${page}`}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-colors ${
            page === currentPage
              ? "bg-ontario-dark text-white"
              : "text-ontario-body hover:bg-ontario-light-bg"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`/page/${currentPage + 1}`}
          className="flex items-center gap-1 text-[14px] font-medium text-ontario-body hover:text-ontario-accent transition-colors ml-2"
        >
          Next page
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
