import Link from "next/link";

const Logo = () => (
  <div className="flex-shrink-0">
    <Link
      href="/"
      className="text-xl font-bold transition duration-300 hover:text-purple-400"
    >
      MyLogo
    </Link>
  </div>
);

export default Logo;
