'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { type MenuItem } from "@/lib/api";
import { getStoredToken } from "@/lib/clientApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

type MenuState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: MenuItem[] };

export default function MenuPage() {
  const [state, setState] = useState<MenuState>({ status: "loading" });
  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    description: "",
    price: "",
    category: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  function resetForm() {
    setForm({ id: null, name: "", description: "", price: "", category: "" });
    setImageFile(null);
  }

  async function loadMenu() {
    setState({ status: "loading" });
    try {
      const res = await fetch(`${API_BASE_URL}/menu`);
      const data = await res.json();
      if (!Array.isArray(data.data)) throw new Error("Unexpected response");
      setState({ status: "success", items: data.data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load menu items."
      });
    }
  }

  useEffect(() => { loadMenu(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getStoredToken();
    if (!token) { alert("Admin login required"); return; }

    const isEditing = form.id != null;
    const url = isEditing ? `${API_BASE_URL}/menu/${form.id}` : `${API_BASE_URL}/menu`;
    const method = isEditing ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error("Save failed");
      resetForm();
      await loadMenu();
    } catch (err) {
      alert("Error saving item.");
    }
  }

  async function handleDelete(id: number) {
    const token = getStoredToken();
    if (!token || !confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`${API_BASE_URL}/menu/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadMenu();
    } catch (err) {
      alert("Delete failed.");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808] text-gray-100 selection:bg-[#c19977]/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <Topbar />
        
        <div className="p-6 lg:p-10 relative z-10">
          {/* Branded Header */}
          <div className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#c19977] font-semibold mb-2">
              Culinary Portfolio
            </h2>
            <h1 className="text-4xl font-serif italic tracking-tight text-white">Menu Gallery</h1>
            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[#c19977] to-transparent"></div>
          </div>

          {/* Form Section - Curator's Interface */}
          <section className="mb-16 border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c19977]/5 blur-[60px] -mr-16 -mt-16"></div>
            
            <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-white/[0.05] pb-3">
              {form.id ? "Refine Selection" : "Register New Dish"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Item Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border-b border-white/10 bg-transparent py-2.5 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800" placeholder="e.g. Signature Truffle Ramen" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Category</label>
                <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border-b border-white/10 bg-transparent py-2.5 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800" placeholder="e.g. Small Plates" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Price (NPR)</label>
                <input type="number" step="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border-b border-white/10 bg-transparent py-2.5 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800" placeholder="00.00" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Display Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="w-full text-[10px] text-gray-500 file:mr-4 file:border file:border-[#c19977]/30 file:bg-transparent file:px-4 file:py-1.5 file:text-[9px] file:uppercase file:tracking-widest file:text-[#c19977] hover:file:bg-[#c19977] hover:file:text-black file:transition-all cursor-pointer" />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Composition & Flavor Profile</label>
                <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border-b border-white/10 bg-transparent py-2.5 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800" placeholder="Describe the ingredients, texture, and inspiration..." />
              </div>

              <div className="flex items-end gap-3">
                <button type="submit" className="flex-1 bg-[#c19977] py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-black hover:bg-[#d4b580] transition-all shadow-[0_10px_20px_-10px_rgba(193,153,119,0.3)]">
                  {form.id ? "Sync Changes" : "Confirm Entry"}
                </button>
                {form.id && (
                  <button type="button" onClick={resetForm} className="bg-white/5 px-5 py-3.5 text-[11px] text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/10">✕</button>
                )}
              </div>
            </form>
          </section>

          {/* Menu Grid - Editorial Layout */}
          <section>
            {state.status === "loading" && (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="h-10 w-10 animate-spin border-[1px] border-[#c19977] border-t-transparent rounded-full"></div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 animate-pulse">Accessing Registry</p>
              </div>
            )}
            
            {state.status === "success" && (
              <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {state.items.map((item) => (
                  <article key={item.id} className="group relative border border-white/[0.05] bg-zinc-950/40 p-4 transition-all duration-500 hover:border-[#c19977]/40">
                    <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden bg-black">
                      {item.image_url ? 
                        <Image src={item.image_url} alt={item.name} fill className="object-cover opacity-80 grayscale-[0.5] transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" /> 
                        : <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.3em] text-zinc-800">Visual Missing</div>
                      }
                      <div className="absolute top-0 right-0 bg-[#c19977] px-3 py-1.5 text-[10px] font-bold text-black tracking-tighter">
                        NPR {Number(item.price)}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="h-[1px] w-4 bg-[#c19977]"></span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#c19977] font-bold">{item.category}</span>
                      </div>
                      <h3 className="font-serif italic text-xl text-white group-hover:text-[#c19977] transition-colors duration-500">{item.name}</h3>
                      <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-3 italic font-light">
                        "{item.description}"
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-white/[0.05] pt-5">
                        <button 
                          onClick={() => setForm({ id: item.id, name: item.name, description: item.description, price: String(item.price), category: item.category })} 
                          className="text-[9px] uppercase tracking-[0.3em] text-gray-500 hover:text-[#c19977] transition-colors"
                        >
                          Modify
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="text-[9px] uppercase tracking-[0.3em] text-zinc-800 hover:text-red-500 transition-colors"
                        >
                          Eliminate
                        </button>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute bottom-2 right-2 h-1 w-1 bg-[#c19977] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </article>
                ))}
              </div>
            )}
          </section>
          
          <footer className="mt-24 border-t border-white/[0.05] pt-12 text-center">
            <p className="text-[9px] uppercase tracking-[0.6em] text-gray-700">Meraki Cafe Culinary Registry • Kathmandu</p>
          </footer>
        </div>
      </main>
    </div>
  );
}