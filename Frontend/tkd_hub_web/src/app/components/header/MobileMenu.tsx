import { useRouter } from "next/navigation";
import MenuItem from "./MenuItem";
import AuthButtons from "./AuthButtons";
import ServicesDropdown from "./ServicesDropdown";
import { useRoles } from "@/app/context/RoleContext";
import React from "react";
import GenericButton from "../common/actionButtons/GenericButton";

const MobileMenu: React.FC<{
  isOpen: boolean;
  toggle: () => void;
  isLoggedIn: boolean;
}> = ({ isOpen, toggle, isLoggedIn }) => {
  const router = useRouter();
  const { role } = useRoles();
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);

  return (
    isOpen && (
      <div className="md:hidden bg-gray-700 transition duration-300">
        <div className="flex flex-col gap-2 mt-2 px-4">
          <MenuItem href="/" isActive={false} isMobile onClick={toggle}>
            Home
          </MenuItem>
          <MenuItem href="/blog" isActive={false} isMobile onClick={toggle}>
            Blog
          </MenuItem>
          <MenuItem href="/about" isActive={false} isMobile onClick={toggle}>
            About
          </MenuItem>
          <MenuItem href="/contact" isActive={false} isMobile onClick={toggle}>
            Contact
          </MenuItem>
          {(role.includes("Coach") || role.includes("Admin")) && (
            <ServicesDropdown
              isOpen={isServicesOpen}
              toggle={() => setIsServicesOpen((open) => !open)}
            />
          )}
          {isLoggedIn && (
            <GenericButton
              type="button"
              variant="success"
              onClick={() => {
                router.push("/profile");
                toggle();
              }}
            >
              <i className="bi bi-person-circle"></i>
              Profile
            </GenericButton>
          )}
          <AuthButtons isLoggedIn={isLoggedIn} />
        </div>
      </div>
    )
  );
};

export default MobileMenu;
