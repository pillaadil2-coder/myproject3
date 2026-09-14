import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketWatch() {
  const { prices, activeSymbol, setActiveSymbol } = useTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'forex', label: 'Forex' },
    { id: 'commodities', label: 'Metals/Oil' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'indices', label: 'Indices' }
  ];

  const instruments = Object.values(prices).filter((item) => {
    const matchesSearch = item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 select-none">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-200 space-y-2.5 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">Market Watch</span>
          <span className="text-[11px] text-slate-400 font-mono font-bold">{instruments.length} Pairs</span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symbol..."
            className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Category pills */}
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap font-bold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
        <div className="col-span-5">Symbol</div>
        <div className="col-span-3 text-right">Bid</div>
        <div className="col-span-4 text-right">Ask / Chg</div>
      </div>

      {/* Symbol List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {instruments.map((item) => {
          const isSelected = activeSymbol === item.symbol;
          const isPositive = parseFloat(item.change24h) >= 0;

          return (
            <div
              key={item.symbol}
              onClick={() => setActiveSymbol(item.symbol)}
              className={`grid grid-cols-12 px-3 py-2.5 cursor-pointer transition-colors items-center text-xs font-mono ${
                isSelected 
                  ? 'bg-blue-50/80 border-l-2 border-blue-600' 
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* Symbol & Category */}
              <div className="col-span-5 font-sans">
                <div className="font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                  {item.symbol}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                  {item.name}
                </div>
              </div>

              {/* Bid */}
              <div className="col-span-3 text-right">
                <span className="font-bold text-slate-900">
                  {item.bid.toFixed(item.digits || 4)}
                </span>
              </div>

              {/* Ask & Change */}
              <div className="col-span-4 text-right">
                <div className="font-bold text-slate-900">
                  {item.ask.toFixed(item.digits || 4)}
                </div>
                <div className={`text-[10px] font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? '+' : ''}{item.change24h}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
