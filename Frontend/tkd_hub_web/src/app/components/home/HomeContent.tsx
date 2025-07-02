"use client";
import Link from "next/link";

const HomeContent = () => (
  <main className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 px-4 pt-4 sm:pt-8">
    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 drop-shadow-lg text-center">
      Welcome to{" "}
      <span className="text-blue-600 dark:text-blue-400">TKD Hub</span>
    </h1>
    <h2 className="text-xl sm:text-3xl md:text-4xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4 text-center">
      The Ultimate Taekwondo Management Platform
    </h2>
    <p className="text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 max-w-2xl text-center mb-8">
      TKD Hub empowers dojangs, instructors, and students with modern tools for
      class management, student progress tracking, event scheduling,
      communication, and more. Whether you run a single school or a large
      organization, TKD Hub brings your Taekwondo community together in one
      powerful, easy-to-use platform.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none justify-center">
      <Link href="/blog/" className="flex-1">
        <div className="bg-blue-600 dark:bg-blue-500 text-white text-center rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 shadow-md">
          Go to Blog
        </div>
      </Link>
      <Link href="/contact/" className="flex-1">
        <div className="bg-blue-600 dark:bg-blue-500 text-white text-center rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 shadow-md">
          Contact Us
        </div>
      </Link>
    </div>
  </main>
);

export default HomeContent;
