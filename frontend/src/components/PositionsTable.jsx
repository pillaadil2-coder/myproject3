import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

export default function PositionsTable() {
  const { openTrades, tradeHistory, closeTrade } = useTrading();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'history'
  const [closingId, setClosingId] = useState(null);

  const handleClose = async (tradeId) => {
    setClosingId(tradeId);
    try {
      await closeTrade(tradeId);
    } catch (err) {
      console.error(err);
    } finally {
      setClosingId(null);
    }
  };

  const totalFloatingPnl = openTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);

  return (
    <div className="flex flex-col h-full bg-white border-t border-slate-200 text-xs text-slate-800 select-none">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'open'
                ? 'bg-white text-blue-700 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Open Positions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono">
              {openTrades.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-blue-700 border border-slate-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Trade History</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono">
              {tradeHistory.length}
            </span>
          </button>
        </div>

        {/* Live Total Floating PnL Pill */}
        {activeTab === 'open' && openTrades.length > 0 && (
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="text-slate-500">Total Floating PnL:</span>
            <span className={`font-bold px-2.5 py-0.5 rounded-md border ${
              totalFloatingPnl >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)} USD
            </span>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        {activeTab === 'open' ? (
          openTrades.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-sans">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <span>No open positions. Use the order panel on the right to place a trade.</span>
            </div>
          ) : (
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/60 font-bold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Lots</th>
                  <th className="py-2.5 px-3">Open Price</th>
                  <th className="py-2.5 px-3">Current</th>
                  <th className="py-2.5 px-3">SL</th>
                  <th className="py-2.5 px-3">TP</th>
                  <th className="py-2.5 px-3">Margin</th>
                  <th className="py-2.5 px-3 text-right">Profit / Loss</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {openTrades.map((t) => {
                  const isBuy = t.type === 'BUY';
                  const isProfit = (t.pnl || 0) >= 0;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-500">#{t.id}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-400">
                        {new Date(t.open_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 font-sans">{t.symbol}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold">{t.lot_size.toFixed(2)}</td>
                      <td className="py-2 px-3">{t.open_price.toFixed(4)}</td>
                      <td className="py-2 px-3 font-bold">{t.current_price?.toFixed(4) ?? t.open_price.toFixed(4)}</td>
                      <td className="py-2 px-3 text-slate-500">{t.sl ? t.sl.toFixed(4) : '—'}</td>
                      <td className="py-2 px-3 text-slate-500">{t.tp ? t.tp.toFixed(4) : '—'}</td>
                      <td className="py-2 px-3 text-slate-600">${t.margin.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`font-bold text-sm ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isProfit ? '+' : ''}${(t.pnl || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleClose(t.id)}
                          disabled={closingId === t.id}
                          title="Close Position"
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors text-[11px] font-bold"
                        >
                          {closingId === t.id ? 'Closing...' : 'Close'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          tradeHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-sans">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <span>No trade history available yet.</span>
            </div>
          ) : (
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/60 font-bold">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Close Time</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Lots</th>
                  <th className="py-2.5 px-3">Open Price</th>
                  <th className="py-2.5 px-3">Close Price</th>
                  <th className="py-2.5 px-3 text-right">Realized PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {tradeHistory.map((t) => {
                  const isBuy = t.type === 'BUY';
                  const isProfit = (t.pnl || 0) >= 0;

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-slate-500">#{t.id}</td>
                      <td className="py-2 px-3 text-[11px] text-slate-400">
                        {new Date(t.close_time || t.open_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 font-sans">{t.symbol}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold">{t.lot_size.toFixed(2)}</td>
                      <td className="py-2 px-3">{t.open_price.toFixed(4)}</td>
                      <td className="py-2 px-3 font-bold">{t.close_price?.toFixed(4) || '—'}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`font-bold text-sm ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isProfit ? '+' : ''}${(t.pnl || 0).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
