"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-100 to-blue-100 px-4 pt-4 sm:pt-8">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 drop-shadow">
        Welcome to <span className="text-blue-600">TKD Hub</span>
      </h1>
      <p className="text-base sm:text-lg text-gray-700 max-w-xl text-center mb-8">
        Your one-stop platform for managing Taekwondo dojangs, students, coaches, and more.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link href="/blog/">Go to Blog</Link>
        <Link href="/contact/">Go to Blog</Link>
      </div>
    </main>
  );
}
