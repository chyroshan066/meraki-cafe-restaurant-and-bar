"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  user_id: number;
  total_amount: string;
  status: string;
  created_at: string;
}

interface Reservation {
  id: number;
  user_id: number;
  date: string;
  time: string;
  number_of_guests: number;
  status: string;
  name: string;
  phone_no: string;
  message?: string;
}

export default function BookingsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "reservations">("orders");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      // FIX 1: If no token, we must stop loading so the page isn't blank
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [ordersRes, resRes] = await Promise.all([
          fetch("https://api.merakirestro.com/api/orders/me?page=1&limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://api.merakirestro.com/api/reservations/me?page=1&limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        // FIX 2: Check if the response is actually valid JSON
        if (ordersRes.ok && resRes.ok) {
          const ordersData = await ordersRes.json();
          const resData = await resRes.json();

          setOrders(ordersData.data || []);
          setReservations(resData.data || []);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        // FIX 3: This runs whether the fetch succeeds OR fails
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";
      case "pending":
        return "text-amber-400 border-amber-400/20 bg-amber-400/5";
      case "cancelled":
        return "text-rose-400 border-rose-400/20 bg-rose-400/5";
      default:
        return "text-gray-400 border-gray-400/20 bg-gray-400/5";
    }
  };

  const cancelReservation = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token || !confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      const res = await fetch(`https://api.merakirestro.com/api/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
        );
      }
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#e4c590] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#e4c590] uppercase tracking-[0.4em] text-sm mb-3">Your History</p>
          <h1 className="text-5xl font-serif tracking-tight text-white">My Bookings</h1>
          <div className="w-20 h-[1px] bg-[#e4c590] mx-auto mt-6 opacity-50"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            {(["orders", "reservations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#e4c590] text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "orders" ? (
            orders.length === 0 ? (
              <div className="col-span-full"><EmptyState message="You haven't placed any orders yet." /></div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="group relative bg-white/[0.02] border border-white/10 p-6 rounded-sm hover:border-[#e4c590]/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#e4c590] block mb-1">Receipt ID</span>
                        <h3 className="text-xl font-medium tracking-wide">#{order.id}</h3>
                      </div>
                      <span className={`px-3 py-1 text-[9px] uppercase font-bold tracking-tighter border rounded-full ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Total Amount</span>
                    <p className="text-xl font-light text-[#e4c590]">Rs. {order.total_amount}</p>
                  </div>
                </div>
              ))
            )
          ) : (
            reservations.length === 0 ? (
              <div className="col-span-full"><EmptyState message="No table reservations found." /></div>
            ) : (
              reservations.map((res) => (
                <div key={res.id} className="bg-white/[0.02] border border-white/10 p-6 rounded-sm hover:border-[#e4c590]/40 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-[#e4c590] block mb-1">Table Reservation</span>
                      <h3 className="text-lg font-medium">For {res.name}</h3>
                    </div>
                    <span className={`px-3 py-1 text-[9px] uppercase font-bold tracking-tighter border rounded-full ${getStatusStyles(res.status)}`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <InfoItem label="Date" value={new Date(res.date).toLocaleDateString()} />
                    <InfoItem label="Time" value={res.time} />
                    <div className="col-span-2">
                      <InfoItem label="Guests" value={`${res.number_of_guests} People`} />
                    </div>
                  </div>

                  {res.message && (
                    <div className="mb-6 p-3 bg-white/[0.03] rounded-sm italic text-xs text-gray-400 line-clamp-2">
                      "{res.message}"
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-white/5">
                    {res.status.toLowerCase() === "pending" ? (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="w-full py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-rose-400 border border-rose-400/20 hover:bg-rose-400/5 transition-colors"
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <p className="text-center text-[10px] uppercase tracking-widest text-gray-600">Booking Finalized</p>
                    )}
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium tracking-wide text-white">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-white/10 rounded-sm">
      <p className="text-gray-500 font-serif italic">{message}</p>
    </div>
  );
}