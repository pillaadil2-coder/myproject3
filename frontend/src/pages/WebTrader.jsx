import React from 'react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';
import MarketWatch from '../components/MarketWatch';
import TradingViewWidget from '../components/TradingViewWidget';
import OrderExecutionPanel from '../components/OrderExecutionPanel';
import PositionsTable from '../components/PositionsTable';
import AccountMetricsBar from '../components/AccountMetricsBar';
import { ArrowUpRight, ArrowDownRight, Maximize2, RefreshCw } from 'lucide-react';

export default function WebTrader({ onOpenDeposit, onNavigate }) {
  const { activeSymbol, activeQuote, refreshTrades, notification } = useTrading();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-100 text-slate-800 overflow-hidden select-none">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-16 right-6 z-50 px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Trader Sub-header: Symbol Info & Quick Actions */}
      <div className="h-10 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 font-sans">
            <span className="font-black text-slate-900 text-sm tracking-tight">{activeSymbol}</span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              {activeQuote?.name}
            </span>
          </div>

          {activeQuote && (
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] mr-1 font-bold">BID:</span>
                <span className="text-slate-900 font-bold">{activeQuote.bid.toFixed(activeQuote.digits || 4)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] mr-1 font-bold">ASK:</span>
                <span className="text-slate-900 font-bold">{activeQuote.ask.toFixed(activeQuote.digits || 4)}</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-slate-400 text-[10px] mr-1 font-bold">24H:</span>
                <span className={`font-bold ${parseFloat(activeQuote.change24h) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {parseFloat(activeQuote.change24h) >= 0 ? '+' : ''}{activeQuote.change24h}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right quick tools */}
        <div className="flex items-center space-x-3 font-sans">
          <button
            onClick={refreshTrades}
            title="Refresh open positions"
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {!user && (
            <button
              onClick={() => onNavigate('login')}
              className="text-[11px] font-extrabold text-blue-600 hover:underline"
            >
              Sign In to Trade
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden bg-white">
        
        {/* Left: Market Watch (280px) */}
        <div className="w-72 hidden md:block shrink-0 h-full">
          <MarketWatch />
        </div>

        {/* Center: Chart + Positions (flex-1) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-slate-200">
          {/* Top: TradingView Chart (60%) */}
          <div className="h-[60%] min-h-[300px] w-full relative">
            <TradingViewWidget symbol={activeSymbol} />
          </div>

          {/* Bottom: Positions / Orders Table (40%) */}
          <div className="h-[40%] w-full overflow-hidden">
            <PositionsTable />
          </div>
        </div>

        {/* Right: Order Placement Form (300px) */}
        <div className="w-72 lg:w-80 shrink-0 h-full overflow-hidden">
          <OrderExecutionPanel />
        </div>

      </div>

      {/* Bottom: Account Metrics Status Bar */}
      <AccountMetricsBar />

    </div>
  );
}
