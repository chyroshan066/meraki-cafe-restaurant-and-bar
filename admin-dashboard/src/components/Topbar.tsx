'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getStoredToken } from '@/lib/clientApi';
import Login from './Login';

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Map pathnames to high-end administrative titles
  const getPageTitle = () => {
    switch(pathname) {
      case '/': return 'Operational Overview';
      case '/orders': return 'Live Order Registry';
      case '/users': return 'Administrative Directory';
      case '/menu': return 'Culinary Portfolio';
      case '/gallery': return 'Visual Asset Archive';
      case '/reservations': return 'Guest & Table Ledger';
      default: return 'System Management';
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.05] bg-[#080808]/80 px-10 py-6 backdrop-blur-xl">
      {/* Dynamic Section Title */}
      <div className="relative group">
        <div className="flex items-center gap-3">
          <div className="h-2 w-[1px] bg-[#c19977] opacity-50 transition-all group-hover:h-4 group-hover:opacity-100"></div>
          <h1 className="text-[10px] font-bold uppercase tracking-[0.6em] text-gray-400 transition-colors group-hover:text-white">
            {getPageTitle()}
          </h1>
        </div>
        {/* Subtle decorative underline */}
        <div className="absolute -bottom-1 left-4 h-[1px] w-0 bg-gradient-to-r from-[#c19977]/40 to-transparent transition-all duration-700 group-hover:w-full"></div>
      </div>
      
      {/* Auth Component Trigger */}
      <div className="flex items-center gap-8">
        {/* You could add a 'Live' clock or notification bell here in the future */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 border-x border-white/[0.05]">
           <span className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-medium">
             Terminal 01
           </span>
        </div>
        <Login />
      </div>

      <style jsx>{`
        header {
          /* Add a subtle top-to-bottom gradient to the blur */
          background: linear-gradient(to bottom, rgba(8,8,8,0.95), rgba(8,8,8,0.8));
        }
      `}</style>
    </header>
  );
}