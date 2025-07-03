import { useRouter } from "next/navigation";
import { links } from "./links";
import GenericButton from "../actionButtons/GenericButton";
import { DaisyUIButtonVariant } from "@/app/types/DaisyUIButtonVariant";

interface PageLinksProps {
  linksToShow: string[];
  className?: string;
}

const PageLinks = ({ linksToShow, className = "" }: PageLinksProps) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 ${className}`}
    >
      {links
        .filter((link) => linksToShow.includes(link.href))
        .map((link) => (
          <GenericButton
            key={link.href}
            variant={link.variant as DaisyUIButtonVariant}
            className={link.className}
            onClick={() => router.push(link.href)}
          >
            {link.label}
          </GenericButton>
        ))}
    </div>
  );
};

export default PageLinks;
