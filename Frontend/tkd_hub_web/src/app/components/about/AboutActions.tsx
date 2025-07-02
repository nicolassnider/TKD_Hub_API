import Link from "next/link";
import React from "react";

const buttonClass =
  "w-full sm:w-auto px-6 py-2 rounded-lg font-semibold shadow-md transition duration-200 ease-in-out transform hover:scale-105 bg-neutral-800 text-neutral-100 border border-neutral-400 hover:bg-neutral-700 text-center";

const AboutActions: React.FC = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
    <Link href="/contact" className={buttonClass}>
      Contact Us
    </Link>
    <Link href="/" className={buttonClass}>
      Home
    </Link>
  </div>
);

export default AboutActions;
