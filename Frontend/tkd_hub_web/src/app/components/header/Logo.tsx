import Link from "next/link";

const Logo = () => (
  <div className="flex-shrink-0">
    <Link
      href="/"
      className="text-xl font-bold transition-colors duration-300 text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300"
    >
      MyLogo
    </Link>
  </div>
);

export default Logo;
