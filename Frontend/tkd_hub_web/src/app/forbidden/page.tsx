import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="mb-6">You do not have permission to access this page.</p>
      <Link href="/" className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors">
        Go Home
      </Link>
    </div>
  );
}
