import Link from "next/link";
import { links } from "./links";

const PageLinks = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="w-full sm:w-auto px-6 py-2 rounded bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold shadow transition text-center"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default PageLinks;
