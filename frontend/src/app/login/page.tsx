'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storeAuth } from '@/lib/clientApi';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react'; // Suggested icons

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://meraki-cafe-restaurant-and-bar-one.vercel.app/api';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Authentication failed');

      storeAuth(data.token, data.user);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050505] p-4 font-sans selection:bg-[#63d3a6]/30">
      
      {/* Background with Texture/Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')] bg-cover bg-center opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505] to-[#050505]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-serif tracking-tight text-white mb-2">
            Hidden <span className="italic text-[#63d3a6]">Hut</span>
          </h1>
          <div className="h-px w-12 bg-[#63d3a6] mx-auto mb-4" />
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            {mode === 'login' ? 'Welcome Back' : 'Join the Table'}
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl">
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            
            <div className="space-y-5">
              {/* Name Field (Animated height/opacity in real CSS, conditional here) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#63d3a6] transition-colors" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-white/5 bg-white/5 py-3 pl-10 pr-4 text-white outline-none ring-1 ring-transparent focus:ring-[#63d3a6]/50 focus:border-[#63d3a6] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#63d3a6] transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-white/5 py-3 pl-10 pr-4 text-white outline-none ring-1 ring-transparent focus:ring-[#63d3a6]/50 focus:border-[#63d3a6] transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                  {mode === 'login' && <button type="button" className="text-[10px] text-gray-500 hover:text-[#63d3a6]">Forgot?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#63d3a6] transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-white/5 py-3 pl-10 pr-4 text-white outline-none ring-1 ring-transparent focus:ring-[#63d3a6]/50 focus:border-[#63d3a6] transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400 animate-in fade-in zoom-in duration-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#63d3a6] py-4 text-sm font-bold uppercase tracking-widest text-[#0a2e1f] transition-all hover:bg-[#74e2b5] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Switcher Footer */}
          <div className="border-t border-white/5 bg-black/20 py-6 text-center text-sm">
            <span className="text-gray-500">
              {mode === 'login' ? "Don't have an account?" : "Already a member?"}
            </span>{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="font-bold text-[#63d3a6] hover:text-white transition-colors"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
          Est. 2026 • Culinary Excellence
        </p>
      </div>
    </div>
  );
}