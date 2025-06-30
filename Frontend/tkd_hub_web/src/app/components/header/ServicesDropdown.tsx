"use client";
import React, { useCallback, useRef } from "react";
import Link from "next/link";
import { useRoles } from "@/app/context/RoleContext";
import servicesRoutes from "@/app/routes/servicesRoutes";

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
      <button
        onClick={toggle}
        className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-300 ease-in-out focus:outline-none font-semibold px-3 py-1 rounded bg-purple-600 hover:bg-purple-700"
      >
        <i className="bi bi-gear-fill"></i>
        Services
        <i
          className={`bi ${
            isOpen ? "bi-chevron-up" : "bi-chevron-down"
          } transition-transform duration-300`}
        ></i>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 min-w-[180px] bg-gray-800 rounded-md shadow-lg z-10 border border-purple-500 transition-all duration-300 ease-in-out">
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
                className={`flex items-center px-4 py-2 hover:bg-purple-700 transition-colors rounded`}
              >
                <i className={`${route.icon} mr-2`}></i>
                {route.label}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default ServicesDropdown;
