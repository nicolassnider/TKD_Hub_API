"use client";
import React, { useCallback, useRef } from "react";
import Link from "next/link";
import { useRoles } from "@/app/context/RoleContext";
import servicesRoutes from "@/app/routes/servicesRoutes";
import GenericButton from "../common/actionButtons/GenericButton";

const ServicesDropdown: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const { role } = useRoles();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        toggle();
      }
    },
    [toggle]
  );

  React.useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  return (
    <div className="relative" ref={servicesRef}>
      <GenericButton type="button" variant="primary" onClick={toggle}>
        <i className="bi bi-tools mr-2" aria-hidden="true"></i>
        Services
        <i
          className={`bi ms-2 ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}
          aria-hidden="true"
        ></i>
      </GenericButton>
      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-[180px] bg-neutral-50 dark:bg-neutral-900 rounded-md shadow-lg z-10 border border-neutral-300 dark:border-neutral-700 transition-all duration-300 ease-in-out">
          {servicesRoutes
            .filter(
              (route) =>
                !route.roles ||
                route.roles.some((r) =>
                  (role as string[]).includes(r as string)
                )
            )
            .map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={toggle}
                className="flex items-center px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors rounded text-neutral-900 dark:text-neutral-100"
              >
                {/* Bootstrap icon */}
                <i className={`${route.icon} mr-2`} aria-hidden="true"></i>
                {route.label}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default ServicesDropdown;
