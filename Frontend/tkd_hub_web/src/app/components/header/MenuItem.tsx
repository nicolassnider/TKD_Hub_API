import Link from "next/link";

type MenuItemProps = {
  href: string;
  isActive: boolean;
  isMobile?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = ({
  href,
  isActive,
  isMobile,
  children,
  onClick,
}) => (
  <Link
    href={href}
    className={`block ${
      isMobile
        ? "px-4 py-2 hover:bg-purple-700 hover:text-white rounded transition-colors duration-200"
        : "hover:text-gray-300 transition duration-300 ease-in-out"
    } ${isActive ? "text-gray-300 font-bold" : ""}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default MenuItem;
