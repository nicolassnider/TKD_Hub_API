import React from "react";

type Props = {
  href: string;
  icon: string;
  title: string;
  className?: string; // Esta clase debe ir en el ícono
};

const ContactLink: React.FC<Props> = ({
  href,
  icon,
  title,
  className = "",
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={title}
    className="rounded-lg p-4 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
  >
    <i className={`${icon} text-3xl ${className}`} />
  </a>
);

export default ContactLink;
