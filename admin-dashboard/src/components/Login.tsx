"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredToken } from "@/lib/clientApi";

export function Login() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Safely check login status and get user info
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const isLoggedIn = !!getStoredToken();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user data");
        }
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoggedIn]);

  function handleLogout() {
    clearAuth();
    setIsMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-end border-b border-white/[0.05] bg-[#080808]/90 px-8 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <div className="relative" ref={menuRef}>
            {/* Profile Trigger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-4 group outline-none"
            >
              <div className="text-right hidden md:block transition-all group-hover:translate-x-[-4px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c19977]">
                  {user?.name || "Administrator"}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="h-1 w-1 rounded-full bg-[#c19977] animate-pulse"></span>
                  <p className="text-[8px] uppercase tracking-widest text-gray-600 italic">
                    Verified Session
                  </p>
                </div>
              </div>
              
              {/* Profile Initial Circle with Halo */}
              <div className="relative">
                <div className="h-10 w-10 rounded-full border border-[#c19977]/30 bg-[#c19977]/5 flex items-center justify-center text-[#c19977] text-[11px] font-bold transition-all duration-500 group-hover:border-[#c19977] group-hover:bg-[#c19977]/10 z-10 relative">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </div>
                {/* Subtle Glow Backdrop */}
                <div className="absolute inset-0 rounded-full bg-[#c19977]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </button>

            {/* Dropdown Menu - Luxury Styling */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-4 w-56 border border-white/[0.08] bg-[#0d0d0d] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="px-4 py-3 border-b border-white/[0.05] mb-1">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-bold">Security Control</p>
                </div>
                
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3 text-[9px] font-bold uppercase tracking-[0.25em] text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all group/btn"
                  >
                    <span>Terminate Session</span>
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                  </button>
                </div>

                {/* Decorative Bottom Line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#c19977]/20 to-transparent"></div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="group relative overflow-hidden border border-[#c19977]/50 px-8 py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#c19977] transition-all hover:text-black"
          >
            <span className="relative z-10 transition-colors duration-300">Authorize Access</span>
            <div className="absolute inset-0 bg-[#c19977] translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-0"></div>
          </button>
        )}
      </div>
    </header>
  );
}

export default Login;