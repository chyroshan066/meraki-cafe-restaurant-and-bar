"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredToken } from "@/lib/clientApi";

export function Login() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!getStoredToken();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoggedIn]);

  const handleLogout = () => {
    clearAuth();
    setIsMenuOpen(false);
    router.push("/login");
  };

  const initial = (user?.name || "A").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-end border-b border-white/5 bg-[#0a0a0a]/80 px-8 py-4 backdrop-blur-md">
      {isLoggedIn ? (
        <div className="relative" ref={menuRef}>
          {/* Profile Button */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 group"
          >
            {/* <div className="hidden md:flex flex-col text-right leading-tight">
              <span className="text-[11px] font-semibold text-gray-300">
                {user?.name || "Administrator"}
              </span>
              <span className="text-[9px] text-gray-500">Active session</span>
            </div> */}

            <div className="h-9 w-9 rounded-full border border-[#63d3a6]/30 bg-[#63d3a6]/10 flex items-center justify-center text-[#63d3a6] text-sm font-semibold transition-all group-hover:border-[#63d3a6]">
              {initial}
            </div>
          </button>

          {/* Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-44 rounded-md border border-white/10 bg-[#0d0d0d] p-1 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
              <button
                onClick={handleLogout}
                className="w-full rounded-md px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition hover:bg-white/5 hover:text-rose-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#63d3a6] relative group"
        >
          Login
          <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#63d3a6] transition-all group-hover:w-full"></span>
        </button>
      )}
    </header>
  );
}

export default Login;