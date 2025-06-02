"use client";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
        Welcome to <span className="text-blue-400">TKD Hub</span>
      </h1>
      <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
        Your one-stop platform for managing Taekwondo dojangs, students, coaches, and more.
      </p>
      <div className="flex gap-4">
        <a
          href="/about"
          className="px-6 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition"
        >
          Blog
        </a>
        <a
          href="/contact"
          className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow transition"
        >
          Contact Us
        </a>
      </div>
    </main>
  );
}
