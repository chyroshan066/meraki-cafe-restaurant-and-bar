'use client';

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { fetchAdminOrdersClient } from "@/lib/clientApi";
import type { Order } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

type DashboardState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | {
      status: "success";
      orders: Order[];
      totalOrders: number;
      totalRevenue: number;
      menuCount: number;
    };

export default function HomePage() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  useEffect(() => {
    async function load() {
      try {
        const [ordersRes, menuRes] = await Promise.all([
          fetchAdminOrdersClient(),
          fetch(`${API_BASE_URL}/menu`).then((r) => r.json())
        ]);

        const orders = ordersRes.data;
        const totalOrders = ordersRes.pagination.total;
        const totalRevenue = orders.reduce(
          (sum, o) => sum + Number(o.total_amount),
          0
        );
        const menuCount = Array.isArray(menuRes.data)
          ? menuRes.pagination?.total ?? menuRes.data.length
          : 0;

        setState({
          status: "success",
          orders,
          totalOrders,
          totalRevenue,
          menuCount
        });
      } catch (err) {
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Failed to load dashboard data."
        });
      }
    }

    load();
  }, []);

  const latestOrders = state.status === "success" ? state.orders.slice(0, 5) : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-[#c19977] border-[#c19977]/30 bg-[#c19977]/5';
      case 'pending': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      case 'cancelled': return 'text-red-400 border-red-500/20 bg-red-500/5';
      default: return 'text-gray-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-gray-100 selection:bg-[#c19977] selection:text-black">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      
      <Sidebar />

      <main className="flex-1 overflow-hidden relative z-10">
        <Topbar />

        <div className="h-[calc(100vh-64px)] overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
          {/* Header Section */}
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#c19977] font-semibold mb-2">
                Executive Overview
              </h2>
              <h1 className="text-4xl font-serif italic tracking-tight text-white">Management Console</h1>
              <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[#c19977] to-transparent"></div>
            </div>
            <div className="text-right hidden md:block">
               <p className="text-[10px] text-gray-500 uppercase tracking-widest">System Status</p>
               <div className="flex items-center gap-2 justify-end mt-1">
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${state.status === 'error' ? 'bg-red-500' : 'bg-[#c19977]'}`}></span>
                  <p className="text-xs italic text-gray-300">{state.status === 'error' ? 'Interrupted' : 'Operational'}</p>
               </div>
            </div>
          </div>

          {/* Luxury Stats Grid */}
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Bookings", value: state.status === "success" ? state.totalOrders : "—", desc: "Lifetime volume" },
              { label: "Revenue", value: state.status === "success" ? `Rs. ${state.totalRevenue.toLocaleString()}` : "Rs. 0", desc: "Gross collection" },
              { label: "Menu Items", value: state.status === "success" ? state.menuCount : "—", desc: "Curated selection" },
              { label: "Active Mode", value: state.status === "error" ? "Offline" : "Live", desc: "Real-time sync" },
            ].map((stat, i) => (
              <article key={i} className="relative overflow-hidden border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-md transition-all duration-500 hover:border-[#c19977]/40 group">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500 group-hover:text-[#c19977] transition-colors duration-300">{stat.label}</p>
                <p className="mt-4 text-3xl font-serif italic text-white group-hover:translate-x-1 transition-transform duration-500">
                  {stat.value}
                </p>
                <p className="mt-2 text-[10px] text-gray-600 tracking-[0.1em] uppercase italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">{stat.desc}</p>
                
                {/* Subtle Gold Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 opacity-20 group-hover:opacity-100 transition-opacity">
                   <div className="absolute top-0 right-0 w-[1px] h-full bg-[#c19977]"></div>
                   <div className="absolute top-0 right-0 h-[1px] w-full bg-[#c19977]"></div>
                </div>
              </article>
            ))}
          </section>

          {/* Activity Section */}
          <section className="mt-12 border border-white/[0.05] bg-white/[0.01] backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-8 border-b border-white/[0.05] bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-serif italic text-white">Kitchen Logbook</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#c19977] mt-1">Latest Order Registry</p>
              </div>
              <button className="mt-4 md:mt-0 border border-[#c19977]/50 px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c19977] hover:bg-[#c19977] hover:text-black transition-all duration-300 rounded-sm">
                View All Activity
              </button>
            </div>

            <div className="overflow-x-auto p-2">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.3em] text-gray-500 px-6">
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Guest Name</th>
                    <th className="px-6 py-4 font-semibold">Total Amount</th>
                    <th className="px-6 py-4 font-semibold">Order Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((order) => (
                    <tr key={order.id} className="group bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-5 font-mono text-[11px] text-[#c19977]/70 italic">#{order.id}</td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-serif italic text-white">{order.customer_name ?? "Walk-in Guest"}</span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-200">Rs. {Number(order.total_amount).toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-block border px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right text-[11px] text-gray-500 italic">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                  {state.status === "success" && latestOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-[11px] uppercase tracking-[0.4em] text-gray-600 italic">
                        The kitchen is currently quiet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="mt-20 border-t border-white/[0.05] py-10 text-center">
              <p className="text-[10px] uppercase tracking-[0.6em] text-gray-700">Meraki Cafe Restaurant & Bar • Kathmandu</p>
          </footer>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1997720;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c1997750;
        }
      `}</style>
    </div>
  );
}