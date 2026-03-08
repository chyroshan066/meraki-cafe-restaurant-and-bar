'use client';

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import {
  fetchReservationsClient,
  type Reservation,
  getStoredToken
} from "@/lib/clientApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

type ReservationsState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "success"; reservations: Reservation[] };

// Helper for dynamic status coloring - Meraki Cafe Gold Palette
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved': return 'text-[#c19977] border-[#c19977]/30 bg-[#c19977]/5';
    case 'rejected': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    case 'pending': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    default: return 'text-gray-400 border-white/10 bg-white/5';
  }
};

export default function ReservationsPage() {
  const [state, setState] = useState<ReservationsState>({ status: "loading" });

  async function loadReservations() {
    setState({ status: "loading" });
    try {
      const res = await fetchReservationsClient();
      setState({ status: "success", reservations: res.data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load reservations."
      });
    }
  }

  useEffect(() => { loadReservations(); }, []);

  async function updateStatus(id: number, status: Reservation["status"]) {
    const token = getStoredToken();
    if (!token) { alert("Admin session required."); return; }
    
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      await loadReservations();
    } catch (err) {
      alert("Failed to update reservation.");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808] text-gray-100 selection:bg-[#c19977]/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Topbar />
        
        <div className="p-6 lg:p-10">
          {/* Branded Header */}
          <div className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#c19977] font-semibold mb-2">
              Booking Ledger
            </h2>
            <h1 className="text-4xl font-serif italic tracking-tight text-white">Guest Reservations</h1>
            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[#c19977] to-transparent"></div>
          </div>

          {state.status === "loading" && (
            <div className="flex h-96 flex-col items-center justify-center space-y-4">
               <div className="h-10 w-10 animate-spin border-[1px] border-[#c19977] border-t-transparent rounded-full"></div>
               <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 animate-pulse">Syncing Table Schedule...</p>
            </div>
          )}

          {state.status === "error" && (
            <div className="border border-rose-950/30 bg-rose-950/5 p-8 text-rose-400 text-xs tracking-widest uppercase text-center">
              System Alert: {state.message}
            </div>
          )}

          {state.status === "success" && (
            <div className="overflow-x-auto border border-white/[0.05] bg-zinc-950/20 backdrop-blur-sm">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.01]">
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Ref ID</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Guest Profile</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Schedule</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-center">Party Size</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
                    <th className="px-6 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {state.reservations.length > 0 ? (
                    state.reservations.map((r) => (
                      <tr key={r.id} className="group transition-colors hover:bg-white/[0.02]">
                        <td className="px-6 py-5 font-mono text-[10px] text-[#c19977]/60">#{r.id}</td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-white group-hover:text-[#c19977] transition-colors">Client ID: {r.user_id}</p>
                          <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">Authorized Booking</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-white">
                            {new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-[11px] font-serif italic text-[#c19977] mt-0.5">{r.time}</p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-xl font-serif italic text-white">{r.number_of_guests}</span>
                          <span className="ml-2 text-[9px] uppercase tracking-widest text-gray-600">Pax</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-block border px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${getStatusColor(r.status)}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                            <button 
                              onClick={() => updateStatus(r.id, "approved")} 
                              className="px-4 py-1.5 text-[9px] uppercase tracking-widest border border-[#c19977]/40 text-[#c19977] hover:bg-[#c19977] hover:text-black transition-all"
                            >
                              Confirm
                            </button>
                            <button 
                              onClick={() => updateStatus(r.id, "rejected")} 
                              className="px-4 py-1.5 text-[9px] uppercase tracking-widest border border-zinc-800 text-zinc-600 hover:border-rose-900 hover:text-rose-500 transition-all"
                            >
                              Decline
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-32 text-center">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-700">The Guest Ledger is currently empty</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <footer className="mt-24 text-center">
              <p className="text-[9px] uppercase tracking-[0.6em] text-gray-800">Hospitality • Precision • Meraki Cafe Kathmandu</p>
          </footer>
        </div>
      </main>
    </div>
  );
}