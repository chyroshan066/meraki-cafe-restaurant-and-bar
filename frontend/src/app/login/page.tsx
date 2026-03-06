'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storeAuth } from '@/lib/clientApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false); // Toggle state
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

      // Automatically log in after registration or use login data
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
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6 selection:bg-[#63d3a6]/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-[#63d3a6]/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-[#63d3a6]/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] z-10">
        <div className="mb-10 text-center">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#63d3a6] font-bold mb-3">
            {isRegister ? 'New Account' : 'Secure Access'}
          </h2>
          <h1 className="text-4xl font-serif italic text-white tracking-tight">Hidden Hut</h1>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-gray-500 font-medium">
            Administrative Portal
          </p>
        </div>

        <div className="border border-white/5 bg-white/[0.02] p-8 md:p-10 backdrop-blur-md shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Show Name field only if Registering */}
            {isRegister && (
              <div className="space-y-2 animate-in fade-in duration-500">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                  Admin Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none focus:border-[#63d3a6] transition-all placeholder:text-gray-800"
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Email Identity
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none focus:border-[#63d3a6] transition-all placeholder:text-gray-800"
                placeholder="admin@hiddenhut.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Security Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent px-1 py-3 text-sm text-white outline-none focus:border-[#63d3a6] transition-all placeholder:text-gray-800"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-rose-950/20 border border-rose-900/50 px-4 py-3 text-[11px] text-rose-400 italic text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-[#63d3a6] py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#0a2e1f] transition-all hover:bg-[#52b18c] disabled:opacity-50 mt-2"
              >
                <span className="relative z-10">
                  {loading ? 'Verifying...' : isRegister ? 'Create Admin Account' : 'Authorize Login'}
                </span>
              </button>

              {/* Toggle Link */}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="w-full text-center text-[10px] uppercase tracking-widest text-gray-500 hover:text-[#63d3a6] transition-colors"
              >
                {isRegister ? 'Already have access? Login' : 'New Admin? Request Access'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-700">
            For Authorized Use Only &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}