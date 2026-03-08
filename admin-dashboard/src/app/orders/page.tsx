'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import {
  fetchAdminOrdersClient,
  updateOrderStatusClient,
  deleteOrderClient,
  type Order
} from '@/lib/clientApi';

type OrdersState =
  | { status: 'idle' | 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; orders: Order[] };

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return 'text-[#c19977] border-[#c19977]/30 bg-[#c19977]/5';
    case 'pending':
      return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    case 'cancelled':
      return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
    default:
      return 'text-gray-400 border-white/10 bg-white/5';
  }
};

export default function OrdersPage() {
  const [state, setState] = useState<OrdersState>({ status: 'loading' });

  async function loadOrders() {
    try {
      const res = await fetchAdminOrdersClient();
      setState({ status: 'success', orders: res.data });
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Failed to load orders.'
      });
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    try {
      await updateOrderStatusClient(id, status);
      loadOrders();
    } catch {
      alert('Failed to update order status');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this order permanently?')) return;

    try {
      await deleteOrderClient(id);
      loadOrders();
    } catch {
      alert('Failed to delete order');
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808] text-gray-100 selection:bg-[#c19977]/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Topbar />

        <div className="p-6 lg:p-10">
          {/* Page Header */}
          <div className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#c19977] font-semibold mb-2">
              Service Registry
            </h2>
            <h1 className="text-4xl font-serif italic tracking-tight text-white">
              Customer Orders
            </h1>
            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[#c19977] to-transparent"></div>
          </div>

          {state.status === 'loading' && (
            <div className="flex h-96 flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 animate-spin border-[1px] border-[#c19977] border-t-transparent rounded-full"></div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 animate-pulse">Synchronizing Ledger</p>
            </div>
          )}

          {state.status === 'error' && (
            <div className="border border-rose-950/30 bg-rose-950/5 p-8 text-rose-400 text-xs tracking-widest uppercase text-center">
              System Alert: {state.message}
            </div>
          )}

          {state.status === 'success' && (
            <div className="overflow-x-auto border border-white/[0.05] bg-zinc-950/20 backdrop-blur-sm">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.01]">
                    <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Ref. ID
                    </th>
                    <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Guest Identity
                    </th>
                    <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Selections
                    </th>
                    <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold text-center">
                      Valuation
                    </th>
                    <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold text-center">
                      Status
                    </th>
                    <th className="px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold text-right">
                      Operations
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.03]">
                  {state.orders.map((order) => (
                    <tr key={order.id} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="px-6 py-5 font-mono text-[10px] text-[#c19977]/70 group-hover:text-[#c19977]">
                        #{order.id}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-white group-hover:text-[#c19977] transition-colors">
                          {order.customer_name ?? 'Anonymous Guest'}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-600 mt-1">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          {order.items?.map((item: any) => (
                            <div key={item.menu_id} className="text-[11px] text-gray-400 group-hover:text-gray-300">
                              <span className="text-[#c19977]/60">{item.quantity}×</span> {item.menu_name}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center font-serif italic text-white">
                        <span className="text-[10px] not-italic text-gray-600 mr-1">NPR</span>
                        {Number(order.total_amount).toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-block px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-3">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(order.id, 'accepted')}
                                className="px-3 py-1.5 text-[9px] uppercase tracking-widest border border-[#c19977]/40 text-[#c19977] hover:bg-[#c19977] hover:text-black transition-all"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                                className="px-3 py-1.5 text-[9px] uppercase tracking-widest border border-amber-900/40 text-amber-600 hover:bg-amber-600 hover:text-black transition-all"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 text-zinc-800 hover:text-rose-500 transition-colors"
                            title="Purge Record"
                          >
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {state.orders.length === 0 && (
                <div className="py-32 text-center">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-gray-700">No active records found in registry</p>
                </div>
              )}
            </div>
          )}
          
          <footer className="mt-16 text-center">
             <p className="text-[9px] uppercase tracking-[0.4em] text-gray-800">
               Live Data Feed • Meraki Cafe Kathmandu
             </p>
          </footer>
        </div>
      </main>
    </div>
  );
}