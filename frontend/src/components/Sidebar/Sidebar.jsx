import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { HiOutlineFire } from "react-icons/hi2";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";

import "./Sidebar.css";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Me",
    icon: IoPersonOutline,
    end: true,
  },
  {
    to: "/playlist",
    label: "Playlist",
    icon: IoMusicalNotesOutline,
  },
  { to: "/roast", label: "Roast", icon: HiOutlineFire },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const closeSidebar = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeSidebar]);

  const labelClass = isOpen ? "" : "label-hidden";

  return (
    <>
      {/* Mobile-only top bar */}
      <div className="fixed top-0 left-0 right-0 z-998 flex items-center gap-3 bg-brand text-white px-4 py-3 md:hidden">
        <IoMdMenu
          className="min-w-10 text-3xl rounded-lg cursor-pointer hover:bg-accent"
          onClick={() => setIsOpen(true)}
        />
        <span className="text-lg font-normal ">BudgetManager</span>
      </div>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[998] bg-black/40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          flex flex-col justify-between gap-4
          p-4 min-h-screen
          bg-surface-alt text-white
          overflow-hidden transition-all duration-300 ease-in-out
          z-[999]
          fixed top-0 left-0
          md:fixed md:top-0 md:left-0 md:h-screen md:translate-x-0
          ${isOpen ? "w-2xs translate-x-0" : "w-20 -translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-4 text-xl mx-1">
          <IoMdMenu
            className="min-w-10 p-1.5 text-4xl rounded-lg cursor-pointer hover:bg-brand-bright"
            onClick={() => setIsOpen((prev) => !prev)}
          />
          <span
            className={`whitespace-nowrap transition-opacity duration-150 ease-in-out ${labelClass}`}
          >
            Menu
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-lg">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `navItem ${isActive ? "active" : ""}`
                  }
                  onClick={closeSidebar}
                >
                  <Icon className="optionIcon" />
                  <span className={labelClass}>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
