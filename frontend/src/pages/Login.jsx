import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const resData = await login(email, password);
      if (resData?.metrics?.user?.role === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('trade');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white font-black text-xl shadow-lg shadow-blue-500/25 mb-2">
            A
          </div>
          <h2 className="text-2xl font-black text-slate-900">Sign In to Aventra FX</h2>
          <p className="text-xs text-slate-500">Access your live trading account and WebTrader charts.</p>
        </div>

        {/* Quick Demo Accounts Helper */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
            ⚡ Quick Test Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('trader@royalfx.com', 'trader123')}
              className="py-2 px-2 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Trader</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@royalfx.com', 'admin123')}
              className="py-2 px-2 bg-white hover:bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-amber-300 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Broker Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="trader@royalfx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1.5 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
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
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-600">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-blue-600 font-extrabold hover:underline"
          >
            Open Live Account
          </button>
        </div>

      </div>
    </div>
  );
}
