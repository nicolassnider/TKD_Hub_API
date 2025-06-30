"use client";

import AboutActions from "../components/about/AboutActions";
import AboutFeatures from "../components/about/AboutFeatures";
import AboutVision from "../components/about/AboutVision";



export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900">
          About TKD Hub
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 text-center">
          TKD Hub is your one-stop platform for managing Taekwondo dojangs,
          students, coaches, and more. Our mission is to empower martial arts
          schools and communities with modern, easy-to-use digital tools.
        </p>
        <AboutFeatures />
        <AboutVision />
        <AboutActions />
      </div>
    </main>
  );
}
