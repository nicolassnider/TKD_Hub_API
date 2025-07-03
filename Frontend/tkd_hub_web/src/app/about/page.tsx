"use client";

import AboutFeatures from "../components/about/AboutFeatures";
import AboutVision from "../components/about/AboutVision";
import PageLinks from "../components/common/pageLinks/PageLinks";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 px-4">
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-6 sm:p-10 bg-neutral-50 dark:bg-neutral-900">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-neutral-900 dark:text-neutral-100">
          About TKD Hub
        </h1>
        <p className="text-base sm:text-lg mb-6 text-center text-neutral-700 dark:text-neutral-300">
          TKD Hub is your one-stop platform for managing Taekwondo dojangs,
          students, coaches, and more. Our mission is to empower martial arts
          schools and communities with modern, easy-to-use digital tools.
        </p>
        <AboutFeatures />
        <AboutVision />
        <PageLinks linksToShow={["/", "/contact", "/blog"]} />
      </div>
    </main>
  );
}
