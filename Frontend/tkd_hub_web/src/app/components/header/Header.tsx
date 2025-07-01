"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import MenuItem from "./MenuItem";
import ServicesDropdown from "./ServicesDropdown";
import AuthButtons from "./AuthButtons";
import MobileMenuButton from "./MobileMenuButton";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useRoles } from "@/app/context/RoleContext";


export const Header = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const { role } = useRoles();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);


  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];


  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-300">
              Role:{" "}
              <span className="font-semibold">
                {role.length > 0 ? role.join(", ") : "Guest"}
              </span>
            </span>
          </div>
          <div className="hidden md:flex space-x-4">
            <>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.href}
                  href={item.href}
                  isActive={pathname === item.href}
                >
                  {item.label}
                </MenuItem>
              ))}
            </>
            {(role.includes("Coach") || role.includes("Admin")) && (
              <ServicesDropdown
                isOpen={isServicesOpen}
                toggle={() => setIsServicesOpen(!isServicesOpen)}
              />
            )}
            <AuthButtons isLoggedIn={isLoggedIn} />
          </div>
          <MobileMenuButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
        </div>
      </div>
      <MobileMenu
        isOpen={isOpen}
        toggle={() => setIsOpen(!isOpen)}
        isLoggedIn={isLoggedIn}
      />
    </nav>
  );
};


export default Header;