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
        ? "px-4 py-2 rounded transition-colors duration-200 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        : "transition duration-200 text-neutral-800 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-50"
    } ${isActive ? "font-bold underline" : ""}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default MenuItem;
