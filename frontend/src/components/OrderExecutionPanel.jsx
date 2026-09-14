import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';
import { ArrowDown, ArrowUp, Info, AlertCircle, ShieldAlert } from 'lucide-react';

export default function OrderExecutionPanel() {
  const { activeSymbol, activeQuote, placeOrder } = useTrading();
  const { user, metrics } = useAuth();

  const [lotSize, setLotSize] = useState('0.10');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!activeQuote) {
    return (
      <div className="p-4 bg-white border-l border-slate-200 text-xs text-slate-400">
        Loading instrument data...
      </div>
    );
  }

  const leverage = user?.leverage || 100;
  const parsedLot = parseFloat(lotSize) || 0;
  const contractSize = activeQuote.contract_size || 100000;
  const currentMidPrice = (activeQuote.bid + activeQuote.ask) / 2;
  const estimatedMargin = ((parsedLot * contractSize * currentMidPrice) / leverage).toFixed(2);

  const handleLotChange = (delta) => {
    const current = parseFloat(lotSize) || 0.01;
    const next = Math.max(0.01, Math.round((current + delta) * 100) / 100);
    setLotSize(next.toFixed(2));
  };

  const handleExecute = async (type) => {
    if (!user) {
      setErrorMsg('Please sign in or open an account to place orders.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await placeOrder({
        type,
        lotSize: parseFloat(lotSize),
        sl: sl ? parseFloat(sl) : null,
        tp: tp ? parseFloat(tp) : null
      });
      setSl('');
      setTp('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 p-4 text-xs text-slate-800 select-none overflow-y-auto">
      
      {/* Active Symbol Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-wide">{activeSymbol}</h2>
          <span className="text-[11px] text-slate-500 font-medium">{activeQuote.name}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            1:{leverage} Leverage
          </span>
        </div>
      </div>

      {/* Lot Size Selector */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-slate-600 mb-1.5 font-bold">
          <span>Lot Size (Volume)</span>
          <span className="text-[11px] font-mono text-slate-400 font-normal">Min 0.01</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => handleLotChange(-0.10)}
            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
          >
            -0.1
          </button>
          <button
            onClick={() => handleLotChange(-0.01)}
            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
          >
            -0.01
          </button>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="100"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            className="flex-1 py-2 px-2 bg-slate-50 border border-slate-300 rounded-lg text-center font-mono font-black text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
          />
          <button
            onClick={() => handleLotChange(0.01)}
            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
          >
            +0.01
          </button>
          <button
            onClick={() => handleLotChange(0.10)}
            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
          >
            +0.1
          </button>
        </div>

        {/* Quick presets */}
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {['0.01', '0.05', '0.10', '0.50', '1.00', '2.00', '5.00', '10.00'].slice(0, 4).map((preset) => (
            <button
              key={preset}
              onClick={() => setLotSize(preset)}
              className={`py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                lotSize === preset
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Buy / Sell Dual Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {/* Sell Button */}
        <button
          onClick={() => handleExecute('SELL')}
          disabled={isSubmitting}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-50 text-white shadow-md shadow-rose-500/20 transition-all group"
        >
          <div className="flex items-center space-x-1 mb-1">
            <ArrowDown className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-black tracking-wider text-xs">SELL</span>
          </div>
          <span className="font-mono text-base font-black">
            {activeQuote.bid.toFixed(activeQuote.digits || 4)}
          </span>
          <span className="text-[10px] text-rose-100 mt-0.5">Market Short</span>
        </button>

        {/* Buy Button */}
        <button
          onClick={() => handleExecute('BUY')}
          disabled={isSubmitting}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white shadow-md shadow-emerald-500/20 transition-all group"
        >
          <div className="flex items-center space-x-1 mb-1">
            <ArrowUp className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            <span className="font-black tracking-wider text-xs">BUY</span>
          </div>
          <span className="font-mono text-base font-black">
            {activeQuote.ask.toFixed(activeQuote.digits || 4)}
          </span>
          <span className="text-[10px] text-emerald-100 mt-0.5">Market Long</span>
        </button>
      </div>

      {/* Stop Loss & Take Profit */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-slate-700 font-bold">
          <span>Risk Controls</span>
          <span className="text-[11px] text-slate-400 font-normal">Optional</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">Stop Loss (SL)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 1.0820"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-500 mb-1 font-medium">Take Profit (TP)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 1.0910"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Margin Info Card */}
      <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-slate-600 font-sans">
        <div className="flex justify-between items-center text-[11px]">
          <span className="flex items-center gap-1 text-slate-500">
            <Info className="w-3 h-3" />
            Required Margin:
          </span>
          <span className="font-mono font-bold text-slate-900">${estimatedMargin} USD</span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-500">Spread Cost:</span>
          <span className="font-mono text-slate-700 font-semibold">{activeQuote.spread} pips</span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-500">Contract Size:</span>
          <span className="font-mono text-slate-700 font-semibold">{contractSize.toLocaleString()}</span>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mt-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Guest Notice */}
      {!user && (
        <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-2 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>You are in guest viewing mode. Sign in to place real orders.</span>
        </div>
      )}

    </div>
  );
}
