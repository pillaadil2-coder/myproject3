import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrading } from '../context/TradingContext';
import { Activity, ShieldCheck, Wifi } from 'lucide-react';

export default function AccountMetricsBar() {
  const { metrics, user } = useAuth();
  const { openTrades } = useTrading();

  if (!user) {
    return (
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-xs flex items-center justify-between text-slate-500 select-none">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">Aventra FX Trading Engine Live Feed Active</span>
        </div>
        <span>Sign in to view account metrics and execute orders</span>
      </div>
    );
  }

  // Calculate live floating metrics from openTrades
  const balance = metrics?.balance ?? user.balance;
  const totalFloatingPnl = openTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const totalMargin = openTrades.reduce((acc, t) => acc + (t.margin || 0), 0);
  const equity = balance + totalFloatingPnl;
  const freeMargin = equity - totalMargin;
  const marginLevel = totalMargin > 0 ? ((equity / totalMargin) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white border-t border-slate-200 px-4 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-y-2 select-none text-slate-800 shadow-xs">
      
      {/* Metrics Row */}
      <div className="flex items-center space-x-6">
        
        <div>
          <span className="text-slate-400 font-sans text-[11px] mr-1.5 font-bold uppercase">Balance:</span>
          <span className="text-slate-900 font-bold text-sm">${balance.toFixed(2)}</span>
        </div>

        <div>
          <span className="text-slate-400 font-sans text-[11px] mr-1.5 font-bold uppercase">Equity:</span>
          <span className={`font-bold text-sm ${totalFloatingPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ${equity.toFixed(2)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 font-sans text-[11px] mr-1.5 font-bold uppercase">Margin:</span>
          <span className="text-slate-800 font-bold text-sm">${totalMargin.toFixed(2)}</span>
        </div>

        <div>
          <span className="text-slate-400 font-sans text-[11px] mr-1.5 font-bold uppercase">Free Margin:</span>
          <span className="text-blue-600 font-bold text-sm">${freeMargin.toFixed(2)}</span>
        </div>

        <div>
          <span className="text-slate-400 font-sans text-[11px] mr-1.5 font-bold uppercase">Margin Level:</span>
          <span className={`font-bold text-sm ${parseFloat(marginLevel) > 100 || marginLevel === '0.0' ? 'text-slate-800' : 'text-amber-600'}`}>
            {marginLevel === '0.0' ? '---' : `${marginLevel}%`}
          </span>
        </div>

      </div>

      {/* Server Status & Leverage */}
      <div className="flex items-center space-x-4 text-[11px] font-sans font-medium">
        <div className="flex items-center space-x-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>1:100 Leverage</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span>Connected (12ms)</span>
        </div>
      </div>

    </div>
  );
}
