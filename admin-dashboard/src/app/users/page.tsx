"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { fetchUsers, type User } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const res = await fetchUsers({
          token: token || undefined
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#080808] text-gray-100 selection:bg-[#c19977]/30">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Topbar />

        <div className="p-6 lg:p-10">
          {/* Branded Header */}
          <div className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#c19977] font-semibold mb-2">
              Member Registry
            </h2>
            <h1 className="text-4xl font-serif italic tracking-tight text-white">System Users</h1>
            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[#c19977] to-transparent"></div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-white/[0.05] bg-zinc-950/20 backdrop-blur-sm">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.01]">
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Ref. ID</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Profile Identity</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Digital Address</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Privilege Level</th>
                  <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-right">Registry Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                       <div className="inline-block h-10 w-10 animate-spin border-[1px] border-[#c19977] border-t-transparent rounded-full"></div>
                       <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-gray-600 animate-pulse">Synchronizing Registry</p>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="px-6 py-5 font-mono text-[10px] text-[#c19977]/60 group-hover:text-[#c19977]">
                        #{user.id}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-serif italic text-white group-hover:text-[#c19977] transition-colors">
                          {user.name}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-600 mt-1">Verified Member</p>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-400 font-light tracking-wide group-hover:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block border px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${
                          user.role === 'admin' 
                            ? 'text-[#c19977] border-[#c19977]/30 bg-[#c19977]/5' 
                            : 'text-gray-500 border-white/5 bg-white/[0.01]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <p className="text-[11px] text-gray-500 italic font-serif">
                          {new Date(user.created_at).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <p className="text-[10px] uppercase tracking-[0.5em] text-gray-700 italic">
                        No active records found in registry.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="mt-24 text-center">
             <p className="text-[9px] uppercase tracking-[0.6em] text-gray-800 font-semibold">
               Meraki Cafe Restaurant & Bar • Kathmandu
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}