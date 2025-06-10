"use client";
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
        <a
          href="/blog"
          className="w-full sm:w-auto px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center"
        >
          Blog
        </a>
        <a
          href="/contact"
          className="w-full sm:w-auto px-6 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow transition text-center"
        >
          Contact Us
        </a>
      </div>
    </main>
  );
}
