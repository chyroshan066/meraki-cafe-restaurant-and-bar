'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
// 1. Import the compression library
import imageCompression from 'browser-image-compression'; 
import {
  fetchGalleryClient,
  type GalleryImage,
  getStoredToken
} from "@/lib/clientApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

type GalleryState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "success"; images: GalleryImage[] };

export default function GalleryPage() {
  const [state, setState] = useState<GalleryState>({ status: "loading" });
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  // 2. Added a state to track compression progress
  const [isCompressing, setIsCompressing] = useState(false); 

  async function loadGallery() {
    setState({ status: "loading" });
    try {
      const res = await fetchGalleryClient();
      setState({ status: "success", images: res.data });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load gallery images."
      });
    }
  }

  useEffect(() => { loadGallery(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const token = getStoredToken();
    if (!token) { alert("Admin session required."); return; }
    if (!file) { alert("Please select an image file."); return; }

    setIsCompressing(true); // Start loading state

    try {
      // 3. COMPRESSION LOGIC
      // This happens entirely in the user's browser
      const options = {
        maxSizeMB: 4,           // Forces result to be under Vercel's 4.5MB limit
        maxWidthOrHeight: 2560, // Resizes massive 4K photos to a sensible 2K
        useWebWorker: true,
        fileType: 'image/webp', // WebP is ~30% smaller than JPEG at same quality
        initialQuality: 0.85    // High quality (85%)
      };

      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      // We send the COMPRESSED file instead of the original 'file'
      formData.append("image", compressedFile, compressedFile.name);
      if (title) formData.append("title", title);

      const res = await fetch(`${API_BASE_URL}/gallery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to upload image");
      
      setFile(null);
      setTitle("");
      await loadGallery();
    } catch (err) {
      console.error(err);
      alert("Failed to compress or upload image.");
    } finally {
      setIsCompressing(false); // End loading state
    }
  }

  // ... handleDelete function stays the same ...
  async function handleDelete(id: number) {
    const token = getStoredToken();
    if (!token) return;
    if (!confirm("Are you sure you want to remove this image from the gallery?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete");
      await loadGallery();
    } catch (err) {
      alert("Failed to delete image.");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080808] text-gray-100 selection:bg-[#c19977]/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        <Topbar />
        
        <div className="p-6 lg:p-10 relative z-10">
          <div className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#c19977] font-semibold mb-2">Visual Narrative</h2>
            <h1 className="text-4xl font-serif italic tracking-tight text-white">Gallery Management</h1>
            <div className="mt-4 h-[1px] w-24 bg-gradient-to-r from-[#c19977] to-transparent"></div>
          </div>

          <section className="mb-16 border border-white/[0.05] bg-white/[0.01] p-8 backdrop-blur-md relative overflow-hidden group">
            <h2 className="mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-white/[0.05] pb-3">Curate New Asset</h2>
            
            <form onSubmit={handleUpload} className="flex flex-col gap-10 lg:flex-row lg:items-end relative z-10">
              <div className="flex-1 space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Source File</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)} 
                  disabled={isCompressing}
                  className="w-full text-[11px] text-gray-500 file:mr-6 file:border file:border-[#c19977]/30 file:bg-transparent file:px-6 file:py-2.5 file:text-[10px] file:uppercase file:tracking-widest file:text-[#c19977] hover:file:bg-[#c19977] hover:file:text-black file:transition-all cursor-pointer" 
                />
              </div>

              <div className="flex-1 space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#c19977] font-bold">Asset Label</label>
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  disabled={isCompressing}
                  className="w-full border-b border-white/10 bg-transparent py-2.5 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800" 
                  placeholder="e.g. Signature Cocktails" 
                />
              </div>

              {/* Updated Button to show loading state */}
              <button 
                type="submit" 
                disabled={isCompressing || !file}
                className="bg-[#c19977] disabled:opacity-50 disabled:cursor-not-allowed px-12 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-black hover:bg-[#d4b580] transition-all shadow-[0_10px_20px_-10px_rgba(193,153,119,0.3)]"
              >
                {isCompressing ? "Processing Image..." : "Sync to Gallery"}
              </button>
            </form>
          </section>

          {/* ... Rest of your gallery display code remains exactly the same ... */}
          <section>
             {state.status === "loading" && (
               <div className="flex flex-col items-center justify-center py-32 space-y-4">
                 <div className="h-10 w-10 animate-spin border-[1px] border-[#c19977] border-t-transparent rounded-full"></div>
                 <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 animate-pulse">Loading Visuals</p>
               </div>
             )}
             
             {state.status === "error" && (
               <div className="text-center py-20 border border-red-900/20 bg-red-900/5 backdrop-blur-sm">
                 <p className="text-[11px] uppercase tracking-widest text-red-400 italic">Registry Error: {state.message}</p>
               </div>
             )}
             
             {state.status === "success" && (
               <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                 {state.images.map((image) => (
                   <article key={image.id} className="group relative border border-white/[0.05] bg-zinc-950/40 p-3 transition-all duration-500 hover:border-[#c19977]/50">
                     <div className="relative mb-5 aspect-[4/5] w-full overflow-hidden bg-black">
                       <Image 
                         src={image.image_url} 
                         alt={image.title || "Gallery image"} 
                         fill 
                         className="object-cover opacity-80 grayscale-[0.4] transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
                       />
                       <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-6 backdrop-blur-[2px]">
                          <button onClick={() => handleDelete(image.id)} className="w-full border border-red-500/40 py-3 text-[9px] uppercase tracking-[0.3em] text-red-400 hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">Remove from Registry</button>
                       </div>
                     </div>
                     <div className="flex flex-col space-y-1 px-1 pb-2">
                       <p className="text-[12px] font-serif italic tracking-wide text-gray-200 truncate">{image.title || "Untitled Perspective"}</p>
                       <div className="flex items-center justify-between">
                          <span className="text-[8px] uppercase tracking-[0.2em] text-gray-600">Asset ID: #{image.id}</span>
                          <span className="text-[8px] uppercase tracking-[0.2em] text-[#c19977]/60">High Definition</span>
                       </div>
                     </div>
                   </article>
                 ))}
               </div>
             )}
          </section>
        </div>
      </main>
    </div>
  );
} 