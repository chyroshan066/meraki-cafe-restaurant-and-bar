// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { clearAuth, getStoredToken } from "@/lib/clientApi";
// import Link from "next/link";

// export default function Login() {
//   const router = useRouter();
//   const menuRef = useRef<HTMLDivElement>(null);

//   const [user, setUser] = useState<{ name?: string } | null>(null);
//   const [open, setOpen] = useState(false);

//   const logged = !!getStoredToken();
//   const initial = (user?.name || "U")[0].toUpperCase();

//   useEffect(() => {
//     const u = localStorage.getItem("user");
//     if (u) setUser(JSON.parse(u));

//     const close = (e: MouseEvent) =>
//       menuRef.current &&
//       !menuRef.current.contains(e.target as Node) &&
//       setOpen(false);

//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, [logged]);

//   const logout = () => {
//     clearAuth();
//     setOpen(false);
//     router.push("/login");
//   };

//   return (
//     <div className="relative flex items-center" ref={menuRef}>
//       {logged ? (
//         <>
//           <button
//             onClick={() => setOpen(!open)}
//             className="flex items-center gap-2 group transition-all duration-300"
//           >
//             <div className="h-10 w-10 rounded-full border-2 border-gold-colors bg-black/20 flex items-center justify-center text-[#e4c590] text-sm font-bold shadow-lg group-hover:scale-105 transition-transform">
//               {initial}
//             </div>
//           </button>

//           {open && (
//             <div className="absolute right-0 top-full mt-4 w-48 overflow-hidden rounded-sm border border-white/10 bg-[#0d0d0d] shadow-2xl animate-in fade-in slide-in-from-top-2">
//               <div className="px-4 py-3 border-b border-white/5">
//                 <p className="text-[10px] uppercase tracking-widest text-gray-500">
//                   Account
//                 </p>
//                 <p className="text-sm font-medium text-white truncate">
//                   {user?.name || "User"}
//                 </p>
//               </div>

//               <Link
//                 href="/bookings"
//                 className="flex items-center gap-2 w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-[#e4c590] hover:bg-white/5 transition-colors border-b border-white/5"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
//                   <polyline points="17 21 17 13 7 13 7 21"></polyline>
//                   <polyline points="7 3 7 8 15 8"></polyline>
//                 </svg>
//                 Bookings
//               </Link>

//               <button
//                 onClick={logout}
//                 className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 hover:bg-rose-500/10 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </>
//       ) : (
//         <button
//           onClick={() => router.push("/login")}
//           className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#e4c590] hover:text-white transition-colors py-2"
//         >
//           Login
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredToken } from "@/lib/clientApi";
import Link from "next/link";

// Added 'role' to the user type definition
interface User {
  name?: string;
  role?: string; 
}

const ADMIN_DASHBOARD_URL = "https://meraki-cafe-restaurant-and-bar-dun.vercel.app";

export default function Login() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const logged = !!getStoredToken();
  const initial = (user?.name || "U")[0].toUpperCase();

  useEffect(() => {
    const u = localStorage.getItem("user");

    if (u) setUser(JSON.parse(u));

    const close = (e: MouseEvent) =>
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      setOpen(false);

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [logged]);

  const logout = () => {
    clearAuth();
    setOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative flex items-center" ref={menuRef}>
      {logged ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 group transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-full border-2 border-gold-colors bg-black/20 flex items-center justify-center text-[#e4c590] text-sm font-bold shadow-lg group-hover:scale-105 transition-transform">
              {initial}
            </div>
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-4 w-48 overflow-hidden rounded-sm border border-white/10 bg-[#0d0d0d] shadow-2xl animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Account
                </p>
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
              </div>

              {/* Conditional Rendering: Admin Dashboard vs Customer Bookings */}
              {user?.role === "admin" ? (
                <Link
                  href={ADMIN_DASHBOARD_URL}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-[#e4c590] hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-[#e4c590] hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Bookings
                </Link>
              )}

              <button
                onClick={logout}
                className="w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#e4c590] hover:text-white transition-colors py-2"
        >
          Login
        </button>
      )}
    </div>
  );
}
