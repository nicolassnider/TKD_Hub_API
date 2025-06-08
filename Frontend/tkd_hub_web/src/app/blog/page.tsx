"use client";
import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900">
          TKD Hub Blog
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 text-center">
          Welcome to the TKD Hub Blog! Here you&apos;ll find news, tips, and stories from the world of Taekwondo and martial arts management.
        </p>
        <div className="space-y-8">
          {/* Example blog post preview */}
          <article className="border-b pb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">How to Motivate Your Students</h2>
            <p className="text-gray-700 mb-2">
              Discover proven strategies to keep your dojang students engaged and motivated throughout their martial arts journey.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:underline font-medium"
            >
              Read more &rarr;
            </a>
          </article>
          <article className="border-b pb-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Digital Tools for Dojang Management</h2>
            <p className="text-gray-700 mb-2">
              Explore the benefits of using digital platforms like TKD Hub to streamline your school&rsquo;s operations.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:underline font-medium"
            >
              Read more &rarr;
            </a>
          </article>
          {/* Add more blog post previews as needed */}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow transition text-center"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto px-6 py-2 rounded bg-green-700 hover:bg-green-800 text-white font-semibold shadow transition text-center"
          >
            About
          </Link>
          <a
            href="/contact"
            className="w-full sm:w-auto px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
