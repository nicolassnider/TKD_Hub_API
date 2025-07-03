import { useRouter } from "next/navigation";
import MenuItem from "./MenuItem";
import ServicesDropdown from "./ServicesDropdown";
import AuthButtons from "./AuthButtons";
import GenericButton from "../common/actionButtons/GenericButton";
import React from "react";

type MenuItemType = {
  href: string;
  label: string;
};

type DesktopMenuProps = {
  menuItems: MenuItemType[];
  pathname: string;
  isServicesOpen: boolean;
  setIsServicesOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  role: string[];
};

const DesktopMenu = ({
  menuItems,
  pathname,
  isServicesOpen,
  setIsServicesOpen,
  isLoggedIn,
  role,
}: DesktopMenuProps) => {
  const router = useRouter();

  return (
    <div className="hidden md:flex gap-4 items-center">
      {menuItems.map((item) => (
        <MenuItem
          key={item.href}
          href={item.href}
          isActive={pathname === item.href}
        >
          {item.label}
        </MenuItem>
      ))}
      {(role.includes("Coach") || role.includes("Admin")) && (
        <ServicesDropdown
          isOpen={isServicesOpen}
          toggle={() => setIsServicesOpen(!isServicesOpen)}
        />
      )}
      {isLoggedIn && (
        <GenericButton
          type="button"
          variant="success"
          onClick={() => router.push("/profile")}
          className="w-auto flex items-center gap-2"
        >
          <i className="bi bi-person-circle text-lg" aria-hidden="true"></i>
          <span>Profile</span>
        </GenericButton>
      )}
      <AuthButtons
        isLoggedIn={isLoggedIn}
        className="w-auto flex items-center gap-2"
      />
    </div>
  );
};

export default DesktopMenu;
