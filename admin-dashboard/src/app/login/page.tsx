'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storeAuth } from '@/lib/clientApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Authentication failed');
      }

      storeAuth(data.token, data.user);
      router.push('/');
      router.refresh(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080808] p-6 selection:bg-[#c19977]/30">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.03]" />
        <div className="absolute -top-[15%] -left-[10%] h-[50%] w-[50%] rounded-full bg-[#c19977]/5 blur-[140px]" />
        <div className="absolute -bottom-[15%] -right-[10%] h-[50%] w-[50%] rounded-full bg-[#c19977]/5 blur-[140px]" />
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Branding */}
        <div className="mb-12 text-center">
          <h2 className="text-[10px] uppercase tracking-[0.6em] text-[#c19977] font-semibold mb-4 animate-pulse">
            {isRegister ? 'Credential Registry' : 'Identity Verification'}
          </h2>
          <h1 className="text-5xl font-serif italic text-white tracking-tighter mb-2">Meraki Cafe</h1>
          <div className="flex items-center justify-center gap-4 mt-4">
             <div className="h-[1px] w-8 bg-[#c19977]/30"></div>
             <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500 font-medium whitespace-nowrap">
               Admin Portal
             </p>
             <div className="h-[1px] w-8 bg-[#c19977]/30"></div>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative border border-white/[0.05] bg-white/[0.01] p-8 md:p-12 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group">
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#c19977]/40 transition-all group-hover:scale-110"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#c19977]/40 transition-all group-hover:scale-110"></div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {isRegister && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-500">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800"
                  placeholder="e.g., Rajesh Sharma"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">
                Email Identity
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800"
                placeholder="admin@hiddenhut.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">
                Security Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 px-4 py-3 text-[10px] text-red-400 italic text-center uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <div className="pt-4 space-y-6">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 text-[11px] font-bold uppercase tracking-[0.4em] text-black transition-all disabled:opacity-50 overflow-hidden"
              >
                {/* Gold Gradient Button Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#c19977] via-[#d4b580] to-[#c19977] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-10px_rgba(193,153,119,0.5)]" />
                <span className="relative z-10">
                  {loading ? 'Authenticating...' : isRegister ? 'Initialize Access' : 'Authorize Entry'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-[#c19977] transition-colors italic"
              >
                {isRegister ? 'Return to secure login' : 'New Admin? Request entry'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center opacity-40">
          <p className="text-[9px] uppercase tracking-[0.5em] text-gray-600">
             &copy; 2026 Meraki Cafe • Restricted Access
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}