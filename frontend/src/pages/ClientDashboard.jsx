import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { walletAPI, kycAPI } from '../services/api';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

export default function ClientDashboard({ onOpenDeposit, onOpenWithdraw, onOpenKyc, onNavigate }) {
  const { user, metrics, refreshMetrics } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await walletAPI.getTransactions();
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    refreshMetrics();
  }, []);

  if (!user) {
    return (
      <div className="p-12 text-center text-slate-500">
        Please sign in to access client portal.
      </div>
    );
  }

  const kycColors = {
    unverified: 'bg-amber-50 text-amber-700 border-amber-200',
    pending: 'bg-blue-50 text-blue-700 border-blue-200',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-slate-900 select-none">
      
      {/* Top Banner: Trader Identity & Metrics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${kycColors[user.kyc_status || 'unverified']}`}>
                KYC: {user.kyc_status || 'unverified'}
              </span>
            </div>
            <div className="text-slate-500 text-xs mt-1.5 flex flex-wrap items-center gap-3">
              <span>Account ID: <strong className="text-slate-800">#AFX-{user.id + 10000}</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-slate-800">{user.email}</strong></span>
              <span>•</span>
              <span>Leverage: <strong className="text-blue-600 font-bold">1:{user.leverage}</strong></span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenDeposit}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              <Wallet className="w-4 h-4" />
              <span>Deposit Funds</span>
            </button>
            <button
              onClick={onOpenWithdraw}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              <ArrowDownLeft className="w-4 h-4 text-rose-500" />
              <span>Withdraw</span>
            </button>
            {user.kyc_status !== 'approved' && (
              <button
                onClick={onOpenKyc}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify KYC</span>
              </button>
            )}
          </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] text-slate-500 uppercase font-sans font-bold">Wallet Balance</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              ${(metrics?.balance ?? user.balance).toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] text-slate-500 uppercase font-sans font-bold">Account Equity</span>
            <div className={`text-xl sm:text-2xl font-black font-mono mt-0.5 ${(metrics?.floatingPnl ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${(metrics?.equity ?? user.balance).toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] text-slate-500 uppercase font-sans font-bold">Used Margin</span>
            <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono mt-0.5">
              ${(metrics?.usedMargin ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-[11px] text-slate-500 uppercase font-sans font-bold">Free Margin</span>
            <div className="text-xl sm:text-2xl font-black text-blue-600 font-mono mt-0.5">
              ${(metrics?.freeMargin ?? user.balance).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access to WebTrader Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-500/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black">Live WebTrader Terminal</h3>
            <p className="text-xs text-blue-100 mt-0.5">Execute instant buy & sell orders with TradingView charting and institutional pricing.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('trade')}
          className="flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-700 font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0 hover:scale-105"
        >
          <span>Launch WebTrader</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Deposit & Withdrawal History</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono font-bold">{transactions.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No transactions yet. Click Deposit to fund your trading wallet.
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50/80 font-bold">
                  <th className="py-3 px-4">Tx ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Details / TxHash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {transactions.map((tx) => {
                  const isDeposit = tx.type === 'DEPOSIT';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-500">#TX-{tx.id}</td>
                      <td className="py-3 px-4 text-slate-500 font-sans text-[11px]">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isDeposit ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{tx.method}</td>
                      <td className="py-3 px-4 font-black text-slate-900 text-sm">
                        ${tx.amount.toFixed(2)} USD
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-[200px]">
                        {tx.tx_hash || tx.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
