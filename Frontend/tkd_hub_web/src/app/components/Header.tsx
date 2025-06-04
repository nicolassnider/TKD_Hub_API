"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../context/RoleContext";
import { useRouter } from "next/navigation";
import servicesRoutes from "../routes/servicesRoutes";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const { role, setRole } = useRole();
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">MyLogo</Link>
          </div>
          {/* Show actual role on the right side of the header */}
          <div className="flex items-center space-x-2">
            <span className="hidden md:inline text-sm text-gray-300">
              Role: <span className="font-semibold">{role}</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            {(role === "Coach" || role === "Admin") && (
              <div className="relative">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="hover:text-gray-300 focus:outline-none"
                >
                  Services
                </button>
                {isServicesOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                    {servicesRoutes.map(route => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className="block px-4 py-2 hover:bg-gray-600"
                      >
                        <i className={`${route.icon} mr-2`}></i> {route.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            {role === "Student" && (
              <Link href="/students" className="hover:text-gray-300">
                <i className="bi bi-person-lines-fill mr-2"></i> Students
              </Link>
            )}
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
            {/* Login/Logout Button */}
            {!isLoggedIn ? (
              <button
                onClick={() => router.push("/login")}
                className="ml-4 px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setRole("Guest"); // use lowercase "guest"
                  router.push("/");
                }}
                className="ml-4 px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-700">
          <Link href="/" className="block px-4 py-2 hover:bg-gray-600">Home</Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-600">About</Link>
          {(role === "Coach" || role === "Admin") && (
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-600"
              >
                Services
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 mt-2 w-full bg-gray-700 rounded-md shadow-lg z-10">
                  {servicesRoutes.map(route => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className="block px-4 py-2 hover:bg-gray-600"
                    >
                      <i className={`${route.icon} mr-2`}></i> {route.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {role === "Student" && (
            <Link href="/students" className="block px-4 py-2 hover:bg-gray-600">
              <i className="bi bi-person-lines-fill mr-2"></i> Students
            </Link>
          )}
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-600">Contact</Link>
          {/* Login/Logout Button */}
          {!isLoggedIn ? (
            <button
              onClick={() => router.push("/login")}
              className="w-full mt-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                setRole("Guest"); // use lowercase "guest"
                router.push("/");
              }}
              className="w-full mt-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Header;
