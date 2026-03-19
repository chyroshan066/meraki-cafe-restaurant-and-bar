'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storeAuth } from '@/lib/clientApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.merakirestro.com/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState(''); // 1. Added phone number state
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    // 2. Included phoneNo in the registration payload
    const payload = isRegister 
      ? { name, email, password, phone_no: phoneNo } 
      : { email, password };

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
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6 selection:bg-[#e4c590]/30 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#0a0a0a]" />
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
          alt="Restaurant Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-700">
        <div className="mb-10 text-center">
          <h2 className="text-[12px] uppercase tracking-[0.5em] text-[#e4c590] font-bold mb-3">
            {isRegister ? 'Join Us' : 'Welcome Back'}
          </h2>
          <h1 className="text-6xl font-serif italic text-white tracking-tight">Meraki Restro</h1>
          <div className="w-12 h-[1px] bg-[#e4c590] mx-auto mt-6 opacity-40"></div>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl shadow-2xl rounded-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {isRegister && (
              <>
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-500">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-white/10 bg-transparent px-1 py-4 text-white outline-none focus:border-[#e4c590] transition-all placeholder:text-gray-800"
                    style={{ fontSize: '18px' }}
                    placeholder="Rajesh Sharma"
                  />
                </div>

                {/* 3. Added Phone Number Input Field */}
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-600">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className="w-full border-b border-white/10 bg-transparent px-1 py-4 text-white outline-none focus:border-[#e4c590] transition-all placeholder:text-gray-800"
                    style={{ fontSize: '18px' }}
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-gray-500 ml-1">
                Email Identity
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent px-1 py-4 text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800"
                style={{ fontSize: '18px' }}
                placeholder="admin@hiddenhut.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent px-1 py-4 text-white outline-none focus:border-[#c19977] transition-all placeholder:text-gray-800"
                style={{ fontSize: '18px' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-rose-950/20 border border-rose-900/50 px-4 py-3 text-[11px] text-rose-400 italic text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="space-y-6 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e4c590] py-4 text-[13px] font-bold uppercase tracking-[0.3em] text-black transition-all hover:bg-[#d4b580] disabled:opacity-50 shadow-lg active:scale-[0.98]"
              >
                {loading ? 'Verifying...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="w-full text-center text-[12px] uppercase tracking-widest text-gray-500 hover:text-[#e4c590] transition-colors"
              >
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600">
            &copy; 2026 Meraki Restro Restaurant Group
          </p>
        </div>
      </div>
    </div>
  );
}