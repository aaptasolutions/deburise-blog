import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto px-6 py-24 text-center">
      <h1 className="text-[72px] font-bold text-ontario-dark mb-4">404</h1>
      <h2 className="text-[24px] font-semibold text-ontario-dark mb-4">
        Page Not Found
      </h2>
      <p className="text-ontario-body mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 bg-ontario-accent text-white rounded-full text-sm font-semibold hover:bg-ontario-accent-hover transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}