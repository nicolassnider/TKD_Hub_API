import React from "react";

const APP_VERSION = "0.1.0701.1703";

const Footer: React.FC = () => (
  <footer className="w-full py-4 bg-gray-100 border-t mt-auto">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 text-sm text-gray-600">
      <span>&copy; {new Date().getFullYear()} TKD Hub</span>
      <span>Version {APP_VERSION}</span>
    </div>
  </footer>
);

export default Footer;
