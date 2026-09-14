import React, { useState } from 'react';
import { walletAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X, QrCode, Copy, Check, AlertCircle, CheckCircle, ArrowDownCircle } from 'lucide-react';

export default function DepositModal({ isOpen, onClose, onSuccess }) {
  const { refreshMetrics } = useAuth();
  const [method, setMethod] = useState('USDT_TRC20');
  const [amount, setAmount] = useState('500');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const walletAddresses = {
    'USDT_TRC20': 'TX8mK8H6XyQp1v9z9eX7eB2C4V6B8N0L2K',
    'USDT_ERC20': '0x71C...B29',
    'UPI': 'aventrafxbroker@icici'
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('method', method);
      formData.append('tx_hash', txHash);
      formData.append('notes', `Deposit via ${method}`);

      const res = await walletAPI.requestDeposit(formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        refreshMetrics();
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Deposit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ArrowDownCircle className="w-5 h-5 text-blue-600" />
            <span>Deposit Funds to Wallet</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {successMsg ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-col items-center text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
              <span className="font-black text-base">Deposit Request Submitted!</span>
              <p className="text-xs text-slate-600 font-sans">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Payment Method Selector */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Select Deposit Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'USDT_TRC20', label: 'USDT (TRC20)' },
                    { id: 'BANK_TRANSFER', label: 'Bank Wire' },
                    { id: 'UPI', label: 'UPI / QR' }
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`py-2 px-1 rounded-xl font-bold border transition-all text-center ${
                        method === m.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Address Box */}
              {method === 'USDT_TRC20' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between text-slate-600 font-medium">
                    <span>Official USDT TRC-20 Address:</span>
                    <span className="text-blue-700 text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Network: TRON</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      readOnly
                      value={walletAddresses['USDT_TRC20']}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px] select-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(walletAddresses['USDT_TRC20'])}
                      className="p-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl transition-colors shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                    </button>
                  </div>
                </div>
              )}

              {method === 'BANK_TRANSFER' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 font-sans text-slate-700">
                  <div className="text-slate-900 font-bold text-xs mb-1">Official Corporate Bank Account:</div>
                  <div><span className="text-slate-500">Bank:</span> Standard Chartered / HDFC</div>
                  <div><span className="text-slate-500">Beneficiary:</span> Aventra FX Global Ltd</div>
                  <div><span className="text-slate-500">Account No:</span> 98230192840192</div>
                  <div><span className="text-slate-500">IFSC / SWIFT:</span> SCBLINBBXXX</div>
                </div>
              )}

              {method === 'UPI' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
                  <div className="text-slate-700 font-semibold">Scan UPI QR or Pay to VPA:</div>
                  <div className="inline-block p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
                    <div className="w-24 h-24 bg-slate-900 flex items-center justify-center text-white text-[10px] font-mono text-center p-2 rounded-xl">
                      [AVENTRA FX OFFICIAL UPI QR]
                    </div>
                  </div>
                  <div className="font-mono text-xs text-blue-600 font-bold">aventrafxbroker@icici</div>
                </div>
              )}

              {/* Amount Input with presets */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Deposit Amount (USD $)</label>
                <input
                  type="number"
                  min="10"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {['100', '500', '1000', '5000'].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setAmount(preset)}
                      className="py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold transition-colors"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Hash / UTR */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Transaction Hash / UTR / Reference No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0x3f... or UTR 420918..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-98"
              >
                {submitting ? 'Submitting Deposit...' : 'Confirm Deposit Request'}
              </button>
            </>
          )}

        </form>

      </div>
    </div>
  );
}
