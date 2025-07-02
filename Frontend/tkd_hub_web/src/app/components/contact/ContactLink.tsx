import React from "react";

type ContactLinkProps = {
  href: string;
  icon: string; // Bootstrap icon class, e.g. "bi bi-whatsapp"
  title: string;
  className?: string;
};

const ContactLink: React.FC<ContactLinkProps> = ({
  href,
  icon,
  title,
  className,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center justify-center p-2 rounded-md transition-colors duration-200 hover:bg-neutral-200 bg-neutral-100 text-neutral-800 hover:text-neutral-900 ${className}`}
    title={title}
  >
    <i className={`${icon} text-xl`}></i>
  </a>
);

export default ContactLink;
