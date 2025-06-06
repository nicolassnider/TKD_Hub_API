"use client";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900">
          About TKD Hub
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 text-center">
          TKD Hub is your one-stop platform for managing Taekwondo dojangs, students, coaches, and more. Our mission is to empower martial arts schools and communities with modern, easy-to-use digital tools.
        </p>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Manage dojangs, students, and coaches in one place</li>
            <li>Track attendance, ranks, and progress</li>
            <li>Easy communication between staff and members</li>
            <li>Secure and accessible from any device</li>
          </ul>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Vision</h2>
          <p className="text-gray-700">
            We believe in supporting martial arts communities by providing reliable, modern, and user-friendly management solutions. TKD Hub is built by martial artists, for martial artists.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="/contact"
            className="w-full sm:w-auto px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-center"
          >
            Contact Us
          </a>
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow transition text-center"
          >
            Home
          </a>
        </div>
      </div>
    </main>
  );
}
