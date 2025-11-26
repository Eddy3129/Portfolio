"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListIcon, XIcon } from "../PhosphorIcons";

const NAV_LINKS = [
  { name: "About", href: "/about", colorClass: "text-neon-green" },
  { name: "Experience", href: "/experience", colorClass: "text-blue-400" },
  { name: "Projects", href: "/projects", colorClass: "text-neon-purple" },
  { name: "Contact", href: "/contact", colorClass: "text-neon-green" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavStyle = () => {
    switch (pathname) {
      case "/about":
      case "/contact":
        return "from-black/90 to-neon-green/10 border-neon-green/20";
      case "/experience":
        return "from-black/90 to-blue-400/10 border-blue-400/20";
      case "/projects":
        return "from-black/90 to-neon-purple/10 border-neon-purple/20";
      default:
        return "from-black/90 to-transparent border-white/5";
    }
  };

  const getLinkStyle = (path, colorClass) => {
    const isActive = pathname === path;
    return isActive
      ? `${colorClass} font-bold shadow-[0_0_10px_rgba(255,255,255,0.1)]`
      : "hover:text-white transition-colors";
  };

  const getLogoColor = () => {
    switch (pathname) {
      case "/about":
      case "/contact":
        return "text-neon-green";
      case "/experience":
        return "text-blue-400";
      case "/projects":
        return "text-purple-400";
      default:
        return "text-neon-green";
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 top-0 backdrop-blur-md border-b bg-linear-to-b transition-all duration-500 ${getNavStyle()}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-mono text-2xl font-bold text-white tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            0x<span className={getLogoColor()}>Eddy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-mono text-sm text-gray-400">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={getLinkStyle(link.href, link.colorClass)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 border-b border-white/10 backdrop-blur-xl p-6 flex flex-col gap-6 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`font-mono text-lg ${getLinkStyle(
                link.href,
                link.colorClass
              )}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
