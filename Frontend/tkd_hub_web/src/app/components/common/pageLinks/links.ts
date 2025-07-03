import { DaisyUIButtonVariant } from "@/app/types/DaisyUIButtonVariant";


export type LinkItem = {
  href: string;
  label: string;
  variant: DaisyUIButtonVariant;
  className: string;
};

export const links: LinkItem[] = [  
  {
    href: "/",
    label: "Home",
    variant: "primary",
    className:
      "w-full sm:w-auto px-6 py-2 rounded hover:bg-neutral-700 text-neutral-50 font-semibold shadow transition text-center",
  },
  {
    href: "/about",
    label: "About",
    variant: "secondary",
    className:
      "w-full sm:w-auto px-6 py-2 rounded hover:bg-neutral-700 text-neutral-50 font-semibold shadow transition text-center",
  },
  {
    href: "/contact",
    label: "Contact Us",
    variant: "info",
    className:
      "w-full sm:w-auto px-6 py-2 rounded hover:bg-neutral-700 text-neutral-50 font-semibold shadow transition text-center",
  },
  {
    href: "/blog",
    label: "Blog",
    variant: "warning",
    className:
      "w-full sm:w-auto px-6 py-2 rounded hover:bg-neutral-700 text-neutral-50 font-semibold shadow transition text-center",
  },
];
