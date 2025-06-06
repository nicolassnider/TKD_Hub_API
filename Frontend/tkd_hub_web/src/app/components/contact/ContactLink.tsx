import React from "react";

type ContactLinkProps = {
  href: string;
  icon: string; // Bootstrap icon class, e.g. "bi bi-whatsapp"
  title: string;
  className?: string;
};

const ContactLink: React.FC<ContactLinkProps> = ({ href, icon, title, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    title={title}
  >
    <i className={icon}></i>
  </a>
);

export default ContactLink;
