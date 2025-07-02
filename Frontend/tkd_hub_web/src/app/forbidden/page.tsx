import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-neutral-100">
      <h1 className="text-4xl font-bold mb-4 text-neutral-100">
        403 - Forbidden
      </h1>
      <p className="mb-6 text-neutral-300">
        You do not have permission to access this page.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors text-neutral-100 border border-neutral-700"
      >
        Go Home
      </Link>
    </div>
  );
}
