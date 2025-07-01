import Link from "next/link";
import { links } from "./links";

const PageLinks = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
    {links.map((link) => (
      <Link key={link.href} href={link.href} className={link.className}>
        {link.label}
      </Link>
    ))}
  </div>
);

export default PageLinks;
