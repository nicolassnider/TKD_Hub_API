import MenuItem from "./MenuItem";
import ServicesDropdown from "./ServicesDropdown";
import AuthButtons from "./AuthButtons";

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
}: DesktopMenuProps) => (
  <div className="hidden md:flex space-x-4">
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
    <AuthButtons isLoggedIn={isLoggedIn} />
  </div>
);

export default DesktopMenu;
