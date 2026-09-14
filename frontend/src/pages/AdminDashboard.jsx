import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Sliders, 
  DollarSign, 
  PlusCircle, 
  MinusCircle,
  RefreshCw,
  Search,
  Activity,
  Layers,
  FileText,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { user, login } = useAuth();
  const [stats, setStats] = useState(null);
  const [traders, setTraders] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [kycList, setKycList] = useState([]);
  const [openTrades, setOpenTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('traders'); // 'traders' | 'deposits' | 'withdrawals' | 'kyc' | 'trades'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal for Balance Adjustment
  const [adjustModal, setAdjustModal] = useState(null); // { user, type: 'CREDIT' | 'DEBIT', amount: '', note: '' }
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Quick Admin Login State for when user is not admin
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, tradersRes, depRes, withRes, kycRes, tradesRes] = await Promise.all([
        adminAPI.getStats().catch(e => ({ data: { success: false, stats: null } })),
        adminAPI.getTraders().catch(e => ({ data: { success: false, traders: [] } })),
        adminAPI.getTransactions({ type: 'DEPOSIT', status: 'PENDING' }).catch(e => ({ data: { success: false, transactions: [] } })),
        adminAPI.getTransactions({ type: 'WITHDRAWAL', status: 'PENDING' }).catch(e => ({ data: { success: false, transactions: [] } })),
        adminAPI.getKycList().catch(e => ({ data: { success: false, kycList: [] } })),
        adminAPI.getOpenTrades().catch(e => ({ data: { success: false, trades: [] } }))
      ]);

      if (statsRes?.data?.success && statsRes.data.stats) {
        setStats(statsRes.data.stats);
      } else {
        setStats({
          totalUsers: 0,
          totalBalance: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          pendingDepositsCount: 0,
          pendingWithdrawalsCount: 0,
          pendingKycCount: 0,
          openTradesCount: 0
        });
      }

      const tradersData = tradersRes?.data?.traders || [];
      setTraders(Array.isArray(tradersData) ? tradersData : []);

      const depData = depRes?.data?.transactions || [];
      setDeposits(Array.isArray(depData) ? depData : []);

      const withData = withRes?.data?.transactions || [];
      setWithdrawals(Array.isArray(withData) ? withData : []);

      const kycData = kycRes?.data?.kycList || kycRes?.data?.users || [];
      setKycList(Array.isArray(kycData) ? kycData : []);

      const tradesData = tradesRes?.data?.openTrades || tradesRes?.data?.trades || [];
      setOpenTrades(Array.isArray(tradesData) ? tradesData : []);

    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Unable to load backoffice data. Please ensure you are signed in with Super Admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleQuickAdminLogin = async () => {
    setAdminLoginLoading(true);
    try {
      await login('admin@royalfx.com', 'admin123');
      showNotification('success', 'Logged in as Aventra FX Super Admin!');
    } catch (err) {
      showNotification('error', err.message || 'Super Admin login failed');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleApproveDeposit = async (id) => {
    setActionLoading(true);
    try {
      const res = await adminAPI.approveDeposit(id);
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Deposit approved successfully!');
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectDeposit = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await adminAPI.rejectDeposit(id, { reason });
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Deposit rejected');
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveWithdrawal = async (id) => {
    setActionLoading(true);
    try {
      const res = await adminAPI.approveWithdrawal(id);
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Withdrawal approved successfully!');
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason === null) return;

    setActionLoading(true);
    try {
      const res = await adminAPI.rejectWithdrawal(id, { reason });
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Withdrawal rejected');
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateKyc = async (userId, status) => {
    setActionLoading(true);
    try {
      const res = await adminAPI.updateKycStatus(userId, { status });
      if (res.data?.success) {
        showNotification('success', res.data.message || `KYC updated to ${status}`);
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdjustBalanceSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModal?.amount || parseFloat(adjustModal.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminAPI.adjustBalance({
        userId: adjustModal.user.id,
        amount: parseFloat(adjustModal.amount),
        type: adjustModal.type,
        note: adjustModal.note || `Admin ${adjustModal.type} adjustment`
      });

      if (res.data?.success) {
        showNotification('success', res.data.message || 'Balance updated successfully!');
        setAdjustModal(null);
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleForceCloseTrade = async (tradeId) => {
    if (!confirm(`Are you sure you want to force close Trade #${tradeId}?`)) return;

    setActionLoading(true);
    try {
      const res = await adminAPI.forceCloseTrade(tradeId);
      if (res.data?.success) {
        showNotification('success', res.data.message || 'Trade closed successfully');
        loadData();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered lists based on search
  const filteredTraders = useMemo(() => {
    if (!searchQuery.trim()) return traders;
    const q = searchQuery.toLowerCase();
    return traders.filter(t => 
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      String(t.id).includes(q)
    );
  }, [traders, searchQuery]);

  const pendingKycCount = useMemo(() => {
    return Array.isArray(kycList) ? kycList.filter(k => k?.kyc_status === 'pending').length : 0;
  }, [kycList]);

  // If user is not logged in as Admin, show dedicated Super Admin Access card
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 text-slate-900">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Aventra FX Backoffice CRM</h2>
            <p className="text-xs text-slate-500 mt-2">
              Super Admin authorization is required to access risk management, trader balances, and compliance controls.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2">
            <div className="text-[11px] font-bold uppercase text-slate-500 font-mono">
              Demo Super Admin Credentials:
            </div>
            <div className="text-xs font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
              <div>Email: <strong>admin@royalfx.com</strong></div>
              <div>Password: <strong>admin123</strong></div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleQuickAdminLogin}
              disabled={adminLoginLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
            >
              {adminLoginLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>1-Click Sign In as Super Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('home')}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Return to Aventra FX Homepage
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 select-none">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Aventra FX Backoffice CRM</h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time control center for trader accounts, deposits, withdrawals, KYC compliance, and live market risk.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh CRM'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="flex-1 font-medium">{error}</span>
          <button onClick={loadData} className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700">Retry</button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Total Traders</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {stats ? (stats.totalUsers ?? 0) : traders.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Client Balances</span>
          <div className="text-xl font-black text-blue-600 mt-1">
            ${stats ? Number(stats.totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Total Deposits</span>
          <div className="text-xl font-black text-emerald-600 mt-1">
            ${stats ? Number(stats.totalDeposits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Total Withdrawals</span>
          <div className="text-xl font-black text-rose-600 mt-1">
            ${stats ? Number(stats.totalWithdrawals || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Pending Deposits</span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {deposits.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block">Active Trades</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {openTrades.length}
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
          {[
            { id: 'traders', label: 'Traders Directory', count: traders.length },
            { id: 'deposits', label: 'Pending Deposits', count: deposits.length },
            { id: 'withdrawals', label: 'Pending Withdrawals', count: withdrawals.length },
            { id: 'kyc', label: 'KYC Compliance', count: pendingKycCount },
            { id: 'trades', label: 'Live Trades Risk', count: openTrades.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === tab.id 
                    ? tab.id === 'deposits' || tab.id === 'withdrawals' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800' 
                    : 'bg-slate-300 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        {activeTab === 'traders' && (
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trader name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        
        {/* TAB 1: TRADERS */}
        {activeTab === 'traders' && (
          <div className="overflow-x-auto">
            {filteredTraders.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-sans">
                {searchQuery ? 'No traders found matching search query.' : 'No registered traders found.'}
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 font-bold">
                    <th className="py-3 px-4">Trader ID</th>
                    <th className="py-3 px-4">Name / Email</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Equity</th>
                    <th className="py-3 px-4">Leverage</th>
                    <th className="py-3 px-4">KYC Status</th>
                    <th className="py-3 px-4">Active Trades</th>
                    <th className="py-3 px-4 text-center">Manage Funds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredTraders.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500">#AFX-{Number(t.id || 0) + 10000}</td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {t.name || 'Anonymous Trader'}
                          {t.role === 'admin' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{t.email}</div>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 text-sm">
                        ${Number(t.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        ${Number(t.equity ?? t.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-bold">1:{t.leverage || 100}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.kyc_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          t.kyc_status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {t.kyc_status || 'unverified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {t.openTradesCount || 0} active
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setAdjustModal({ user: t, type: 'CREDIT', amount: '', note: '' })}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-sans font-bold flex items-center gap-1 transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Credit</span>
                          </button>
                          <button
                            onClick={() => setAdjustModal({ user: t, type: 'DEBIT', amount: '', note: '' })}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-sans font-bold flex items-center gap-1 transition-colors"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>Debit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: PENDING DEPOSITS */}
        {activeTab === 'deposits' && (
          <div className="overflow-x-auto">
            {deposits.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-sans">
                No pending deposits at this time. All funding requests are up to date.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 font-bold">
                    <th className="py-3 px-4">Tx ID</th>
                    <th className="py-3 px-4">Trader</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">TxHash / Proof Reference</th>
                    <th className="py-3 px-4 text-center">Approve / Reject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {deposits.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500">#DEP-{tx.id}</td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900">{tx.user_name || `Trader #${tx.user_id}`}</div>
                        <div className="text-[11px] text-slate-500">{tx.user_email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">{tx.method || 'CRYPTO'}</td>
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                        ${Number(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-[200px]">
                        {tx.tx_hash || tx.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            disabled={actionLoading}
                            onClick={() => handleApproveDeposit(tx.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] font-sans flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleRejectDeposit(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] font-sans flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: PENDING WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="overflow-x-auto">
            {withdrawals.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-sans">
                No pending withdrawals to review. All payouts processed.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 font-bold">
                    <th className="py-3 px-4">Tx ID</th>
                    <th className="py-3 px-4">Trader</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Destination Address / Bank</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {withdrawals.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500">#WTH-{tx.id}</td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900">{tx.user_name || `Trader #${tx.user_id}`}</div>
                        <div className="text-[11px] text-slate-500">{tx.user_email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">{tx.method || 'USDT-TRC20'}</td>
                      <td className="py-3 px-4 font-black text-rose-600 text-sm">
                        ${Number(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px] truncate max-w-[220px]">
                        {tx.tx_hash || tx.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            disabled={actionLoading}
                            onClick={() => handleApproveWithdrawal(tx.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] font-sans flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Pay</span>
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleRejectWithdrawal(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] font-sans flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 4: KYC COMPLIANCE */}
        {activeTab === 'kyc' && (
          <div className="overflow-x-auto">
            {kycList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-sans">
                No KYC compliance documents submitted yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 font-bold">
                    <th className="py-3 px-4">Trader</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">ID Number</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-center">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {kycList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-slate-900">{k.name}</div>
                        <div className="text-[11px] text-slate-500">{k.email}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700 uppercase">{k.kyc_doc_type || 'ID Card'}</td>
                      <td className="py-3 px-4 text-slate-600">{k.kyc_doc_number || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          k.kyc_status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          k.kyc_status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {k.kyc_status || 'unverified'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            disabled={actionLoading || k.kyc_status === 'approved'}
                            onClick={() => handleUpdateKyc(k.id, 'approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-[11px] font-sans flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            disabled={actionLoading || k.kyc_status === 'rejected'}
                            onClick={() => handleUpdateKyc(k.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-700 border border-rose-200 font-bold text-[11px] font-sans flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 5: LIVE OPEN TRADES (RISK MONITOR) */}
        {activeTab === 'trades' && (
          <div className="overflow-x-auto">
            {openTrades.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-sans">
                No active open trades across the broker. Market exposure is zero.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50 font-bold">
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Trader</th>
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Lots</th>
                    <th className="py-3 px-4">Open Price</th>
                    <th className="py-3 px-4">Current Price</th>
                    <th className="py-3 px-4">Floating P&L</th>
                    <th className="py-3 px-4 text-center">Risk Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {openTrades.map((t) => {
                    const isBuy = t.type === 'BUY';
                    const isPositive = Number(t.pnl || 0) >= 0;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-500">#{t.id}</td>
                        <td className="py-3 px-4 font-sans">
                          <div className="font-bold text-slate-900">{t.user_name || `Trader #${t.user_id}`}</div>
                          <div className="text-[11px] text-slate-500">{t.user_email}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{t.symbol}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBuy ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{Number(t.lot_size || 0).toFixed(2)}</td>
                        <td className="py-3 px-4 text-slate-600">{t.open_price}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{t.current_price}</td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPositive ? '+' : ''}${Number(t.pnl || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            disabled={actionLoading}
                            onClick={() => handleForceCloseTrade(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-sans font-bold text-[10px] transition-colors"
                          >
                            Force Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      {/* Adjust Balance Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {adjustModal.type === 'CREDIT' ? 'Credit (Deposit)' : 'Debit (Deduct)'} Funds
              </h3>
              <button 
                onClick={() => setAdjustModal(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 font-medium">
              Trader: <strong>{adjustModal.user?.name}</strong> (#{adjustModal.user?.email})
            </div>

            <form onSubmit={handleAdjustBalanceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Adjustment Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustModal({ ...adjustModal, type: 'CREDIT' })}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      adjustModal.type === 'CREDIT' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    + Credit (Add)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustModal({ ...adjustModal, type: 'DEBIT' })}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      adjustModal.type === 'DEBIT' ? 'border-rose-600 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    - Debit (Deduct)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Amount (USD $)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 500"
                  value={adjustModal.amount}
                  onChange={(e) => setAdjustModal({ ...adjustModal, amount: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Reason / Reference Note</label>
                <input
                  type="text"
                  placeholder="e.g. Bonus, Bank Wire, Correction"
                  value={adjustModal.note}
                  onChange={(e) => setAdjustModal({ ...adjustModal, note: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all"
              >
                {actionLoading ? 'Updating Balance...' : 'Apply Balance Change'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
