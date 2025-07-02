"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import MobileMenuButton from "./MobileMenuButton";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useRoles } from "@/app/context/RoleContext";

import DesktopMenu from "./DesktopMenu";
import RoleDisplay from "./RoleDisplay";

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
    <nav className="bg-neutral-900 dark:bg-neutral-950 text-neutral-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="hidden md:flex items-center space-x-2">
            <RoleDisplay role={role} />
          </div>
          <DesktopMenu
            menuItems={menuItems}
            pathname={pathname}
            isServicesOpen={isServicesOpen}
            setIsServicesOpen={setIsServicesOpen}
            isLoggedIn={isLoggedIn}
            role={role}
          />
          <div className="md:hidden">
            <MobileMenuButton
              isOpen={isOpen}
              toggle={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
        <MobileMenu
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </nav>
  );
};

export default Header;
