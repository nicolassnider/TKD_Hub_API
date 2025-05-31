import React, { useState, useRef } from "react";

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">TKD_Hub</span>
        <div className="d-flex align-items-center gap-2">
          <a className="btn btn-link text-white text-decoration-none" href="#">
            Home
          </a>
          <a className="btn btn-link text-white text-decoration-none" href="#">
            Blog
          </a>
          <a className="btn btn-link text-white text-decoration-none" href="#">
            Events
          </a>
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="btn btn-link text-white text-decoration-none dropdown-toggle"
              type="button"
              onClick={() => setShowDropdown((v) => !v)}
              aria-expanded={showDropdown} // Pass as boolean
            >
              Manage
            </button>
            <ul
              className={`dropdown-menu${showDropdown ? " show" : ""}`}
              style={{ minWidth: "8rem" }}
            >
              <li>
                <a className="dropdown-item" href="#">
                  Users
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Students
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Coaches
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Dojaangs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
