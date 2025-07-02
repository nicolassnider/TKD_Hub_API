import Link from "next/link";
import React from "react";

const AboutActions: React.FC = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
    <a
      href="/contact"
      className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-105"
    >
      Contact Us
    </a>
    <Link
      href="/"
      className="w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-105"
    >
      Home
    </Link>
  </div>
);

export default AboutActions;
