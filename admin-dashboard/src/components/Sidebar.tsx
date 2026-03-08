'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Orders", href: "/orders" },
  { label: "Users", href: "/users" },
  { label: "Menu Gallery", href: "/menu" },
  { label: "Visual Assets", href: "/gallery" },
  { label: "Guest Registry", href: "/reservations" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-white/[0.05] bg-[#080808] p-10 md:flex relative z-20">
      {/* Brand Identity Section */}
      <div className="mb-16">
        <div className="flex flex-col group cursor-default">
          <h2 className="font-serif italic text-3xl tracking-tight text-white group-hover:text-[#c19977] transition-colors duration-500">
            Meraki Cafe
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="h-[1px] w-6 bg-[#c19977]/40 transition-all duration-500 group-hover:w-10 group-hover:bg-[#c19977]"></span>
            <p className="text-[9px] uppercase tracking-[0.5em] text-gray-500 font-bold whitespace-nowrap">
              Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <p className="mb-6 text-[9px] uppercase tracking-[0.3em] text-gray-700 font-bold px-3">
          Console Directory
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-4 text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-500 rounded-sm relative overflow-hidden ${
                isActive
                  ? "text-[#c19977]"
                  : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
                {item.label}
              </span>
              
              {isActive && (
                <div className="flex items-center gap-2 relative z-10">
                   {/* Gold Glow Indicator */}
                   <span className="h-1 w-1 rounded-full bg-[#c19977] shadow-[0_0_10px_#c19977]"></span>
                </div>
              )}
              
              {/* Active Background Slide */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#c19977]/5 to-transparent pointer-events-none"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / System Status */}
      <div className="mt-auto border-t border-white/[0.05] pt-8">
        <div className="flex items-center gap-3 px-3 group">
          <div className="relative">
            <div className="h-1.5 w-1.5 rounded-full bg-[#c19977] animate-pulse"></div>
            <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-[#c19977] blur-[2px] opacity-50"></div>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-600 transition-colors group-hover:text-[#c19977]">
            Core Operational
          </p>
        </div>
        <div className="mt-6 px-3">
            <p className="text-[8px] uppercase tracking-[0.2em] text-gray-800 italic">
                Kathmandu, NP
            </p>
        </div>
      </div>
    </aside>
  );
}