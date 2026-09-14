import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut, 
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, onOpenDeposit }) {
  const { user, metrics, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800 shadow-[0_1px_4px_rgba(0,0,0,0.03)] px-3 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-nowrap">
        
        {/* Left: Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-3 lg:gap-6 shrink-0">
          
          {/* Logo */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center space-x-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform text-white">
                <span className="font-black text-lg tracking-tighter">A</span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xl lg:text-2xl font-black tracking-tight text-slate-900">
                Aventra
              </span>
              <span className="text-xl lg:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
                FX
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-1 ml-0.5 animate-pulse"></span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleNav('home')}
              className={`px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors ${
                currentPage === 'home' 
                  ? 'text-blue-700 bg-blue-50/90 font-bold' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNav('trade')}
              className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors ${
                currentPage === 'trade' 
                  ? 'text-blue-700 bg-blue-50/90 font-bold border border-blue-200' 
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>WebTrader</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Client Portal: Only for regular logged-in traders */}
            {user && !isAdmin && (
              <button
                onClick={() => handleNav('dashboard')}
                className={`flex items-center space-x-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-blue-700 bg-blue-50 font-bold' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                <span>Client Portal</span>
              </button>
            )}

            {/* Admin CRM: Only for admin */}
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-black transition-all ${
                  currentPage === 'admin' 
                    ? 'text-amber-900 bg-amber-100 border border-amber-300 shadow-xs ring-1 ring-amber-200' 
                    : 'text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/90 border border-amber-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin CRM</span>
              </button>
            )}
          </div>

        </div>

        {/* Right: Account Summary & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {user ? (
            isAdmin ? (
              /* Admin Header Right Section: Clean, compact, never overlaps */
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-sans">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold truncate max-w-[130px]">{user.name || 'Super Admin'}</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-800">CRM</span>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* Trader Header Right Section */
              <>
                {/* Live Balance / Equity Bar */}
                <div className="hidden lg:flex items-center rounded-xl px-3 py-1 space-x-3 text-xs font-mono border bg-slate-100/90 border-slate-200 shadow-xs">
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-slate-500 font-bold">Balance</span>
                    <span className="font-bold text-xs text-slate-900">
                      ${metrics ? metrics.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) : user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-[1px] h-5 bg-slate-300"></div>
                  <div>
                    <span className="block text-[9px] uppercase font-sans text-slate-500 font-bold">Equity</span>
                    <span className={`font-bold text-xs ${metrics && metrics.floatingPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ${metrics ? metrics.equity.toLocaleString('en-US', { minimumFractionDigits: 2 }) : user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Deposit Action */}
                <button
                  onClick={onOpenDeposit}
                  className="hidden sm:flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-blue-500/20 shrink-0"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>

                {/* User Identity Pill */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                      <span className="truncate max-w-[110px]">{user.name}</span>
                    </div>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )
          ) : (
            /* Logged Out Guest */
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Open Account</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2.5 pt-2.5 border-t border-slate-200 bg-white space-y-1.5 pb-2 animate-in slide-in-from-top-2">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${
              currentPage === 'home' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => handleNav('trade')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              WebTrader
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Live</span>
          </button>

          {user && !isAdmin && (
            <button
              onClick={() => handleNav('dashboard')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Client Portal</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Backoffice CRM</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
