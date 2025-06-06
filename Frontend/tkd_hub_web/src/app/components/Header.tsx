"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRole } from "../context/RoleContext";
import { useRouter } from "next/navigation";
import servicesRoutes from "../routes/servicesRoutes";
import { usePathname } from "next/navigation";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { role, setRole } = useRole(); // <-- Add this line
  const { isLoggedIn, logout } = useAuth(); // <-- Make sure you have this
  const router = useRouter()

  const pathname = usePathname(); // Get the current pathname

  // Close Services dropdown when clicking outside
  useEffect(() => {
    if (!isServicesOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isServicesOpen]);

  const renderMenuItems = (isMobile = false) => (
    <>
      <Link href="/" className={`block ${isMobile ? 'px-4 py-2' : 'hover:text-gray-300'} ${pathname === '/' ? 'text-gray-300' : ''}`}>Home</Link>
      <Link href="/blog" className={`block ${isMobile ? 'px-4 py-2' : 'hover:text-gray-300'} ${pathname === '/blog' ? 'text-gray-300' : ''}`}>Blog</Link>
      <Link href="/about" className={`block ${isMobile ? 'px-4 py-2' : 'hover:text-gray-300'} ${pathname === '/about' ? 'text-gray-300' : ''}`}>About</Link>
      <Link href="/contact" className={`block ${isMobile ? 'px-4 py-2' : 'hover:text-gray-300'} ${pathname === '/contact' ? 'text-gray-300' : ''}`}>Contact</Link>
      {(role === "Coach" || role === "Admin") && (
        <div className="relative" ref={servicesRef}>
          <button
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className={`block ${isMobile ? 'w-full text-left' : 'hover:text-gray-300'} focus:outline-none`}
          >
            Services
          </button>
          {isServicesOpen && (
            <div className="absolute left-0 mt-2 min-w-[160px] bg-gray-700 rounded-md shadow-lg z-10">
              {servicesRoutes.map(route => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`block ${isMobile ? 'px-4 py-2' : 'hover:bg-gray-600 px-4 py-2'} ${pathname === route.href ? 'text-gray-300' : ''}`}
                >
                  <i className={`${route.icon} mr-2`}></i> {route.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
      {role === "Student" && (
        <Link href="/students" className={`block ${isMobile ? 'px-4 py-2' : 'hover:text-gray-300'} ${pathname === '/students' ? 'text-gray-300' : ''}`}>
          <i className="bi bi-person-lines-fill mr-2"></i> Students
        </Link>
      )}
      
    </>
  );


  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">MyLogo</Link>
          </div>

          {/* Show actual role on the right side of the header */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-300">
              Role: <span className="font-semibold">{role}</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {renderMenuItems()}
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
              aria-label={isOpen ? "Close menu" : "Open menu"}
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
          {renderMenuItems(true)}
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
