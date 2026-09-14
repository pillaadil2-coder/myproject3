import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await register(name, email, password);
      onNavigate('trade');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white font-black text-xl shadow-lg shadow-blue-500/25 mb-2">
            A
          </div>
          <h2 className="text-2xl font-black text-slate-900">Open Live Account</h2>
          <p className="text-xs text-slate-500">Join Aventra FX Broker and receive $10,000 practice funds.</p>
        </div>

        {/* Perks Box */}
        <div className="mb-6 p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Instant $10,000 trading balance credited</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Raw spreads from 0.0 pips & 1:100 leverage</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">TradingView advanced charts & multi-asset terminal</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Create Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 active:scale-98"
          >
            <span>{loading ? 'Creating Account...' : 'Open Account Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-blue-600 font-extrabold hover:underline"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
