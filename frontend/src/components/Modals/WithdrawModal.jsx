import React, { useState } from 'react';
import { walletAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X, AlertCircle, CheckCircle, ArrowDownLeft } from 'lucide-react';

export default function WithdrawModal({ isOpen, onClose, onSuccess }) {
  const { metrics, refreshMetrics } = useAuth();
  const [method, setMethod] = useState('USDT_TRC20');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const freeMargin = metrics ? metrics.freeMargin : 0;

  const handleMax = () => {
    if (freeMargin > 0) {
      setAmount(Math.floor(freeMargin).toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > freeMargin) {
      setErrorMsg(`Amount exceeds available free margin ($${freeMargin.toFixed(2)})`);
      setSubmitting(false);
      return;
    }

    try {
      const res = await walletAPI.requestWithdraw({
        amount: withdrawAmount,
        method,
        address,
        notes: `Withdrawal to ${address}`
      });

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
      setErrorMsg(err.response?.data?.message || err.message || 'Withdrawal request failed');
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
            <ArrowDownLeft className="w-5 h-5 text-rose-600" />
            <span>Withdraw Funds</span>
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
              <span className="font-black text-base">Withdrawal Request Received!</span>
              <p className="text-xs text-slate-600 font-sans">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Free Margin Notice */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between font-mono">
                <span className="text-slate-600 font-sans font-medium">Available Free Margin:</span>
                <span className="text-emerald-600 font-black text-base">
                  ${freeMargin.toFixed(2)} USD
                </span>
              </div>

              {/* Method */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Withdrawal Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'USDT_TRC20', label: 'USDT (TRC-20)' },
                    { id: 'BANK_TRANSFER', label: 'Bank Wire' }
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

              {/* Amount */}
              <div>
                <div className="flex justify-between text-slate-700 mb-1.5 font-bold">
                  <span>Withdraw Amount (USD $)</span>
                  <button
                    type="button"
                    onClick={handleMax}
                    className="text-blue-600 hover:underline font-extrabold"
                  >
                    Withdraw Max
                  </button>
                </div>
                <input
                  type="number"
                  min="20"
                  max={freeMargin}
                  step="1"
                  required
                  placeholder="Min $20.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
              </div>

              {/* Destination Address / Account details */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  {method === 'USDT_TRC20' ? 'Your USDT TRC20 Wallet Address' : 'Your Bank Account Details & IBAN/IFSC'}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={method === 'USDT_TRC20' ? 'e.g. T...' : 'Bank Name, Account Number, IFSC/IBAN, Beneficiary Name'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs resize-none"
                />
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || freeMargin <= 0}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-rose-600/25 transition-all active:scale-98"
              >
                {submitting ? 'Submitting Request...' : 'Submit Withdrawal Request'}
              </button>
            </>
          )}

        </form>

      </div>
    </div>
  );
}
