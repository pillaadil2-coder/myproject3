import React, { useState } from 'react';
import { kycAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function KycModal({ isOpen, onClose, onSuccess }) {
  const { user, refreshMetrics } = useAuth();
  const [docType, setDocType] = useState('PASSPORT');
  const [docNumber, setDocNumber] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('docType', docType);
      formData.append('docNumber', docNumber);
      if (file) {
        formData.append('document', file);
      }

      const res = await kycAPI.submitKyc(formData);
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
      setErrorMsg(err.response?.data?.message || err.message || 'Submission failed');
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
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>KYC Verification</span>
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
              <span className="font-black text-base">KYC Documents Uploaded!</span>
              <p className="text-xs text-slate-600 font-sans">{successMsg}</p>
            </div>
          ) : (
            <>
              {/* Document Type */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Select Identity Document</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'PASSPORT', label: 'Passport' },
                    { id: 'NATIONAL_ID', label: 'National ID' },
                    { id: 'DRIVING_LICENSE', label: 'License' }
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setDocType(m.id)}
                      className={`py-2 px-1 rounded-xl font-bold border transition-all text-center ${
                        docType === m.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Number */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Document / ID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Z91820491 or National ID"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs"
                />
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">Upload Document Photo / PDF</label>
                <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl cursor-pointer transition-colors text-center">
                  <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-slate-700 font-bold">
                    {file ? file.name : 'Click to select document file'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, or PDF up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
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
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-98"
              >
                {submitting ? 'Submitting Documents...' : 'Submit KYC for Verification'}
              </button>
            </>
          )}

        </form>

      </div>
    </div>
  );
}
